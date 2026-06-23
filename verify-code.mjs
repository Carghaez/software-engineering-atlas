// verify-code.mjs — compile AND run every code snippet for one language, so only
// correct code merges. Zero npm dependencies: Node built-ins drive the CI-only
// toolchains (rustc / g++ / gcc / javac+java / dotnet). These toolchains live only
// in CI and do NOT change the app's zero-runtime-dependency stance — the shipped
// site is still static HTML + JS with no backend.
//
// Usage:   node verify-code.mjs <c|cpp|cs|java|rust>
//
// For each concepts/<id>/<lang>.<ext> it builds and runs the program in an isolated
// temp dir and checks the EXIT CODE: success = 0, so every snippet must carry at
// least one assertion that aborts / exits non-zero on failure. Prints a per-file
// PASS/FAIL report and exits non-zero if any snippet fails (or fails to build).

import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CONCEPTS_DIR = join(ROOT, 'concepts');
const WIN = process.platform === 'win32';
const EXE = WIN ? 'prog.exe' : 'prog';

// language -> source extension
const EXT = { c: 'c', cpp: 'cpp', cs: 'cs', java: 'java', rust: 'rs' };
const LANGS = Object.keys(EXT);

const COMPILE_TIMEOUT = 120_000; // ms — first-time toolchain warmup can be slow
const RUN_TIMEOUT = 15_000;      // ms — snippets are tiny; a hang is a failure

// Run a command, capturing output. Returns { ok, code, signal, out, cmd }.
function exec(cmd, args, { cwd, timeout, input } = {}) {
  const r = spawnSync(cmd, args, {
    cwd, timeout, input,
    encoding: 'utf8',
    windowsHide: true,
  });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  if (r.error && r.error.code === 'ENOENT') {
    return { ok: false, code: null, missing: true, out: `toolchain not found: ${cmd}`, cmd: `${cmd} ${args.join(' ')}` };
  }
  return { ok: r.status === 0 && !r.signal, code: r.status, signal: r.signal, out, cmd: `${cmd} ${args.join(' ')}` };
}

// Per-language build+run. Each returns { ok, stage, log }. `stage` is 'compile'
// or 'run' on failure. Everything happens inside the isolated `dir`.
const RUNNERS = {
  async rust(dir, file) {
    const c = exec('rustc', ['-O', '--edition', '2021', '-o', join(dir, EXE), file], { cwd: dir, timeout: COMPILE_TIMEOUT });
    if (!c.ok) return { ok: false, stage: 'compile', log: c.out, missing: c.missing };
    const r = exec(join(dir, EXE), [], { cwd: dir, timeout: RUN_TIMEOUT });
    return { ok: r.ok, stage: 'run', log: r.out };
  },
  async cpp(dir, file) {
    const c = exec('g++', ['-std=c++20', '-O2', '-o', join(dir, EXE), file], { cwd: dir, timeout: COMPILE_TIMEOUT });
    if (!c.ok) return { ok: false, stage: 'compile', log: c.out, missing: c.missing };
    const r = exec(join(dir, EXE), [], { cwd: dir, timeout: RUN_TIMEOUT });
    return { ok: r.ok, stage: 'run', log: r.out };
  },
  async c(dir, file) {
    const c = exec('gcc', ['-std=c17', '-O2', '-o', join(dir, EXE), file, '-lm'], { cwd: dir, timeout: COMPILE_TIMEOUT });
    if (!c.ok) return { ok: false, stage: 'compile', log: c.out, missing: c.missing };
    const r = exec(join(dir, EXE), [], { cwd: dir, timeout: RUN_TIMEOUT });
    return { ok: r.ok, stage: 'run', log: r.out };
  },
  async java(dir, file) {
    // Source uses a non-public `class Main`, so the file name `java.java` is legal.
    const c = exec('javac', ['-d', dir, file], { cwd: dir, timeout: COMPILE_TIMEOUT });
    if (!c.ok) return { ok: false, stage: 'compile', log: c.out, missing: c.missing };
    // -ea enables `assert`, so idiomatic Java assertions abort with a non-zero exit.
    const r = exec('java', ['-ea', '-cp', dir, 'Main'], { cwd: dir, timeout: RUN_TIMEOUT });
    return { ok: r.ok, stage: 'run', log: r.out };
  },
  async cs(dir, file) {
    // Simplest single-file path: a tiny generated SDK project + `dotnet run`.
    // The snippet is the project's only source; dotnet run's exit code is the app's.
    await writeFile(join(dir, 'prog.csproj'),
      '<Project Sdk="Microsoft.NET.Sdk">\n' +
      '  <PropertyGroup>\n' +
      '    <OutputType>Exe</OutputType>\n' +
      '    <TargetFramework>net8.0</TargetFramework>\n' +
      '    <ImplicitUsings>enable</ImplicitUsings>\n' +
      '    <Nullable>enable</Nullable>\n' +
      '    <AssemblyName>prog</AssemblyName>\n' +
      '  </PropertyGroup>\n' +
      '</Project>\n');
    const src = await readFile(file, 'utf8');
    await writeFile(join(dir, 'Program.cs'), src);
    const r = exec('dotnet', ['run', '-c', 'Release', '--project', dir, '--nologo', '-v', 'quiet'],
      { cwd: dir, timeout: COMPILE_TIMEOUT });
    // dotnet run reports both build and run failures via exit code.
    return { ok: r.ok, stage: 'build/run', log: r.out, missing: r.missing };
  },
};

