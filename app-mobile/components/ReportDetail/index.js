import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import Choice from '../Choice';
import FormField from '../FormField';
import { request } from '../../services/api';
import { exportReport } from '../../services/reportExport';
import { displayDate, displayTime } from '../../services/dates';
import { reportStatus, reportStatusLabel } from '../../services/reportStatus.cjs';
import styles from './styles';

export default function ReportDetail({ reportId, revision, user, work, submitted, draftCleanupFailed, backLabel, onEdit, onChanged, onBack }) {
  const [report, setReport] = useState(null);
  const [images, setImages] = useState({});
  const [failedImages, setFailedImages] = useState([]);
  const [error, setError] = useState('');
  const [exportError, setExportError] = useState('');
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showReturn, setShowReturn] = useState(false);
  const [reason, setReason] = useState('');
  useEffect(() => {
    let active = true;
    request(`/reports/${reportId}`).then(({ report: next }) => {
      if (!active) return;
      setReport(next); setError(''); setConfirmed(false);
    }).catch((e) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [reportId, revision]);
  const content = selectedVersion?.content || report;
  const photoIds = content?.photos;
  useEffect(() => {
    let active = true;
    setImages({}); setFailedImages([]);
    async function loadPhotos() {
      for (const id of photoIds || []) {
        if (!active) return;
        try {
          const { uri } = await request(`/photos/${id}`);
          if (active) setImages((current) => ({ ...current, [id]: uri }));
        } catch {
          if (active) setFailedImages((current) => [...current, id]);
        }
      }
    }
    loadPhotos();
    return () => { active = false; };
  }, [photoIds]);
  async function sign() {
    setBusy(true); setError('');
    try {
      const response = await request(`/reports/${report.id}/sign`, 'POST', { confirm: confirmed, version: report.versions.length });
      setReport(response.report); setConfirmed(false); await onChanged();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function download() {
    setExporting(true); setExportError('');
    try { await exportReport(report); }
    catch (e) { setExportError(e.message); }
    finally { setExporting(false); }
  }
  async function returnReport() {
    if (busy || reason.trim().length < 5) return;
    setBusy(true); setError('');
    try {
      const response = await request(`/reports/${report.id}/return`, 'POST', { reason, version: report.versions.length });
      setReport(response.report); setShowReturn(false); setReason(''); setConfirmed(false);
      await onChanged();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  if (!report) return <View>{error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.text}>Carregando relatório...</Text>}<ActionButton label={backLabel} secondary onPress={onBack} /></View>;
  const signature = content.signature;
  const returned = report.status === 'returned';
  const mayReturn = !returned && work?.operatorIds?.includes(report.authorId);
  const mayEditOwn = user.role === 'operator' && user.id === report.authorId && reportStatus(report) === 'pending';
  return <View>
    <Text style={styles.title}>RDO de {displayDate(content.date)}</Text>
    {work ? <Text style={styles.small}>{work.name} · {work.contract}</Text> : null}
    {submitted ? <Text style={styles.success} accessibilityLiveRegion="polite">RDO enviado. O dono da empresa já pode consultar o registro.</Text> : null}
    {draftCleanupFailed ? <Text style={styles.error} accessibilityRole="alert">O RDO foi enviado, mas não foi possível limpar o rascunho neste dispositivo.</Text> : null}
    <View style={[styles.badge, signature && styles.signedBadge]}><Text style={styles.badgeText}>{signature ? 'Assinado · edição bloqueada' : reportStatusLabel(content)}</Text></View>
    {selectedVersion ? <View style={styles.versionNotice}><Text style={styles.text}>Visualizando versão {selectedVersion.number}, de {displayTime(selectedVersion.at)}.</Text><ActionButton label="Voltar à versão atual" secondary onPress={() => setSelectedVersion(null)} /></View> : null}
    {content.correction ? <View style={styles.versionNotice}>
      <Text style={styles.versionTitle}>Correção solicitada</Text>
      <Text style={styles.text}>{content.correction.reason}</Text>
      <Text style={styles.small}>{content.correction.requestedBy} · {displayTime(content.correction.requestedAt)}</Text>
      {!selectedVersion && returned && !report.signature && user.role === 'operator' && user.id === report.authorId
        ? <ActionButton label="Corrigir RDO" disabled={busy || exporting} onPress={() => onEdit(report)} /> : null}
    </View> : null}
    {!selectedVersion ? <View style={styles.actions}>
      {mayEditOwn ? <ActionButton label="Editar RDO" disabled={busy || exporting} onPress={() => onEdit(report)} /> : null}
      <ActionButton label="Exportar PDF" secondary busy={exporting} disabled={busy} onPress={download} />
      {exportError ? <Text style={styles.error} accessibilityRole="alert">{exportError}</Text> : null}
    </View> : null}
    <Text style={styles.caption}>Atividades realizadas</Text><Text style={styles.text}>{content.activities}</Text>
    <View style={styles.progress}><Text style={styles.progressNumber}>{content.progress}%</Text><Text style={styles.progressLabel}>de avanço informado</Text></View>
    {['team', 'weather', 'materials', 'occurrences'].map((field, i) => <View key={field}><Text style={styles.caption}>{['Equipe', 'Condições do tempo', 'Materiais utilizados', 'Ocorrências e observações'][i]}</Text><Text style={styles.text}>{content[field] || 'Não informado.'}</Text></View>)}
    <Text style={styles.caption}>Fotos ({content.photos.length})</Text>
    {content.photos.length ? content.photos.map((id) => images[id] ? <Image key={id} source={{ uri: images[id] }} style={styles.photo} resizeMode="cover" accessibilityLabel="Foto anexada ao relatório da obra" /> : <Text key={id} style={styles.text}>{failedImages.includes(id) ? 'Não foi possível carregar esta foto. Volte ao histórico e abra o relatório novamente.' : 'Carregando imagem...'}</Text>) : <Text style={styles.text}>Nenhuma foto anexada a este registro.</Text>}
    <Text style={styles.caption}>Autoria</Text><Text style={styles.text}>{report.authorName} · {displayTime(report.createdAt)}</Text>
    {signature ? <View style={styles.signature}><Text style={styles.section}>Assinatura registrada</Text><Text style={styles.text}>{signature.authorName}</Text><Text style={styles.text}>{displayTime(signature.at)}</Text><Text style={styles.small}>Versão revisada: {signature.version}. Identificador do conteúdo:</Text><Text style={styles.hash} selectable>{signature.contentHash}</Text><Text style={styles.small}>Confirmação eletrônica do projeto acadêmico. Não é uma assinatura certificada ICP-Brasil.</Text></View> : null}
    {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
    {user.role === 'owner' && !report.signature && !selectedVersion ? <View style={styles.actions}>
      {showReturn && mayReturn ? <>
        <FormField label="Motivo da devolução" multiline value={reason} maxLength={1000}
          editable={!busy} onChangeText={setReason} placeholder="O que o responsável precisa corrigir?"
          hint="Visível apenas para o autor do RDO e o Dono. Mínimo de 5 caracteres." />
        <ActionButton label="Devolver ao responsável" busy={busy} disabled={reason.trim().length < 5 || exporting} onPress={returnReport} />
        <ActionButton label="Cancelar devolução" secondary disabled={busy} onPress={() => { setShowReturn(false); setError(''); }} />
      </> : <>
        <ActionButton label={returned ? 'Corrigir como Dono' : 'Editar relatório'} secondary disabled={busy || exporting} onPress={() => onEdit(report)} />
        {mayReturn ? <ActionButton label="Pedir correção" secondary disabled={busy || exporting} onPress={() => { setConfirmed(false); setShowReturn(true); }} /> : null}
        {returned ? <Text style={styles.text}>O RDO precisa voltar à revisão antes de ser assinado.</Text> : <>
          <Choice label="Revisei o relatório e confirmo a assinatura. A edição será bloqueada." selected={confirmed} onPress={() => setConfirmed(!confirmed)} />
          <ActionButton label="Assinar e bloquear edição" busy={busy} disabled={!confirmed || exporting} onPress={sign} />
        </>}
      </>}
    </View> : null}
    <Text style={styles.section}>Histórico de versões</Text>
    {report.versions.slice().reverse().map((version) => <View key={version.number} style={styles.versionRow}><Text style={styles.versionTitle}>Versão {version.number} · {version.action}</Text><Text style={styles.small}>{version.actorName} · {displayTime(version.at)}</Text><ActionButton label={`Ver versão ${version.number}`} secondary onPress={() => setSelectedVersion(version)} /></View>)}
    <View style={styles.actions}><ActionButton label={backLabel} secondary onPress={onBack} /></View>
  </View>;
}
