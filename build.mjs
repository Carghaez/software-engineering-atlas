// build.mjs — prerender one static, crawlable HTML page per concept for SEO.
//
// Reads the SAME concept data the interactive app uses (concepts.js / data/*.js)
// and emits:
//   c/<id>/index.html   — a static page per concept (real text + JSON-LD + meta)
//   c/index.html        — a glossary hub linking every concept (internal-link graph)
//   sitemap.xml         — home + glossary + every concept page
//
// Run:  node build.mjs   (or: npm run build)
// These outputs are generated; commit them, or let .github/workflows/pages.yml build on push.

import { writeFile, mkdir, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { tokenize, LANG_LABELS, LANG_EXT, CODE_LANG_ORDER } from './lib/highlight.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// Production base URL (no trailing slash). Override via BASE_URL env for forks / custom domains.
const BASE = (process.env.BASE_URL || 'https://carghaez.github.io/software-engineering-atlas').replace(/\/+$/, '');

// Developer / attribution.
const AUTHOR = {
  name: 'Gaetano Pietro Paolo Carpinato',
  linkedin: 'https://www.linkedin.com/in/gaetanocarpinato',
  github: 'https://github.com/Carghaez',
  repo: 'https://github.com/Carghaez/software-engineering-atlas',
};

const {
  CONCEPTS, DOMAIN_MAP, DOMAINS, LEVELS, LANGS, TEMPLATE_LABEL, TEMPLATE_MAP, conceptSources,
} = await import('./concepts.js');

// ---------- code examples (concepts/<id>/<lang>.<ext>) ----------
// The source of truth is real per-language files under concepts/<id>/. We load
// them once, embed highlighted code into the static pages, and emit a small
// code-index.json the SPA fetches to know which concepts/languages have code.
async function loadAllCode() {
  const map = new Map();
  let entries = [];
  try { entries = await readdir(join(ROOT, 'concepts'), { withFileTypes: true }); } catch { entries = []; }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const items = [];
    for (const lang of CODE_LANG_ORDER) {
      try {
        const code = await readFile(join(ROOT, 'concepts', e.name, `${lang}.${LANG_EXT[lang]}`), 'utf8');
        if (code.trim()) items.push({ lang, label: LANG_LABELS[lang], code: code.replace(/\s+$/, '') });
      } catch { /* language not provided for this concept */ }
    }
    if (items.length) map.set(e.name, items);
  }
  return map;
}
const CODE = await loadAllCode();
const codeIndex = Object.fromEntries([...CODE].map(([id, items]) => [id, items.map((i) => i.lang)]));

// ---------- helpers ----------
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// strip for attribute / description contexts (no markup, collapsed whitespace, clipped)
const plain = (s, max = 300) => {
  let t = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  if (t.length > max) t = t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
  return t;
};

