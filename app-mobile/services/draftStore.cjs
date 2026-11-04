const fieldLimits = Object.freeze({
  date: 10, activities: 5000, progress: 12, team: 500,
  weather: 100, materials: 1500, occurrences: 2000,
});

function draftKey(apiUrl, userId, workId) {
  return `rdo-draft-v1:${JSON.stringify([apiUrl, userId, workId])}`;
}

function draftFields(fields) {
  return Object.fromEntries(Object.entries(fieldLimits).flatMap(([key, max]) => (
    typeof fields?.[key] === 'string' ? [[key, fields[key].slice(0, max)]] : []
  )));
}

function createDraftStore(storage) {
  const pending = new Map();
  function enqueue(key, operation) {
    const result = (pending.get(key) ?? Promise.resolve()).then(operation);
    const tail = result.then(() => {}, () => {});
    pending.set(key, tail);
    tail.then(() => { if (pending.get(key) === tail) pending.delete(key); });
    return result;
  }
  return {
    load(key) {
      return enqueue(key, async () => {
        const raw = await storage.getItem(key);
        if (raw === null) return null;
        const value = JSON.parse(raw);
        if (value?.version !== 1 || !value.fields || typeof value.fields !== 'object') {
          throw new Error('Rascunho incompatível.');
        }
        return { fields: draftFields(value.fields) };
      });
    },
    save(key, fields) {
      const raw = JSON.stringify({ version: 1, fields: draftFields(fields) });
      return enqueue(key, () => storage.setItem(key, raw));
    },
    clear(key) {
      return enqueue(key, () => storage.removeItem(key));
    },
  };
}

module.exports = { createDraftStore, draftKey, fieldLimits };
