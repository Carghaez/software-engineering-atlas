// Verifies build.mjs produces crawlable, valid output. Importing build.mjs does
// NOT write files (the write step is guarded behind a run-directly check), so
// these are pure unit tests over the generated HTML/XML strings.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { conceptPage, glossaryPage, sitemap, CONCEPTS, BASE } from '../build.mjs';

test('sitemap lists home + glossary + every concept', () => {
  const xml = sitemap();
  const count = (xml.match(/<loc>/g) || []).length;
  assert.equal(count, CONCEPTS.length + 2, 'one <loc> per concept plus home and glossary');
  assert.ok(xml.includes(`<loc>${BASE}/</loc>`), 'includes home');
  assert.ok(xml.includes(`<loc>${BASE}/c/</loc>`), 'includes glossary');
});

test('a concept page has required SEO tags and valid JSON-LD', () => {
  const c = CONCEPTS.find((x) => x.id === 'hash-table') || CONCEPTS[0];
  const html = conceptPage(c);
  assert.ok(html.includes('<title>'), 'has <title>');
  assert.ok(html.includes(`rel="canonical" href="${BASE}/c/${c.id}/"`), 'has self canonical');
  assert.ok(html.includes('property="og:title"'), 'has Open Graph');
  assert.ok(html.includes('name="description"'), 'has meta description');

  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, 'has a JSON-LD block');
  const data = JSON.parse(m[1]); // throws if the JSON-LD is malformed
  assert.equal(data['@type'], 'DefinedTerm');
  assert.equal(data.termCode, c.id);
  assert.ok(data.author && data.author.name, 'JSON-LD carries an author');
});

test('every concept page renders and links to its own canonical path', () => {
  for (const c of CONCEPTS) {
    const html = conceptPage(c);
    assert.ok(html.length > 500, `page for ${c.id} looks empty`);
    assert.ok(html.includes(`/c/${c.id}/`), `page for ${c.id} missing its own path`);
  }
});

test('glossary links to every concept', () => {
  const html = glossaryPage();
  const missing = CONCEPTS.filter((c) => !html.includes(`/c/${c.id}/`)).map((c) => c.id);
  assert.deepEqual(missing, [], `glossary missing: ${missing.join(', ')}`);
});