async function findSnippets(lang) {
  const ext = EXT[lang];
  let entries = [];
  try { entries = await readdir(CONCEPTS_DIR, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const file = join(CONCEPTS_DIR, e.name, `${lang}.${ext}`);
    try { await readFile(file); out.push({ id: e.name, file }); } catch { /* not provided */ }
  }
  out.sort((a, b) => (a.id < b.id ? -1 : 1));
  return out;
}

async function main() {
  const lang = process.argv[2];
  if (!LANGS.includes(lang)) {
    console.error(`usage: node verify-code.mjs <${LANGS.join('|')}>`);
    process.exit(2);
  }

  const snippets = await findSnippets(lang);
  if (!snippets.length) {
    console.log(`verify-code: no ${lang} snippets found — nothing to verify.`);
    return;
  }

  const work = join(tmpdir(), `atlas-verify-${lang}-${process.pid}`);
  await mkdir(work, { recursive: true });
  console.log(`verify-code: ${snippets.length} ${lang} snippet(s)\n`);

  const failures = [];
  let i = 0;
  for (const s of snippets) {
    const dir = join(work, `${i++}-${s.id}`);
    await mkdir(dir, { recursive: true });
    const res = await RUNNERS[lang](dir, s.file);
    if (res.ok) {
      console.log(`  PASS  ${s.id}/${lang}.${EXT[lang]}`);
    } else {
      failures.push({ ...s, ...res });
      const tag = res.missing ? 'MISSING TOOLCHAIN' : `FAIL (${res.stage})`;
      console.log(`  ${tag}  ${s.id}/${lang}.${EXT[lang]}`);
    }
  }

  await rm(work, { recursive: true, force: true }).catch(() => {});

  if (failures.length) {
    console.error(`\n${failures.length} of ${snippets.length} ${lang} snippet(s) failed:\n`);
    for (const f of failures) {
      console.error(`──── ${f.id}/${lang}.${EXT[lang]} — ${f.missing ? 'toolchain missing' : f.stage} ────`);
      console.error((f.log || '').trim().split('\n').slice(-40).join('\n'));
      console.error('');
    }
    process.exit(1);
  }
  console.log(`\nAll ${snippets.length} ${lang} snippet(s) compiled and ran with passing assertions.`);
}

await main();
