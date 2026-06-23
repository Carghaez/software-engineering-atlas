// Keeps code-example coverage honest: a runnable snippet may exist for a language
// only where the concept is idiomatic in it (concept.json langs[L].id >= 2). This
// is the on-disk counterpart of the "idiomatic only" authoring rule — it stops an
// awkward/forced snippet from sneaking in for a language the data says is a poor fit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CONCEPTS } from '../concepts.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONCEPTS_DIR = join(ROOT, 'concepts');

// language -> source extension (pseudocode is language-agnostic and exempt)
const EXT = { c: 'c', cpp: 'cpp', cs: 'cs', java: 'java', rust: 'rs' };
const byId = new Map(CONCEPTS.map((c) => [c.id, c]));

async function hasFile(id, file) {
  try { await readFile(join(CONCEPTS_DIR, id, file)); return true; } catch { return false; }
}

test('every code snippet exists only for an idiomatic language (langs[L].id >= 2)', async () => {
  const entries = await readdir(CONCEPTS_DIR, { withFileTypes: true });
  const bad = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const c = byId.get(e.name);
    for (const [lang, ext] of Object.entries(EXT)) {
      if (!(await hasFile(e.name, `${lang}.${ext}`))) continue;
      const id = c && c.langs && c.langs[lang] ? c.langs[lang].id : undefined;
      if (!(id >= 2)) bad.push(`${e.name}/${lang}.${ext} (idiomaticity=${id == null ? 'none' : id})`);
    }
  }
  assert.deepEqual(bad, [], `non-idiomatic snippets present:\n  ${bad.join('\n  ')}`);
});

test('every concept folder with code files has a concept.json', async () => {
  const entries = await readdir(CONCEPTS_DIR, { withFileTypes: true });
  const bad = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const anyCode = (await Promise.all(
      [...Object.entries(EXT), ['pseudocode', 'txt']].map(([l, x]) => hasFile(e.name, `${l}.${x}`)),
    )).some(Boolean);
    if (anyCode && !byId.has(e.name)) bad.push(e.name);
  }
  assert.deepEqual(bad, [], `code without metadata: ${bad.join(', ')}`);
});
