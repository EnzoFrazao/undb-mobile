function createSessionStore(storage, apiUrl) {
  const key = `session-v1:${apiUrl}`;
  let pending = Promise.resolve();
  function write(task) {
    const result = pending.then(task);
    pending = result.catch(() => {});
    return result;
  }
  return {
    async load() {
      await pending;
      const raw = await storage.getItem(key);
      if (!raw) return null;
      try {
        const session = JSON.parse(raw);
        if (typeof session?.token !== 'string' || !session.token || typeof session?.user?.id !== 'string') return null;
        if (!['owner', 'operator', 'client'].includes(session.user.role)) return null;
        return session;
      } catch { return null; }
    },
    save: ({ token, user }) => write(() => storage.setItem(key, JSON.stringify({ token, user }))),
    clear: () => write(() => storage.removeItem(key)),
  };
}
module.exports = { createSessionStore };
