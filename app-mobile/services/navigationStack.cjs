const tabs = ['Obras', 'RDO', 'Revisão', 'Avisos', 'Conta'];

function createNavState(tab = 'Obras') {
  return { tab, stacks: Object.fromEntries(tabs.map((name) => [name, []])) };
}

function navReduce(state, action) {
  if (action.type === 'reset') return createNavState(action.tab);
  if (action.type === 'restore') {
    return { tab: action.tab, stacks: { ...state.stacks, [action.tab]: action.stack } };
  }
  const tab = state.tab;
  const stack = state.stacks[tab];
  let next;
  switch (action.type) {
    case 'select-tab':
      if (!tabs.includes(action.tab)) return state;
      if (tab !== action.tab) {
        return action.clearTarget ? { tab: action.tab, stacks: { ...state.stacks, [action.tab]: [] } } : { ...state, tab: action.tab };
      }
      next = [];
      break;
    case 'pop-to-root': next = []; break;
    case 'restore-work': next = [action.route]; break;
    case 'push': next = [...stack, action.route]; break;
    case 'replace': next = [...stack.slice(0, -1), action.route]; break;
    case 'pop':
      next = stack.slice(0, -1);
      if (action.route && next.length) next[next.length - 1] = action.route;
      break;
    default: return state;
  }
  return !stack.length && !next.length ? state : { tab, stacks: { ...state.stacks, [tab]: next } };
}

const depth = (state) => state.stacks[state.tab].length;
const currentRoute = (state) => state.stacks[state.tab].at(-1);
const canGoBack = (state) => depth(state) > 0;
function screenMeta(route, tab, { works = [], reports = [], displayDate = (date) => date } = {}) {
  const work = works.find((item) => item.id === route?.workId);
  const report = reports.find((item) => item.id === route?.reportId);
  const titles = {
    history: work?.name || 'Histórico da obra',
    report: report ? `RDO de ${displayDate(report.date)}` : 'Detalhes do RDO',
    'report-new': 'Novo RDO',
    'report-edit': 'Editar RDO',
    'work-new': 'Cadastrar obra',
    'work-edit': 'Pessoas da obra',
    guide: 'Guia de uso',
  };
  return {
    title: titles[route?.type] || tab,
    subtitle: route?.type === 'history' ? work?.contract : work?.name,
  };
}
const backLabel = (state, context) => screenMeta(state.stacks[state.tab].at(-2), state.tab, context).title;

module.exports = { createNavState, navReduce, depth, currentRoute, canGoBack, screenMeta, backLabel };
