import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import Choice from '../Choice';
import { request } from '../../services/api';
import { displayDate, displayTime } from '../../services/dates';
import styles from './styles';

export default function ReportDetail({ reportId, revision, user, onEdit, onChanged, onBack }) {
  const [report, setReport] = useState(null);
  const [images, setImages] = useState({});
  const [failedImages, setFailedImages] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  useEffect(() => {
    let active = true;
    request(`/reports/${reportId}`).then(async ({ report: next }) => {
      if (!active) return;
      setReport(next); setError('');
      const photoIds = [...new Set([...next.photos, ...next.versions.flatMap((v) => v.content.photos)])];
      const results = await Promise.allSettled(photoIds.map(async (id) => [id, (await request(`/photos/${id}`)).uri]));
      if (!active) return;
      setImages(Object.fromEntries(results.filter((r) => r.status === 'fulfilled').map((r) => r.value)));
      setFailedImages(photoIds.filter((id, index) => results[index].status === 'rejected'));
    }).catch((e) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [reportId, revision]);
  async function sign() {
    setBusy(true); setError('');
    try {
      const response = await request(`/reports/${report.id}/sign`, 'POST', { confirm: confirmed, version: report.versions.length });
      setReport(response.report); setConfirmed(false); await onChanged();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  if (!report) return <View>{error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.text}>Carregando relatório...</Text>}<ActionButton label="Voltar ao histórico" secondary onPress={onBack} /></View>;
  const content = selectedVersion?.content || report;
  return <View>
    <Text style={styles.title}>Diário de {displayDate(content.date)}</Text>
    <View style={[styles.badge, report.signature && styles.signedBadge]}><Text style={styles.badgeText}>{report.signature ? 'Assinado · edição bloqueada' : 'Aguardando assinatura'}</Text></View>
    {selectedVersion ? <View style={styles.versionNotice}><Text style={styles.text}>Visualizando versão {selectedVersion.number}, de {displayTime(selectedVersion.at)}.</Text><ActionButton label="Voltar à versão atual" secondary onPress={() => setSelectedVersion(null)} /></View> : null}
    <Text style={styles.caption}>Atividades realizadas</Text><Text style={styles.text}>{content.activities}</Text>
    <View style={styles.progress}><Text style={styles.progressNumber}>{content.progress}%</Text><Text style={styles.progressLabel}>de avanço informado</Text></View>
    {['team', 'weather', 'materials', 'occurrences'].map((field, i) => <View key={field}><Text style={styles.caption}>{['Equipe', 'Condições do tempo', 'Materiais utilizados', 'Ocorrências e observações'][i]}</Text><Text style={styles.text}>{content[field] || 'Não informado.'}</Text></View>)}
    <Text style={styles.caption}>Fotos ({content.photos.length})</Text>
    {content.photos.length ? content.photos.map((id) => images[id] ? <Image key={id} source={{ uri: images[id] }} style={styles.photo} resizeMode="cover" accessibilityLabel="Foto anexada ao relatório da obra" /> : <Text key={id} style={styles.text}>{failedImages.includes(id) ? 'Não foi possível carregar esta foto. Volte ao histórico e abra o relatório novamente.' : 'Carregando imagem...'}</Text>) : <Text style={styles.text}>Nenhuma foto anexada a este registro.</Text>}
    <Text style={styles.caption}>Autoria</Text><Text style={styles.text}>{report.authorName} · {displayTime(report.createdAt)}</Text>
    {report.signature ? <View style={styles.signature}><Text style={styles.section}>Assinatura registrada</Text><Text style={styles.text}>{report.signature.authorName}</Text><Text style={styles.text}>{displayTime(report.signature.at)}</Text><Text style={styles.small}>Versão revisada: {report.signature.version}. Identificador do conteúdo:</Text><Text style={styles.hash} selectable>{report.signature.contentHash}</Text><Text style={styles.small}>Confirmação eletrônica do projeto acadêmico. Não é uma assinatura certificada ICP-Brasil.</Text></View> : null}
    <Text style={styles.section}>Histórico de versões</Text>
    {report.versions.slice().reverse().map((version) => <View key={version.number} style={styles.versionRow}><Text style={styles.versionTitle}>Versão {version.number} · {version.action}</Text><Text style={styles.small}>{version.actorName} · {displayTime(version.at)}</Text><ActionButton label={`Ver versão ${version.number}`} secondary onPress={() => setSelectedVersion(version)} /></View>)}
    {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
    {user.role === 'owner' && !report.signature && !selectedVersion ? <View style={styles.actions}><ActionButton label="Editar relatório" secondary disabled={busy} onPress={() => onEdit(report)} /><Choice label="Revisei o relatório e confirmo a assinatura. A edição será bloqueada." selected={confirmed} onPress={() => setConfirmed(!confirmed)} /><ActionButton label="Assinar e bloquear edição" busy={busy} disabled={!confirmed} onPress={sign} /></View> : null}
    <View style={styles.actions}><ActionButton label="Voltar ao histórico" secondary onPress={onBack} /></View>
  </View>;
}
