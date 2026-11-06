const test = require('node:test');
const assert = require('node:assert/strict');
const { createSessionStore } = require('../services/sessionStore.cjs');

test('sessions persist per API, ignore corruption and clear in order', async () => {
  const items = new Map();
  const storage = {
    getItem: async (key) => items.get(key),
    setItem: async (key, value) => items.set(key, value),
    removeItem: async (key) => items.delete(key),
  };
  const store = createSessionStore(storage, 'local');
  const session = { token: 'token', user: { id: '1', role: 'owner' } };
  await store.save({ ...session, password: 'unused' });
  assert.deepEqual(await store.load(), session);
  assert.equal(await createSessionStore(storage, 'remote').load(), null);
  items.set('session-v1:local', '{invalid');
  assert.equal(await store.load(), null);
  await Promise.all([store.save(session), store.clear()]);
  assert.equal(await store.load(), null);
});
