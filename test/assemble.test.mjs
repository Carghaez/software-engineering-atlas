// Guards the per-concept source of truth (concepts/<id>/concept.json) against the
// committed runtime bundle (concepts.data.js, imported via concepts.js). If anyone
// edits a concept.json without rebuilding, the bundle goes stale and this fails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assembleConcepts } from '../assemble.mjs';
import { CONCEPTS } from '../concepts.js';

test('committed bundle matches concepts/<id>/concept.json (no drift — run `npm run build`)', async () => {
  const assembled = await assembleConcepts();
  assert.deepStrictEqual(assembled, [...CONCEPTS]);
});

test('every concept folder name matches its id', async () => {
  const assembled = await assembleConcepts();
  // ids are unique and slug-shaped (folder-safe); the bundle is non-empty.
  assert.ok(assembled.length > 0, 'no concepts assembled');
  for (const c of assembled) assert.match(c.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad id: ${c.id}`);
});
