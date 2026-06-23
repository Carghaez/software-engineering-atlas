// index.html (served) and Atlas.dc.html (source design) must stay byte-identical.
// This guards the project's core editing invariant in CI.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('index.html and Atlas.dc.html are byte-identical', async () => {
  const [a, b] = await Promise.all([
    readFile(join(ROOT, 'index.html')),
    readFile(join(ROOT, 'Atlas.dc.html')),
  ]);
  assert.ok(a.equals(b), 'index.html and Atlas.dc.html differ — run: cp index.html Atlas.dc.html');
});
