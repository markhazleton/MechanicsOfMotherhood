import test from 'node:test';
import assert from 'node:assert/strict';
import { toRoutePath, filterActualBrokenLinks } from '../check-links.js';

test('toRoutePath normalizes Windows-style paths and strips index.html', () => {
  assert.equal(toRoutePath('dist/public', 'dist\\public\\recipes\\index.html', true), '/recipes');
  assert.equal(toRoutePath('dist/public', 'dist\\public\\categories'), '/categories');
});

test('filterActualBrokenLinks excludes known client-side routes', () => {
  const actualBroken = filterActualBrokenLinks(['/recipes', '/categories', '/blog', '/contact']);
  assert.deepEqual(actualBroken, ['/contact']);
});