// camelCase / snake_case x-field key -> "Sentence case" label
const prettify = (k) => {
  const s = k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').toLowerCase().trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const domLabel = (id) => (DOMAIN_MAP[id] || {}).label || id || '';

// Build the readable content blocks for a concept (mirrors the app's _detail fields,
// but pulls every x:{} field generically so template-specific content is included too).
function blocksFor(c) {
  const out = [];
  const x = c.x || {};
  const T = (label, text) => { if (text) out.push({ kind: 'text', label, text }); };
  const Lst = (label, items) => { if (items && items.length) out.push({ kind: 'list', label, items }); };

  T('Definition', c.def);
  T('Problem addressed', c.problem);
  T('Mechanism', c.mechanism);
  for (const [k, v] of Object.entries(x)) {
    if (typeof v === 'string') T(prettify(k), v);
    else if (Array.isArray(v) && v.length && v.every(i => typeof i === 'string')) Lst(prettify(k), v);
  }
  Lst('Benefits', c.benefits);
  Lst('Limitations & costs', c.limits);
  Lst('Failure modes', c.failures);
  Lst('When not to use', c.whenNot);
  Lst('Common misconceptions', c.myths);
  if (c.complexity) out.push({ kind: 'cx', label: 'Complexity', rows: Object.entries(c.complexity) });
  return out;
}

function blockHtml(b) {
  if (b.kind === 'text') return `<section><h2>${esc(b.label)}</h2><p>${esc(b.text)}</p></section>`;
  if (b.kind === 'list') return `<section><h2>${esc(b.label)}</h2><ul>${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></section>`;
  if (b.kind === 'cx') return `<section><h2>${esc(b.label)}</h2><table>${b.rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table></section>`;
  return '';
}

// Render the highlighted code of one panel as colored spans (lines joined by \n inside <pre>).
function codeSpans(code, lang) {
  return tokenize(code, lang)
    .map((line) => line.map((t) => `<span style="color:${t.color}">${esc(t.text)}</span>`).join(''))
    .join('\n');
}

// A self-contained, no-JS-needed Code section: CSS-only radio tabs keep every
// language in the DOM (crawlable). The copy button is the only progressive bit.
function codeHtml(c) {
  const items = CODE.get(c.id);
  if (!items || !items.length) return '';
  const cb = `cb-${c.id}`;
  const rules = items.map((it) =>
    `#${cb}-${it.lang}:checked~.tabs label[for="${cb}-${it.lang}"]{background:#1f232b;color:#fff}` +
    `#${cb}-${it.lang}:checked~.panels .p-${it.lang}{display:block}`).join('');
  const inputs = items.map((it, i) => `<input type="radio" name="${cb}" id="${cb}-${it.lang}"${i === 0 ? ' checked' : ''}>`).join('');
  const tabs = items.map((it) => `<label for="${cb}-${it.lang}">${esc(it.label)}</label>`).join('');
  const panels = items.map((it) => `<pre class="p p-${it.lang}"><code>${codeSpans(it.code, it.lang)}</code></pre>`).join('');
  return `<section class="code"><h2>Code</h2>
  <style>${rules}</style>
  <div class="codeblock" id="${cb}">${inputs}<div class="tabs">${tabs}<button type="button" class="copy" onclick="copyCode(this)">Copy</button></div><div class="panels">${panels}</div></div></section>`;
}

const CODE_SCRIPT = `<script>
function copyCode(btn){var cb=btn.closest('.codeblock');var sel=cb.querySelector('input:checked');if(!sel)return;var lang=sel.id.slice(sel.name.length+1);var pre=cb.querySelector('.p-'+lang);if(!pre)return;navigator.clipboard.writeText(pre.innerText).then(function(){var t=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=t;},1200);});}
</script>`;

function langTableHtml(c) {
  const rows = LANGS.map((l) => {
    const v = (c.langs && c.langs[l.id]) || {};
    const lvl = v.lvl || 'UNKNOWN';
    const lvlLabel = (LEVELS[lvl] || {}).label || lvl;
    const idiom = (v.id == null) ? '—' : String(v.id);
    return `<tr><th>${esc(l.label)}</th><td>${esc(lvlLabel)}</td><td>${esc(idiom)}</td><td>${esc(v.note || '')}</td></tr>`;
  }).join('');
  return `<section><h2>Language support &amp; idiomaticity</h2>
  <table class="langs"><thead><tr><th>Language</th><th>Support level</th><th>Idiomaticity (0–3)</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="muted">Idiomaticity is a 0–3 score (3 = most idiomatic). Support level is one of Native, Std lib, Ecosystem, Encodable, Awkward, Unsuitable, Unknown.</p></section>`;
}

function relatedHtml(c) {
  const link = (id) => { const k = CONCEPTS.find(x => x.id === id); return k ? `<a href="${BASE}/c/${esc(id)}/">${esc(k.name)}</a>` : null; };
  const parts = [];
  const rel = (c.related || []).map(link).filter(Boolean);
  const comp = (c.competing || []).map(link).filter(Boolean);
  if (rel.length) parts.push(`<section><h2>Related concepts</h2><p>${rel.join(' · ')}</p></section>`);
  if (comp.length) parts.push(`<section><h2>Competing / alternative approaches</h2><p>${comp.join(' · ')}</p></section>`);
  return parts.join('\n');
}

function sourcesHtml(c) {
  const srcs = conceptSources ? conceptSources(c) : [];
  if (!srcs.length) return '';
  const items = srcs.map(s => s.url
    ? `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a> — ${esc(s.scope)}</li>`
    : `<li>${esc(s.label)} — ${esc(s.scope)}</li>`).join('');
  return `<section><h2>Evidence &amp; sources</h2><ul>${items}</ul></section>`;
}

function jsonLd(c) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: c.name,
    termCode: c.id,
    description: plain(c.def, 5000),
    url: `${BASE}/c/${c.id}/`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Software Engineering Techniques Atlas',
      url: `${BASE}/`,
    },
  };
  if (c.aliases && c.aliases.length) data.alternateName = c.aliases;
  data.author = {
    '@type': 'Person',
    name: AUTHOR.name,
    url: AUTHOR.linkedin,
    sameAs: [AUTHOR.linkedin, AUTHOR.github],
  };
  return JSON.stringify(data);
}

