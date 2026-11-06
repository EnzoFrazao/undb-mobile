const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeText, pluralize } = require('../services/text.cjs');

test('normalizes accents and inflects quantities', () => {
  assert.equal(normalizeText('  SÃO Luís  '), 'sao luis');
  assert.equal(pluralize(1, 'foto'), '1 foto');
  assert.equal(pluralize(0, 'obra'), '0 obras');
  assert.equal(pluralize(2, 'responsável', 'responsáveis'), '2 responsáveis');
});
