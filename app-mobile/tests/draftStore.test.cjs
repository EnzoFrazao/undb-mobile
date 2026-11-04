const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createDraftStore, draftKey } = require('../services/draftStore.cjs');

function fixture() {
  const data = new Map();
  return { data, storage: {
    async getItem(key) { return data.get(key) ?? null; },
    async setItem(key, value) { data.set(key, value); },
    async removeItem(key) { data.delete(key); },
  } };
}

test('recupera campos em nova instância sem rede e separa servidor, usuário e obra', async () => {
  const { storage, data } = fixture();
  const key = draftKey('http://lan', 'responsavel-1', 'obra-1');
  await createDraftStore(storage).save(key, { date: '2026-11-04', activities: 'Montagem', photos: ['foto'], token: 'sessão' });
  const reopened = createDraftStore(storage);
  assert.deepEqual(await reopened.load(key), { fields: { date: '2026-11-04', activities: 'Montagem' } });
  assert.doesNotMatch(data.get(key), /foto|sessão/);
  assert.equal(await reopened.load(draftKey('http://outro', 'responsavel-1', 'obra-1')), null);
  assert.equal(await reopened.load(draftKey('http://lan', 'responsavel-2', 'obra-1')), null);
  assert.equal(await reopened.load(draftKey('http://lan', 'responsavel-1', 'obra-2')), null);
});

test('ordena gravações, leitura e remoção para não ressuscitar rascunho já enviado', async () => {
  const { storage } = fixture();
  const write = storage.setItem;
  let releaseFirst;
  const firstWrite = new Promise((resolve) => { releaseFirst = resolve; });
  storage.setItem = async (key, value) => {
    if (value.includes('primeiro')) await firstWrite;
    await write(key, value);
  };
  const drafts = createDraftStore(storage);
  const first = drafts.save('k', { activities: 'primeiro' });
  const second = drafts.save('k', { activities: 'último' });
  const latest = drafts.load('k');
  const removal = drafts.clear('k');
  const afterClear = drafts.load('k');
  releaseFirst();
  await Promise.all([first, second, removal]);
  assert.deepEqual(await latest, { fields: { activities: 'último' } });
  assert.equal(await afterClear, null);
});

test('erro de armazenamento não bloqueia tentativa seguinte', async () => {
  const { data, storage } = fixture();
  data.set('k', 'registro incompleto');
  const drafts = createDraftStore(storage);
  await assert.rejects(drafts.load('k'));
  assert.equal(data.get('k'), 'registro incompleto');
  await drafts.save('k', { activities: 'Texto recuperado' });
  assert.deepEqual(await drafts.load('k'), { fields: { activities: 'Texto recuperado' } });
});
