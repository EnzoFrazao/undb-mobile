import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Animated, AppState, BackHandler, Image, KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import AccountScreen from '../AccountScreen';
import ConfirmDialog from '../ConfirmDialog';
import ErrorState from '../ErrorState';
import Icon from '../Icon';
import GuideScreen from '../GuideScreen';
import NoticeInbox from '../NoticeInbox';
import ReportDetail from '../ReportDetail';
import ReportEditor from '../ReportEditor';
import ReviewQueue from '../ReviewQueue';
import RdoStart from '../RdoStart';
import ScreenHeader from '../ScreenHeader';
import Skeleton from '../Skeleton';
import WelcomeScreen from '../WelcomeScreen';
import WorkEditor from '../WorkEditor';
import WorkHistory from '../WorkHistory';
import WorkList from '../WorkList';
import { useToast } from '../Toast';
import { expo } from '../../app.json';
import { request } from '../../services/api';
import { reportDraftKey } from '../../services/reportDrafts';
import { reportStatus } from '../../services/reportStatus.cjs';
import { displayDate } from '../../services/dates';
import { backLabel, canGoBack, createNavState, currentRoute, navReduce, screenMeta } from '../../services/navigationStack.cjs';
import { useReducedMotion } from '../../services/useReducedMotion';
import { connectWebHistory, readWebTab, rememberWebTab } from '../../services/webHistory';
import styles, { transitionStyle } from './styles';

const defaultFilters = { status: 'pending', query: '', date: '' };
const allowedTabs = (role) => ['Obras', ...(role === 'owner' ? ['Revisão'] : role === 'operator' ? ['RDO'] : []), 'Avisos', 'Conta'];
const empty = [];
const tabIcons = { Obras: 'work', RDO: 'report', Revisão: 'review', Avisos: 'notice', Conta: 'account' };

