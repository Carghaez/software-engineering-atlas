// Data-integrity gates over the concept set — the CI counterpart of the app's
// live QA audit (index.html `_resolvePage`, kind==='qa'). If any of these fail,
// the data is broken regardless of how the UI renders.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as mod from '../concepts.js';

const { CONCEPTS, TEMPLATE_MAP, LANGS, conceptSources, RELATIONSHIPS, PAGES } = mod;
const ids = CONCEPTS.map((c) => c.id);
const idset = new Set(ids);

test('concept ids are unique', () => {
  const dups = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  assert.deepEqual(dups, [], `duplicate ids: ${dups.join(', ')}`);
});

test('every concept has id, name, def and domain', () => {
  const bad = CONCEPTS.filter((c) => !c.id || !c.name || !c.def || !c.domain).map((c) => c.id || c.name || '(unknown)');
  assert.deepEqual(bad, [], `incomplete: ${bad.join(', ')}`);
});

test('every primary type maps to a card template', () => {
  const bad = CONCEPTS.filter((c) => !TEMPLATE_MAP[c.type]).map((c) => `${c.id} (${c.type})`);
  assert.deepEqual(bad, [], `invalid types: ${bad.join('; ')}`);
});

test('related / competing cross-references resolve', () => {
  const bad = [];
  CONCEPTS.forEach((c) => [...(c.related || []), ...(c.competing || [])].forEach((r) => { if (!idset.has(r)) bad.push(`${c.id} -> ${r}`); }));
  assert.deepEqual(bad, [], `dangling refs: ${bad.join('; ')}`);
});

test('relationship & atlas-map chips resolve to a concept', () => {
  const refs = new Set();
  (RELATIONSHIPS || []).forEach((r) => (r.nodes || []).forEach((n) => { if (n.id) refs.add(n.id); }));
  (PAGES || []).forEach((p) => {
    (p.groups || []).forEach((g) => (g.ids || []).forEach((i) => refs.add(i)));
    (p.rows || []).forEach((row) => { if (row.id) refs.add(row.id); });
  });
  const bad = [...refs].filter((i) => !idset.has(i));
  assert.deepEqual(bad, [], `dangling chip refs: ${bad.join(', ')}`);
});

test('complexity only on data-structure / algorithm / hardware cards', () => {
  const bad = CONCEPTS.filter((c) => c.complexity && !['ds', 'algo', 'hardware'].includes(TEMPLATE_MAP[c.type])).map((c) => c.id);
  assert.deepEqual(bad, [], `complexity misplaced: ${bad.join(', ')}`);
});

test('every idiomaticity score >= 2 carries a mechanism note', () => {
  const bad = [];
  CONCEPTS.forEach((c) => LANGS.forEach((l) => {
    const v = (c.langs && c.langs[l.id]) || {};
    if (v.id >= 2 && !v.note) bad.push(`${c.id}/${l.id}`);
  }));
  assert.deepEqual(bad, [], `missing notes: ${bad.join(', ')}`);
});

test('every concept cites >= 1 evidence source', () => {
  const bad = CONCEPTS.filter((c) => !(conceptSources ? conceptSources(c) : []).length).map((c) => c.id);
  assert.deepEqual(bad, [], `uncited: ${bad.join(', ')}`);
});

test('paradigms are not misclassified as algorithms', () => {
  const bad = CONCEPTS.filter((c) => c.domain === 'paradigms' && (c.type === 'Algorithm' || c.type === 'Algorithmic paradigm')).map((c) => c.id);
  assert.deepEqual(bad, [], `miscategorised: ${bad.join(', ')}`);
});

test('design principles state trade-offs (limits or whenNot)', () => {
  const bad = CONCEPTS.filter((c) => c.type === 'Design principle' && !((c.limits && c.limits.length) || (c.whenNot && c.whenNot.length))).map((c) => c.id);
  assert.deepEqual(bad, [], `without trade-offs: ${bad.join(', ')}`);
});