const FOOTER_HTML = `<footer class="site-footer">
    <div>Built by <a href="${AUTHOR.linkedin}" rel="noopener">${esc(AUTHOR.name)}</a></div>
    <div class="links"><a href="${AUTHOR.linkedin}" rel="noopener">LinkedIn</a> · <a href="${AUTHOR.github}" rel="noopener">GitHub</a> · <a href="${AUTHOR.repo}" rel="noopener">Source</a> · <span>Code MIT · Content CC BY 4.0</span></div>
  </footer>`;

const SHARED_CSS = `
  *{box-sizing:border-box}
  body{margin:0;background:#f1f1ee;color:#22262d;font:400 16px/1.6 'IBM Plex Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .wrap{max-width:820px;margin:0 auto;padding:28px 20px 80px}
  a{color:#3f5b78}
  nav.crumbs{font:500 13px 'IBM Plex Mono',monospace;color:#8b9098;margin-bottom:18px}
  nav.crumbs a{text-decoration:none}
  h1{font:600 30px/1.2 'IBM Plex Sans';letter-spacing:-.01em;margin:0 0 6px}
  .meta{font:500 12.5px 'IBM Plex Mono',monospace;color:#8b9098;margin-bottom:8px}
  .lead{font-size:18px;color:#34383f;margin:0 0 22px}
  section{margin:22px 0}
  h2{font:600 13px 'IBM Plex Mono',monospace;letter-spacing:.04em;text-transform:uppercase;color:#42464d;margin:0 0 8px}
  ul{margin:0;padding-left:20px}
  li{margin:4px 0}
  table{border-collapse:collapse;width:100%;font-size:14px;background:#fff;border:1px solid #e7e7e1;border-radius:8px;overflow:hidden}
  th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #f1f1eb;vertical-align:top}
  table.langs th:first-child{width:90px}
  .muted{font-size:13px;color:#9aa0a8}
  .cta{display:inline-block;margin:6px 0 0;padding:10px 18px;background:#1f232b;color:#fff;border-radius:8px;text-decoration:none;font:600 14px 'IBM Plex Sans'}
  .domains h3{font:600 13px 'IBM Plex Sans';margin:22px 0 8px;color:#1c1f26}
  .domains a{display:inline-block;margin:0 10px 8px 0}
  .site-footer{margin-top:44px;padding-top:18px;border-top:1px solid #e4e4de;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font:500 12px 'IBM Plex Mono',monospace;color:#8b9098}
  .site-footer a{color:#3f5b78;text-decoration:none}
  .site-footer .links span{color:#aeb2b9}
  .code .codeblock{background:#fbfbf8;border:1px solid #e7e7e1;border-radius:10px;overflow:hidden}
  .code .codeblock input{position:absolute;width:0;height:0;opacity:0}
  .code .tabs{display:flex;gap:4px;align-items:center;padding:8px 10px;background:#f3f3ef;border-bottom:1px solid #e7e7e1;flex-wrap:wrap}
  .code .tabs label{font:600 11.5px 'IBM Plex Mono',monospace;padding:5px 11px;border-radius:6px;cursor:pointer;color:#6b7078}
  .code .copy{margin-left:auto;font:600 11px 'IBM Plex Mono',monospace;padding:5px 10px;border:1px solid #e0e0d9;border-radius:6px;background:#fafaf7;color:#42464d;cursor:pointer}
  .code .p{display:none;margin:0;padding:14px 16px;overflow-x:auto;font:500 12.5px/1.6 'IBM Plex Mono',monospace;white-space:pre;tab-size:4;color:#2a2e35}
  @media (max-width:600px){.wrap{padding:18px 14px 60px}h1{font-size:24px}}
`;

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
  `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">`;