export default function Workspace({ user, onLogout, skipWelcome, restoreTab }) {
  const [welcome, setWelcome] = useState(!skipWelcome);
  const [data, setData] = useState(null);
  const [nav, dispatch] = useReducer(navReduce, user, (account) => {
    const saved = restoreTab && readWebTab(account.id);
    return createNavState(allowedTabs(account.role).includes(saved) ? saved : 'Obras');
  });
  const navRef = useRef(nav);
  const historyRef = useRef(null);
  const [workQuery, setWorkQuery] = useState('');
  const [noticeQuery, setNoticeQuery] = useState('');
  const reducedMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();
  const wide = Platform.OS === 'web' && width >= 900;
  const [reviewFilters, setReviewFilters] = useState(defaultFilters);
  const [connection, setConnection] = useState(null);
  const [guideError, setGuideError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);
  const dirtyRef = useRef('');
  const blockingRef = useRef(false);
  const scrollRef = useRef(null);
  const listRef = useRef(null);
  const offsets = useRef({});
  const photoCache = useRef(new Map());
  const mounted = useRef(true);
  const requestNumber = useRef(0);
  const stateSignature = useRef('');
  const exitAt = useRef(0);
  const toast = useToast();

  const refresh = useCallback(async () => {
    const number = ++requestNumber.current;
    try {
      const { serverTime, ...next } = await request('/state');
      if (!mounted.current || number !== requestNumber.current) return;
      const signature = JSON.stringify(next);
      if (signature !== stateSignature.current) {
        stateSignature.current = signature;
        setData(next);
      }
      setConnection(null);
      return next;
    } catch (error) {
      if (mounted.current && number === requestNumber.current) {
        setConnection((previous) => previous || { message: error.message, since: new Date() });
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    let timeout;
    async function poll() {
      if (AppState.currentState === 'active' || Platform.OS === 'web') await refresh();
      if (active) timeout = setTimeout(poll, 5000);
    }
    refresh().finally(() => { if (active) timeout = setTimeout(poll, 5000); });
    return () => { active = false; mounted.current = false; clearTimeout(timeout); };
  }, [refresh]);

  function navigate(action) {
    const next = navReduce(navRef.current, action);
    if (next === navRef.current) return;
    if (historyRef.current?.sync(next, action) === false) return;
    navRef.current = next;
    dispatch(action);
  }
  function requestLeave(action, undoBrowser) {
    if (blockingRef.current || busy || dialog) {
      undoBrowser?.();
      return true;
    }
    if (!dirtyRef.current) {
      if (!undoBrowser) action();
      return false;
    }
    undoBrowser?.();
    setDialog({
      title: 'Sair sem salvar?',
      message: dirtyRef.current,
      confirmLabel: 'Descartar alterações',
      onConfirm: () => { dirtyRef.current = ''; action(); },
    });
    return true;
  }
  const webGuard = useRef(requestLeave);
  webGuard.current = requestLeave;
  useEffect(() => {
    const history = connectWebHistory(navRef.current, {
      guard: (action, undo) => webGuard.current(action, undo),
      shouldWarn: () => Boolean(dirtyRef.current || blockingRef.current),
      apply: ({ tab, stack }) => navigate({ type: 'restore', tab, stack }),
    });
    historyRef.current = history;
    return () => { history.dispose(); historyRef.current = null; };
  }, []);

  const { tab } = nav;
  const route = currentRoute(nav);
  const activeUser = data?.user || user;
  const tabs = allowedTabs(activeUser.role);
  const works = data?.works || empty;
  const reports = data?.reports || empty;
  const notices = data?.notices || empty;
  const unreadCount = notices.filter((item) => !item.readAt).length;
  const work = works.find((item) => item.id === route?.workId);
  const report = reports.find((item) => item.id === route?.reportId);
  const workReports = useMemo(() => reports.filter((item) => item.workId === work?.id).sort((a, b) => b.date.localeCompare(a.date)), [reports, work?.id]);
  const pendingCount = useMemo(() => reports.filter((item) => reportStatus(item) === 'pending').length, [reports]);
  const requiredGuide = Boolean(data && (!data.user.guideSeen || !data.user.consentAt));
  const showingGuide = requiredGuide || route?.type === 'guide';
  const screenKey = showingGuide ? 'guide' : [tab, route?.type, route?.workId, route?.reportId].join(':');
  const metaContext = { works, reports, displayDate };
  const header = screenMeta(showingGuide ? { type: 'guide' } : route, tab, metaContext);
  const canBack = !requiredGuide && canGoBack(nav);
  const back = () => requestLeave(() => navigate({ type: 'pop' }));

  useEffect(() => {
    if (reducedMotion) { progress.setValue(1); return; }
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: 160, useNativeDriver: Platform.OS !== 'web' });
    animation.start();
    return () => animation.stop();
  }, [screenKey, progress, reducedMotion]);
  useEffect(() => { rememberWebTab(user.id, tab); }, [user.id, tab]);
  useLayoutEffect(() => {
    if (welcome) return;
    const offset = offsets.current[screenKey] || 0;
    if (!offset) return;
    const frame = requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset, animated: false });
      scrollRef.current?.scrollTo({ y: offset, animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [screenKey, welcome, Boolean(data)]);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (dialog) { setDialog(null); return true; }
      if (blockingRef.current || busy) return true;
      if (welcome || requiredGuide) { confirmLogout(); return true; }
      if (canBack) { back(); return true; }
      if (tab !== 'Obras') { chooseTab('Obras'); return true; }
      if (Date.now() - exitAt.current < 2000) return false;
      exitAt.current = Date.now();
      toast.show({ message: 'Pressione novamente para sair', type: 'info', duration: 2000 });
      return true;
    });
    return () => subscription.remove();
  });

  function confirmLogout() {
    requestLeave(() => setDialog({
      title: 'Sair da conta?',
      message: 'Para acessar as obras novamente, entre com seu e-mail e senha.',
      confirmLabel: 'Sair da conta',
      cancelLabel: 'Ficar na conta',
      onConfirm: () => { setBusy(true); onLogout(); },
    }));
  }
  function chooseTab(value) {
    requestLeave(() => navigate({ type: 'select-tab', tab: value }));
  }
  function push(route) { requestLeave(() => navigate({ type: 'push', route })); }
  function openRdo(work, existing) {
    push(existing ? { type: 'report', workId: work.id, reportId: existing.id } : { type: 'report-new', workId: work.id });
  }
  function saved(next, submitted, draftCleanupFailed) {
    dirtyRef.current = '';
    navigate({
      type: route.type === 'report-edit' ? 'pop' : 'replace',
      route: { type: 'report', workId: next.workId, reportId: next.id, submitted, draftCleanupFailed },
    });
    toast.show({ type: 'success', message: submitted ? 'RDO enviado para revisão.' : 'RDO atualizado.' });
    refresh();
  }
  async function finishGuide(consent) {
    if (busy) return;
    setBusy(true); setGuideError('');
    try {
      if (!activeUser.consentAt) await request('/consent', 'POST', { consent });
      await request('/guide', 'POST');
      await refresh();
      if (!requiredGuide) navigate({ type: 'pop' });
    } catch (error) { setGuideError(error.message); }
    finally { setBusy(false); }
  }
  async function markRead(items) {
    const results = await Promise.allSettled(items.map((item) => request(`/notices/${item.id}/read`, 'POST')));
    if (results.some((result) => result.status === 'rejected')) {
      toast.show({ type: 'error', message: 'Alguns avisos não puderam ser marcados como lidos.' });
    }
    await refresh();
  }
  function openNotice(notice) {
    const target = works.find((item) => item.id === notice.workId);
    if (!target) {
      toast.show({ type: 'error', message: 'Você não tem mais acesso a esta obra.' });
      return;
    }
    openRdo(target, { id: notice.reportId });
    if (!notice.readAt) markRead([notice]);
  }

  const onDirtyChange = useCallback((message) => { dirtyRef.current = message; }, []);
  const onBlockingChange = useCallback((blocking) => { blockingRef.current = blocking; }, []);
  const formProps = {
    scrollRef,
    onCancel: back,
    onDirtyChange,
    onBlockingChange,
  };
  function renderScreen(listProps) {
    if (!data) return connection
      ? <ErrorState message={connection.message} onRetry={refresh} />
      : <Skeleton label="Preparando suas obras…" />;
    if (showingGuide) return <>
      {guideError ? <ErrorState message={guideError} /> : null}
      <GuideScreen activeUser={activeUser} busy={busy} finishGuide={finishGuide} onClose={!requiredGuide ? back : undefined} />
    </>;
    if (route?.workId && !work) return <ErrorState message="Você não tem mais acesso a esta obra." />;
    const historyFilter = (patch) => navigate({ type: 'replace', route: { ...route, ...patch } });
    const screens = {
      history: () => <WorkHistory work={work} reports={workReports} selectedDate={route.date || ''} activeUser={activeUser}
        listProps={listProps} setSelectedDate={(date) => historyFilter({ date })} status={route.status || 'all'}
        setStatus={(status) => historyFilter({ status })} onClear={() => historyFilter({ date: '', status: 'all' })}
        onNew={() => openRdo(work)} onEdit={() => push({ type: 'work-edit', workId: work.id })} onReport={(item) => openRdo(work, item)} />,
      report: () => <ReportDetail work={work} reportId={route.reportId} submitted={route.submitted}
        draftCleanupFailed={route.draftCleanupFailed} revision={report?.versions.length} user={activeUser}
        onEdit={(item) => push({ type: 'report-edit', workId: work.id, reportId: item.id })}
        onChanged={refresh} photoCache={photoCache.current} {...formProps} />,
      'report-new': () => <ReportEditor work={work} draftKey={activeUser.role === 'operator' ? reportDraftKey(activeUser.id, work.id) : undefined}
        onSaved={(next, cleanupFailed) => saved(next, true, cleanupFailed)} {...formProps} />,
      'report-edit': () => {
        if (!report || (activeUser.role !== 'owner' && (activeUser.role !== 'operator' || activeUser.id !== report.authorId))) {
          return <ErrorState message="Este relatório não está disponível para edição." />;
        }
        const resubmitting = activeUser.role === 'operator' && reportStatus(report) === 'returned';
        return <ReportEditor work={work} report={report} lockDate={activeUser.role === 'operator'} resubmitting={resubmitting}
          onSaved={(next) => saved(next, resubmitting)} {...formProps} />;
      },
      'work-new': workEditor,
      'work-edit': workEditor,
      Obras: () => <WorkList works={works} reports={reports} activeUser={activeUser} pendingCount={pendingCount} listProps={listProps} query={workQuery} onQuery={setWorkQuery}
        openWork={(item) => push({ type: 'history', workId: item.id })}
        onNew={() => push({ type: 'work-new' })} onRdo={() => chooseTab('RDO')}
        onReview={() => { setReviewFilters(defaultFilters); navigate({ type: 'select-tab', tab: 'Revisão', clearTarget: true }); }} />,
      RDO: () => <RdoStart works={works} reports={reports} userId={activeUser.id} onStart={openRdo} />,
      Revisão: () => <ReviewQueue works={works} reports={reports} filters={reviewFilters} onFilter={setReviewFilters} onOpen={openRdo} listProps={listProps} />,
      Avisos: () => <NoticeInbox notices={notices} works={works} onOpen={openNotice} listProps={listProps} query={noticeQuery} onQuery={setNoticeQuery} onMarkAll={() => markRead(notices.filter((item) => !item.readAt))} />,
      Conta: () => <AccountScreen activeUser={activeUser} busy={busy} logout={confirmLogout} onGuide={() => push({ type: 'guide' })} />,
    };
    return screens[route?.type || tab]?.();
  }

  function workEditor() {
    return <WorkEditor users={data.users} work={work} {...formProps} onSaved={() => {
      dirtyRef.current = '';
      navigate({ type: 'pop' });
      toast.show({ type: 'success', message: work ? 'Vínculos atualizados.' : 'Obra cadastrada.' });
      refresh();
    }} />;
  }
  const confirmation = <ConfirmDialog {...dialog} visible={Boolean(dialog)} onCancel={() => setDialog(null)} onConfirm={() => {
    const action = dialog?.onConfirm;
    setDialog(null);
    action?.();
  }} />;
  if (welcome) return <><WelcomeScreen user={activeUser} onLogout={confirmLogout} onContinue={() => setWelcome(false)} />{confirmation}</>;

  const refreshControl = <RefreshControl refreshing={refreshing} onRefresh={async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }} />;
  const listScreen = data && !showingGuide && !(route?.workId && !work)
    && (route?.type === 'history' || (!route && ['Obras', 'Avisos', 'Revisão'].includes(tab)));
  const scrollProps = {
    style: styles.scroll, contentContainerStyle: styles.content, keyboardShouldPersistTaps: 'handled',
    onScroll: (event) => { offsets.current[screenKey] = event.nativeEvent.contentOffset.y; },
    scrollEventThrottle: 32, refreshControl,
  };
  const split = wide && tab === 'Obras' && work && !showingGuide && ['history', 'report'].includes(route?.type);
  const navigation = !showingGuide ? <View style={[styles.navigation, wide && styles.sideNavigation]} accessibilityRole="tablist">
    {tabs.map((item) => <Pressable key={item}
      testID={`tab-${({ Obras: 'obras', RDO: 'rdo', Revisão: 'revisao', Avisos: 'avisos', Conta: 'conta' })[item]}`}
      onPress={() => chooseTab(item)} accessibilityRole="tab"
      accessibilityLabel={item === 'Avisos' && unreadCount ? `Avisos, ${unreadCount} não lidos` : item}
      accessibilityState={{ selected: tab === item }}
      style={({ focused, pressed }) => [styles.navItem, wide && styles.sideItem, tab === item && styles.selected, focused && styles.focused, pressed && styles.pressed]}>
      <View style={styles.navIcon}>
        <Icon name={tabIcons[item]} light />
        {!wide && item === 'Avisos' && unreadCount > 0 ? <Text maxFontSizeMultiplier={1.4} style={[styles.badge, styles.mobileBadge]}>{unreadCount}</Text> : null}
      </View>
      <Text maxFontSizeMultiplier={1.4} style={[styles.navLabel, tab === item && styles.navActive]}>{item}</Text>
      {wide && item === 'Avisos' && unreadCount > 0 ? <Text maxFontSizeMultiplier={1.4} style={styles.badge}>{unreadCount}</Text> : null}
    </Pressable>)}
  </View> : null;
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={[styles.layout, wide && styles.wideLayout]}>
      {wide && navigation ? <View style={styles.sidebar}>
        <View style={styles.sidebarBrand}>
          <Image source={require('../../assets/planengen-signature.png')} style={styles.signature} resizeMode="contain"
            accessible accessibilityLabel="Planengen Consultoria e Construção" />
          <Text style={styles.sidebarTitle}>{expo.name}</Text>
        </View>
        {navigation}
      </View> : null}
      <View style={styles.main}>
        <ScreenHeader title={header.title} subtitle={header.subtitle || activeUser.roleLabel} back={canBack ? backLabel(nav, metaContext) : null}
          onBack={back} onLogout={!canBack ? confirmLogout : undefined} busy={busy} wide={wide && !showingGuide} />
        {data && connection ? <ErrorState message={`Dados desatualizados desde ${connection.since.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. ${connection.message}`}
          onRetry={refresh} retryLabel="Tentar agora" /> : null}
        <View style={styles.columns}>
          {split ? <View style={styles.workPane}>
            <WorkList works={works} reports={reports} activeUser={activeUser} selectedId={work.id} compact
              query={workQuery} onQuery={setWorkQuery} listProps={{ contentContainerStyle: styles.paneContent }}
              openWork={(item) => {
                if (item.id !== work.id || route.type !== 'history') requestLeave(() => navigate({ type: 'restore-work', route: { type: 'history', workId: item.id } }));
              }} />
          </View> : null}
          <Animated.View style={[styles.main, !reducedMotion && transitionStyle(progress)]}>
            {listScreen ? <View key={screenKey} style={styles.main}>{renderScreen({ ...scrollProps, ref: listRef })}</View>
              : <ScrollView key={screenKey} ref={scrollRef} {...scrollProps}>{renderScreen()}</ScrollView>}
          </Animated.View>
        </View>
      </View>
      {wide ? null : navigation}
    </View>
    {confirmation}
  </KeyboardAvoidingView>;
}
