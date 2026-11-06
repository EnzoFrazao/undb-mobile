const test = require('node:test');
const assert = require('node:assert/strict');
const { maskDate, parseDisplayDate, toDisplayDate, parsePercent } = require('../services/dateMask.cjs');

test('masks typed and pasted dates and validates civil dates', () => {
  assert.equal(maskDate('04.11-2026'), '04/11/2026');
  assert.equal(maskDate('041'), '04/1');
  assert.equal(toDisplayDate('2024-02-29'), '29/02/2024');
  assert.equal(parseDisplayDate('29/02/2024'), '2024-02-29');
  for (const date of ['29/02/2023', '31/04/2026', '01/13/2026', '31/12/1999', '04/11']) assert.equal(parseDisplayDate(date), null);
});

test('accepts decimal commas and rejects invalid percentages', () => {
  assert.equal(parsePercent('12,5'), 12.5);
  assert.equal(parsePercent('100.0'), 100);
  assert.equal(parsePercent('0'), 0);
  for (const value of ['', '100,1', '-1', '1e2', 'uma metade']) assert.equal(parsePercent(value), null);
});
