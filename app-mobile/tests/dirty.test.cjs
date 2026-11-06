const test = require('node:test');
const assert = require('node:assert/strict');
const { isDirty } = require('../services/dirty.cjs');

test('checks values and unordered relationships', () => {
  const initial = { text: 'Obra', extra: null, ids: ['a', 'b'] };
  assert.equal(isDirty(initial, { text: ' Obra ', extra: '', ids: ['b', 'a'] }), false);
  assert.equal(isDirty(initial, { ...initial, text: 'Novo' }), true);
  assert.equal(isDirty(initial, { ...initial, ids: ['b'] }), true);
});
