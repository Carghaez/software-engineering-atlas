// migrate.mjs — ONE-TIME migration: data/*.js arrays -> concepts/<id>/concept.json.
//
// Run BEFORE rewiring concepts.js (it reads the current data/*.js-backed CONCEPTS).
// It writes one concept.json per concept, proves the round-trip is lossless, and
// emits the concepts.data.js bundle. After this passes, concepts.js is repointed
// at the bundle and data/ is deleted. Kept in the repo as a record of the migration.

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { assembleConcepts, serializeBundle } from './assemble.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SCHEMA_REF = '../../schema/concept.schema.json';

const { CONCEPTS } = await import('./concepts.js'); // current source (data/*.js)

let n = 0;
for (const c of CONCEPTS) {
  const dir = join(ROOT, 'concepts', c.id);
  await mkdir(dir, { recursive: true });
  // $schema first so editors (VS Code) validate the file live as it's edited.
  const doc = JSON.stringify({ $schema: SCHEMA_REF, ...c }, null, 2) + '\n';
  await writeFile(join(dir, 'concept.json'), doc, 'utf8');
  n++;
}
console.log(`Wrote ${n} concept.json files under concepts/.`);

// Lossless proof: reassemble from the files and compare to a JSON-normalized baseline.
const reassembled = await assembleConcepts();
const baseline = JSON.parse(JSON.stringify(CONCEPTS)).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
assert.deepStrictEqual(reassembled, baseline);
console.log(`Lossless verified: ${reassembled.length} reassembled concepts deep-equal the original.`);

// Emit the committed runtime bundle.
await writeFile(join(ROOT, 'concepts.data.js'), serializeBundle(reassembled), 'utf8');
console.log('Wrote concepts.data.js bundle. Next: repoint concepts.js, run tests, delete data/.');
