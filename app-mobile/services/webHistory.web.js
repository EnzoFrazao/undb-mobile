const stateKey = 'diarioNavigation';

export function readWebTab(userId) {
  try { return sessionStorage.getItem(`diario-tab:${userId}`) || 'Obras'; }
  catch { return 'Obras'; }
}

export function rememberWebTab(userId, tab) {
  try { sessionStorage.setItem(`diario-tab:${userId}`, tab); }
  catch { /* The active tab still works without storage. */ }
}

const sameScreen = (a, b) => a?.tab === b?.tab && a?.stack.length === b?.stack.length
  && a?.stack.every((route, i) => {
    const other = b.stack[i];
    return route.type === other.type && route.workId === other.workId && route.reportId === other.reportId;
  });

export function connectWebHistory(initial, onNavigate) {
  const id = `${Date.now()}-${Math.random()}`;
  const snapshot = (state) => ({ tab: state.tab, stack: state.stacks[state.tab] });
  const entries = [{ id, index: 0, ...snapshot(initial) }];
  let index = 0;
  let ignoredIndex = null;
  const write = (method, entry) => window.history[method]({ ...window.history.state, [stateKey]: entry }, '');
  write('replaceState', entries[0]);

  function pop(event) {
    const target = event.state?.[stateKey];
    if (target?.id !== id) return;
    if (target.index === ignoredIndex) {
      index = target.index;
      ignoredIndex = null;
      write('replaceState', entries[index]);
      return;
    }
    const from = index;
    entries[target.index] = target;
    const next = () => {
      index = target.index;
      onNavigate.apply(target);
    };
    if (onNavigate.guard(next, () => {
      ignoredIndex = from;
      window.history.go(from - target.index);
    })) return;
    next();
  }
  function beforeUnload(event) {
    if (!onNavigate.shouldWarn()) return;
    event.preventDefault();
    event.returnValue = '';
  }
  window.addEventListener('popstate', pop);
  window.addEventListener('beforeunload', beforeUnload);

  return {
    sync(state, action) {
      if (ignoredIndex !== null && action.type !== 'restore') return false;
      const next = snapshot(state);
      if (action.type === 'restore') {
        entries[index] = { ...entries[index], ...next };
        write('replaceState', entries[index]);
        return;
      }
      const back = ['pop', 'pop-to-root', 'select-tab'].includes(action.type);
      if (back && index > 0 && sameScreen(entries[index - 1], next)) {
        ignoredIndex = index - 1;
        entries[ignoredIndex] = { ...entries[ignoredIndex], ...next };
        window.history.back();
      } else if (action.type === 'push' || (action.type === 'select-tab' && entries[index].tab !== next.tab)) {
        index += 1;
        entries.splice(index, entries.length, { id, index, ...next });
        write('pushState', entries[index]);
      } else {
        entries[index] = { id, index, ...next };
        write('replaceState', entries[index]);
      }
    },
    dispose() {
      window.removeEventListener('popstate', pop);
      window.removeEventListener('beforeunload', beforeUnload);
    },
  };
}
