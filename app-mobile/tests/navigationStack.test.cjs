const test = require('node:test');
const assert = require('node:assert/strict');
const { createNavState, navReduce, currentRoute, depth, backLabel, canGoBack } = require('../services/navigationStack.cjs');

test('empty stacks, independent tabs, tab reselect and reset', () => {
  const initial = createNavState();
  assert.equal(initial.tab, 'Obras');
  assert.equal(canGoBack(initial), false);
  assert.equal(navReduce(initial, { type: 'pop' }), initial);
  const work = { type: 'history', workId: 'a', date: '2026-11-06' };
  const opened = navReduce(initial, { type: 'push', route: work });
  assert.deepEqual(initial.stacks.Obras, []);
  const inbox = navReduce(opened, { type: 'select-tab', tab: 'Avisos' });
  const notice = navReduce(inbox, { type: 'push', route: { type: 'report', reportId: 'r' } });
  assert.equal(backLabel(notice), 'Avisos');
  assert.equal(depth(navReduce(notice, { type: 'pop' })), 0);
  const returned = navReduce(notice, { type: 'select-tab', tab: 'Obras' });
  assert.equal(currentRoute(returned), work);
  const root = navReduce(returned, { type: 'select-tab', tab: 'Obras' });
  assert.equal(canGoBack(root), false);
  assert.equal(root.stacks.Avisos.length, 1);
  assert.deepEqual(navReduce(root, { type: 'reset' }), initial);
});

test('submitting and editing keep the original history route and date', () => {
  const work = { type: 'history', workId: 'a', date: '2026-11-06' };
  const report = { type: 'report', workId: 'a', reportId: 'r' };
  let state = navReduce(createNavState(), { type: 'push', route: work });
  state = navReduce(state, { type: 'push', route: { type: 'report-new', workId: 'a' } });
  state = navReduce(state, { type: 'replace', route: report });
  assert.equal(depth(state), 2);
  assert.equal(backLabel(state, { works: [{ id: 'a', name: 'Obra A' }] }), 'Obra A');
  state = navReduce(state, { type: 'push', route: { ...report, type: 'report-edit' } });
  state = navReduce(state, { type: 'pop' });
  state = navReduce(state, { type: 'replace', route: { ...report, submitted: true } });
  assert.equal(depth(state), 2);
  assert.equal(currentRoute(navReduce(state, { type: 'pop' })), work);
});