function conceptPage(c) {
  const url = `${BASE}/c/${c.id}/`;
  const desc = plain(c.def, 300);
  const title = `${c.name} — Software Engineering Atlas`;
  const typeLabel = TEMPLATE_LABEL[TEMPLATE_MAP[c.type]] || 'Technique';
  const aka = (c.aliases && c.aliases.length) ? `<div class="meta">aka: ${esc(c.aliases.join(' · '))}</div>` : '';
  const body = blocksFor(c).map(blockHtml).join('\n');
  const code = codeHtml(c);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(c.name)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${BASE}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(c.name)}">
<meta name="twitter:description" content="${esc(desc)}">
<script type="application/ld+json">${jsonLd(c)}</script>
${FONT}
<style>${SHARED_CSS}</style>
</head>
<body>
<div class="wrap">
  <nav class="crumbs"><a href="${BASE}/">Atlas</a> / <a href="${BASE}/c/">Concepts</a> / ${esc(c.name)}</nav>
  <h1>${esc(c.name)}</h1>
  <div class="meta">${esc(domLabel(c.domain))} · ${esc(c.type || typeLabel)}${c.family ? ' · family: ' + esc(c.family) : ''}</div>
  ${aka}
  <p class="lead">${esc(c.def || '')}</p>
  <a class="cta" href="${BASE}/?c=${esc(c.id)}">Open in the interactive atlas →</a>
  ${body}
  ${code}
  ${langTableHtml(c)}
  ${relatedHtml(c)}
  ${sourcesHtml(c)}
  <section class="muted"><p>Part of the <a href="${BASE}/">Software Engineering Techniques Atlas</a> — an evidence-cited map of data structures, algorithms, paradigms, concurrency, design patterns, testing and more.</p></section>
  ${FOOTER_HTML}
</div>
${code ? CODE_SCRIPT : ''}
</body>
</html>
`;
}

function glossaryPage() {
  const byDomain = DOMAINS.map(d => ({
    label: d.label,
    items: CONCEPTS.filter(c => c.domain === d.id).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter(g => g.items.length);
  const groups = byDomain.map(g => `
    <h3>${esc(g.label)}</h3>
    <div>${g.items.map(c => `<a href="${BASE}/c/${esc(c.id)}/">${esc(c.name)}</a>`).join('')}</div>`).join('\n');
  const desc = `Index of all ${CONCEPTS.length} software engineering techniques in the atlas — data structures, algorithms, paradigms, concurrency, patterns, testing, security and more.`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>All concepts — Software Engineering Techniques Atlas</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${BASE}/c/">
<meta property="og:type" content="website">
<meta property="og:title" content="All concepts — Software Engineering Techniques Atlas">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${BASE}/c/">
${FONT}
<style>${SHARED_CSS}</style>
</head>
<body>
<div class="wrap domains">
  <nav class="crumbs"><a href="${BASE}/">Atlas</a> / Concepts</nav>
  <h1>All concepts</h1>
  <p class="lead">${esc(CONCEPTS.length)} techniques across ${esc(DOMAINS.length)} domains. Open the <a href="${BASE}/">interactive atlas</a> to filter, search and compare.</p>
  ${groups}
  ${FOOTER_HTML}
</div>
</body>
</html>
`;
}

function sitemap() {
  const urls = [`${BASE}/`, `${BASE}/c/`, ...CONCEPTS.map(c => `${BASE}/c/${c.id}/`)];
  const body = urls.map(u => `  <url><loc>${esc(u)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

// ---------- exports (consumed by test/build.test.mjs) ----------
export { BASE, AUTHOR, CONCEPTS, conceptPage, glossaryPage, sitemap, codeHtml, codeIndex, CODE };

// ---------- write (only when run directly, e.g. `node build.mjs`) ----------
async function main() {
  let n = 0;
  for (const c of CONCEPTS) {
    const dir = join(ROOT, 'c', c.id);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), conceptPage(c), 'utf8');
    n++;
  }
  await mkdir(join(ROOT, 'c'), { recursive: true });
  await writeFile(join(ROOT, 'c', 'index.html'), glossaryPage(), 'utf8');
  await writeFile(join(ROOT, 'sitemap.xml'), sitemap(), 'utf8');
  await writeFile(join(ROOT, 'code-index.json'), JSON.stringify(codeIndex), 'utf8');
  console.log(`Built ${n} concept pages + glossary + sitemap (${CONCEPTS.length + 2} URLs); code for ${CODE.size} concept(s). Base: ${BASE}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();
