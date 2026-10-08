import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import Choice from '../Choice';
import Calendar from '../Calendar';
import ReportEditor from '../ReportEditor';
import ReportDetail from '../ReportDetail';
import WorkEditor from '../WorkEditor';
import WelcomeScreen from '../WelcomeScreen';
import { request } from '../../services/api';
import { displayDate, displayTime } from '../../services/dates';
import styles from './styles';

const guides = {
  owner: ['Veja todos os contratos e as obras da empresa.', 'Vincule clientes e responsáveis a cada obra.', 'Revise os relatórios e assine. Após a assinatura, a edição fica bloqueada.'],
  operator: ['Selecione uma obra atribuída a você.', 'Preencha o diário e anexe fotos da galeria ou câmera.', 'Envie o registro. O dono poderá revisar e assinar.'],
  client: ['Consulte somente as obras vinculadas à sua conta.', 'Use o calendário para encontrar registros por data.', 'Acompanhe atividades, fotos e assinaturas. Seu acesso é de consulta.'],
};

export default function Workspace({ user, onLogout }) {
  const [welcome, setWelcome] = useState(true);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('Obras');
  const [route, setRoute] = useState(null);
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [guide, setGuide] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const mounted = useRef(true);
  const refresh = useCallback(async () => {
    try {
      const next = await request('/state');
      if (mounted.current) { setData(next); setError(''); return next; }
    } catch (e) { if (mounted.current) setError(e.message); }
  }, []);
  useEffect(() => {
    mounted.current = true;
    refresh().then((next) => { if (mounted.current && next && (!next.user.guideSeen || !next.user.consentAt)) setGuide(true); });
    const interval = setInterval(() => { if (AppState.currentState === 'active' || Platform.OS === 'web') refresh(); }, 5000);
    return () => { mounted.current = false; clearInterval(interval); };
  }, [refresh]);
  useEffect(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, [route?.type, route?.id, tab, selectedWorkId, guide]);
  async function finishGuide() {
    setBusy(true); setError('');
    try {
      if (!data.user.consentAt) await request('/consent', 'POST', { consent });
      await request('/guide', 'POST'); await refresh(); setGuide(false);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true);
    try { await onLogout(); } catch (e) { setError(e.message); setBusy(false); }
  }
  function chooseTab(value) { setTab(value); setRoute(null); setSelectedDate(''); }
  function openWork(work) { setSelectedWorkId(work.id); setSelectedDate(''); setRoute({ type: 'history' }); }
  async function saved() { await refresh(); setRoute({ type: 'history' }); }
  const works = data?.works || [];
  const work = works.find((item) => item.id === selectedWorkId);
  const reports = (data?.reports || []).filter((r) => !selectedWorkId || r.workId === selectedWorkId).sort((a, b) => b.date.localeCompare(a.date));
  const pendingCount = (data?.reports || []).filter((r) => !r.signature).length;
  const activeUser = data?.user || user;
  const inaccessible = selectedWorkId && !work && route && route.type !== 'work-new';
  if (welcome) return <WelcomeScreen user={activeUser} onLogout={logout} onContinue={() => setWelcome(false)} />;

  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.topbar}><View style={styles.brandLine}><View style={styles.mark}><Text style={styles.markText}>D</Text></View><View><Text style={styles.brand}>Diário de Obra</Text><Text style={styles.role}>{activeUser.roleLabel}</Text></View></View><Pressable onPress={logout} disabled={busy} accessibilityRole="button" accessibilityLabel="Sair" style={styles.logout}><Text style={styles.logoutText}>Sair</Text></Pressable></View>
    <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await refresh(); setRefreshing(false); }} />}>
      {error ? <View style={styles.errorBox}><Text style={styles.error} accessibilityRole="alert">{error}</Text><ActionButton label="Tentar novamente" secondary onPress={refresh} /></View> : null}
      {!data ? <View><Text style={styles.title}>Preparando suas obras</Text><View style={styles.skeleton} /><View style={styles.skeleton} /><Text style={styles.subtitle}>Conectando ao servidor...</Text></View> : guide ? <View>
        <Text style={styles.caption}>Guia de acesso</Text><Text style={styles.title}>Olá, {activeUser.name}</Text><Text style={styles.subtitle}>O que você pode fazer como {activeUser.roleLabel.toLowerCase()}:</Text>
        {guides[activeUser.role].map((item, index) => <View key={item} style={styles.guideItem}><Text style={styles.guideNumber}>{index + 1}</Text><Text style={styles.guideText}>{item}</Text></View>)}
        <Text style={styles.section}>Privacidade e dados da obra</Text><Text style={styles.body}>Nome e e-mail identificam a autoria dos registros. Fotos e relatórios ficam disponíveis somente às pessoas vinculadas ao contrato e ao dono da empresa. Compartilhe imagens apenas com autorização das pessoas retratadas. Para solicitar correção ou exclusão de dados pessoais, entre em contato com o administrador da empresa; registros assinados seguem a política de retenção do contrato.</Text>
        {!activeUser.consentAt ? <Choice label="Concordo com o tratamento dos meus dados para acesso e identificação nos registros da obra." selected={consent} onPress={() => setConsent(!consent)} /> : null}
        <ActionButton label="Acessar minhas obras" busy={busy} disabled={!activeUser.consentAt && !consent} onPress={finishGuide} />
      </View> : inaccessible ? <View><Text style={styles.title}>Acesso atualizado</Text><Text style={styles.body}>Você não está mais vinculado a esta obra.</Text><ActionButton label="Voltar às obras" onPress={() => { setRoute(null); setSelectedWorkId(null); }} /></View> : route?.type === 'report-new' && work ?
        <ReportEditor work={work} onSaved={saved} onCancel={() => setRoute({ type: 'history' })} /> : route?.type === 'report-edit' && work ?
        <ReportEditor work={work} report={route.report} onSaved={saved} onCancel={() => setRoute({ type: 'report', id: route.report.id })} /> : route?.type === 'report' ?
        <ReportDetail reportId={route.id} revision={data.reports.find((r) => r.id === route.id)?.versions.length} user={activeUser} onEdit={(report) => setRoute({ type: 'report-edit', report })} onChanged={refresh} onBack={() => setRoute({ type: 'history' })} /> : route?.type === 'work-new' || route?.type === 'work-edit' ?
        <WorkEditor users={data.users} work={route.type === 'work-edit' ? work : null} onSaved={async () => { await refresh(); setRoute(null); setSelectedWorkId(null); }} onCancel={() => setRoute(null)} /> : tab === 'Conta' && !route ? <View>
          <Text style={styles.title}>Minha conta</Text><Text style={styles.subtitle}>{activeUser.roleLabel}</Text><View style={styles.account}><Text style={styles.section}>{activeUser.name}</Text><Text style={styles.body}>{activeUser.email}</Text><Text style={styles.small}>Consentimento: {activeUser.consentAt ? displayTime(activeUser.consentAt) : 'Pendente'}</Text></View>
          <ActionButton label="Rever guia de uso" secondary onPress={() => setGuide(true)} />
          <Text style={styles.section}>Perguntas frequentes</Text><Text style={styles.question}>Quem consegue ver as fotos?</Text><Text style={styles.body}>O dono da empresa e as pessoas vinculadas ao contrato.</Text><Text style={styles.question}>Posso alterar um relatório assinado?</Text><Text style={styles.body}>Não. A assinatura bloqueia a edição e mantém as versões anteriores disponíveis para consulta.</Text><Text style={styles.question}>Onde encontro os registros antigos?</Text><Text style={styles.body}>Abra uma obra e escolha a data no calendário. Os dias marcados têm relatórios.</Text><Text style={styles.question}>Não aparece nenhuma obra na minha conta.</Text><Text style={styles.body}>Peça ao dono da empresa para vincular seu e-mail ao contrato.</Text>
          <ActionButton label="Sair da conta" secondary busy={busy} onPress={logout} />
        </View> : route?.type === 'history' && work ? <View>
          <Pressable accessibilityRole="button" accessibilityLabel="Voltar às obras" onPress={() => { setRoute(null); setSelectedWorkId(null); }} style={styles.back}><Text style={styles.link}>‹ Voltar às obras</Text></Pressable>
          <Text style={styles.caption}>{work.contract}</Text><Text style={styles.title}>{work.name}</Text><Text style={styles.subtitle}>{work.address}</Text>
          {activeUser.role !== 'client' ? <View style={styles.primaryAction}><ActionButton label="Novo relatório" onPress={() => setRoute({ type: 'report-new' })} /></View> : null}
          {activeUser.role === 'owner' ? <View style={styles.primaryAction}><ActionButton label="Gerenciar pessoas da obra" secondary onPress={() => setRoute({ type: 'work-edit' })} /></View> : null}
          <Text style={styles.section}>Histórico da obra</Text><Calendar reports={reports} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          {selectedDate ? <View style={styles.filter}><Text style={styles.body}>{displayDate(selectedDate)}</Text><Pressable accessibilityRole="button" accessibilityLabel="Limpar filtro de data" onPress={() => setSelectedDate('')} style={styles.filterButton}><Text style={styles.link}>Ver todos</Text></Pressable></View> : null}
          {reports.filter((r) => !selectedDate || r.date === selectedDate).map((report) => <Pressable key={report.id} accessibilityRole="button" accessibilityLabel={`Abrir relatório de ${displayDate(report.date)}`} onPress={() => setRoute({ type: 'report', id: report.id })} style={({ pressed }) => [styles.reportRow, pressed && styles.pressed]}><View style={styles.dateBlock}><Text style={styles.dateDay}>{report.date.slice(8)}</Text><Text style={styles.dateMonth}>{displayDate(report.date).slice(3)}</Text></View><View style={styles.reportCopy}><Text style={styles.rowTitle}>{report.signature ? 'Assinado' : 'Aguardando assinatura'}</Text><Text numberOfLines={2} style={styles.rowDescription}>{report.activities}</Text><Text style={styles.small}>{report.photos.length} fotos · Avanço {report.progress}%</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}
          {!reports.some((r) => !selectedDate || r.date === selectedDate) ? <View style={styles.empty}><Text style={styles.section}>Sem registros nesta data</Text><Text style={styles.body}>Escolha outro dia ou aguarde o envio do próximo relatório.</Text></View> : null}
        </View> : <View>
          <Text style={styles.caption}>{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          <Text style={styles.title}>Suas obras, em dia.</Text><Text style={styles.subtitle}>{activeUser.role === 'owner' ? 'Uma visão de todos os contratos da empresa.' : activeUser.role === 'operator' ? 'Registre o trabalho realizado em cada obra.' : 'Acompanhe cada etapa da sua obra.'}</Text>
          <View style={styles.summary}><View style={styles.summaryItem}><Text style={styles.summaryValue}>{works.length}</Text><Text style={styles.summaryLabel}>{works.length === 1 ? 'obra vinculada' : 'obras vinculadas'}</Text></View><View style={styles.summaryDivider} /><View style={styles.summaryItem}><Text style={styles.summaryValue}>{activeUser.role === 'owner' ? pendingCount : data.reports.length}</Text><Text style={styles.summaryLabel}>{activeUser.role === 'owner' ? 'para assinatura' : 'relatórios enviados'}</Text></View></View>
          {activeUser.role === 'owner' ? <View style={styles.primaryAction}><ActionButton label="Cadastrar obra" onPress={() => setRoute({ type: 'work-new' })} /></View> : null}
          <View style={styles.listHeading}><Text style={styles.section}>Obras e contratos</Text><Text style={styles.small}>{works.length} {works.length === 1 ? 'obra' : 'obras'}</Text></View>
          {works.map((item) => {
            const list = data.reports.filter((r) => r.workId === item.id).sort((a, b) => b.date.localeCompare(a.date));
            return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Abrir ${item.name}`} onPress={() => openWork(item)} style={({ pressed }) => [styles.workRow, pressed && styles.pressed]}><View style={styles.workTop}><Text style={styles.contract}>{item.contract}</Text><Text style={styles.workStatus}>{item.status}</Text></View><Text style={styles.workName}>{item.name}</Text><Text style={styles.rowDescription}>{item.address}</Text><View style={styles.workBottom}><Text style={styles.small}>{list.length ? `Último diário: ${displayDate(list[0].date)}` : 'Primeiro diário ainda não enviado'}</Text><Text style={styles.chevron}>›</Text></View></Pressable>;
          })}
          {!works.length ? <View style={styles.empty}><Text style={styles.section}>Seu acesso está pronto</Text><Text style={styles.body}>O dono da empresa precisa vincular sua conta a uma obra. Após o vínculo, ela aparecerá aqui automaticamente.</Text></View> : null}
          <Text style={styles.live}>● Atualizado a cada 5 segundos</Text>
        </View>}
    </ScrollView>
    {!guide ? <View style={styles.navigation}>{['Obras', 'Conta'].map((item) => <Pressable key={item} onPress={() => { setSelectedWorkId(null); chooseTab(item); }} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} style={styles.navItem}><Text style={[styles.navIcon, tab === item && styles.navActive]}>{item === 'Obras' ? '▦' : '○'}</Text><Text style={[styles.navLabel, tab === item && styles.navActive]}>{item}</Text></Pressable>)}</View> : null}
  </KeyboardAvoidingView>;
}
