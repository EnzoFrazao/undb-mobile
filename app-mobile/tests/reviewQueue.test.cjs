const { test } = require('node:test');
const assert = require('node:assert/strict');
const { filterReviewReports, validReviewDate } = require('../services/reviewQueue.cjs');

const works = [{ id: 'a', name: 'Residência Jardins', contract: 'CTR-001' },
  { id: 'b', name: 'Ateliê', contract: 'CTR-002' }];
const reports = [
  { id: '1', workId: 'a', date: '2026-11-02', signature: null },
  { id: '2', workId: 'b', date: '2026-11-04', signature: { version: 1 } },
  { id: '3', workId: 'a', date: '2026-11-03', signature: null },
  { id: '4', workId: 'outro', date: '2026-11-04', signature: null },
];
const base = { status: 'pending', query: '', date: '' };
const ids = (filters, data = reports) => filterReviewReports(data, works, { ...base, ...filters }).map(({ report }) => report.id);

test('fila começa nas pendências, ignora obras indisponíveis e ordena por data', () => {
  assert.deepEqual(ids({}), ['3', '1']);
  assert.deepEqual(ids({ status: 'signed' }), ['2']);
  assert.deepEqual(ids({ status: 'all' }), ['2', '3', '1']);
});

test('combina obra, número de contrato, data civil e situação', () => {
  assert.deepEqual(ids({ query: 'residencia', date: '2026-11-02' }), ['1']);
  assert.deepEqual(ids({ query: 'ctr-002', status: 'signed' }), ['2']);
  assert.deepEqual(ids({ query: 'ctr-002', status: 'pending' }), []);
  assert.deepEqual(ids({ date: '2026-02-30' }), []);
  assert.equal(validReviewDate('2026-02-30'), false);
  assert.equal(validReviewDate('2028-02-29'), true);
});

test('após assinatura o registro sai das pendências e aparece nos assinados', () => {
  const updated = reports.map((r) => r.id === '3' ? { ...r, signature: { version: 1 } } : r);
  assert.deepEqual(ids({}, updated), ['1']);
  assert.deepEqual(ids({ status: 'signed' }, updated), ['2', '3']);
});

test('devolvidos saem das pendências até o reenvio', () => {
  const returned = reports.map((r) => r.id === '3' ? { ...r, status: 'returned' } : r);
  assert.deepEqual(ids({}, returned), ['1']);
  assert.deepEqual(ids({ status: 'returned' }, returned), ['3']);
  assert.deepEqual(ids({ status: 'all' }, returned), ['2', '3', '1']);
  assert.deepEqual(ids({}, reports), ['3', '1']);
});
