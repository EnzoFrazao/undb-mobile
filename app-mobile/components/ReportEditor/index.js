import { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FormField from '../FormField';
import ActionButton from '../ActionButton';
import Choice from '../Choice';
import { request } from '../../services/api';
import { localDate } from '../../services/dates';
import { fieldLimits } from '../../services/draftStore.cjs';
import { reportDrafts } from '../../services/reportDrafts';
import styles from './styles';

export default function ReportEditor({ work, report, resubmitting = false, lockDate = false, draftKey, onSaved, onCancel }) {
  const [fields, setFields] = useState({ date: report?.date || localDate(), activities: report?.activities || '', weather: report?.weather || '', team: report?.team || '', materials: report?.materials || '', occurrences: report?.occurrences || '', progress: String(report?.progress ?? 0) });
  const initialFields = useRef(fields);
  const latestFields = useRef(fields);
  const saveAttempt = useRef(0);
  const [draftStatus, setDraftStatus] = useState(draftKey ? 'loading' : 'idle');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [photos, setPhotos] = useState((report?.photos || []).map((id) => ({ id })));
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!draftKey) return;
    let active = true;
    reportDrafts.load(draftKey).then((draft) => {
      if (!active) return;
      if (draft) {
        const restored = { ...initialFields.current, ...draft.fields };
        latestFields.current = restored;
        setFields(restored);
      }
      setDraftStatus(draft ? 'restored' : 'idle');
    }).catch(() => { if (active) setDraftStatus('failed'); });
    return () => { active = false; saveAttempt.current += 1; };
  }, [draftKey]);

  function persistDraft(next) {
    if (!draftKey) return;
    const attempt = ++saveAttempt.current;
    setDraftStatus('saving');
    reportDrafts.save(draftKey, next).then(
      () => { if (attempt === saveAttempt.current) setDraftStatus('saved'); },
      () => { if (attempt === saveAttempt.current) setDraftStatus('failed'); },
    );
  }
  function update(field, value) {
    if (busy || draftStatus === 'loading' || confirmDiscard) return;
    const next = { ...latestFields.current, [field]: value };
    latestFields.current = next;
    setFields(next);
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    persistDraft(next);
  }
  async function discardDraft() {
    setBusy(true);
    ++saveAttempt.current;
    try {
      await reportDrafts.clear(draftKey);
      onCancel();
    } catch {
      setConfirmDiscard(false);
      setError('Não foi possível descartar o rascunho. Tente novamente.');
    } finally { setBusy(false); }
  }
  async function pick(camera = false) {
    if (uploading || busy || confirmDiscard) return;
    if (!consent) { setError('Confirme a autorização de uso das fotos antes de anexar.'); return; }
    if (photos.length >= 10) { setError('Você pode anexar até 10 fotos.'); return; }
    setError('');
    setUploading(true);
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) { setError('Autorize a câmera ou escolha uma foto da galeria.'); return; }
      }
      const options = { mediaTypes: ['images'], quality: 0.6, base64: true, allowsMultipleSelection: !camera, selectionLimit: 10 - photos.length };
      const result = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled) return;
      for (const asset of result.assets.slice(0, 10 - photos.length)) {
        if (!asset.base64) throw new Error('Não foi possível ler a foto. Use JPEG ou PNG.');
        const { photo } = await request('/photos', 'POST', { workId: work.id, base64: asset.base64, consent });
        setPhotos((previous) => [...previous, { id: photo.id, uri: asset.uri }]);
      }
    } catch (e) { setError(e.message); }
    finally { setUploading(false); }
  }
  async function save() {
    if (busy || uploading) return;
    const fields = latestFields.current;
    const nextErrors = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) nextErrors.date = 'Use o formato AAAA-MM-DD.';
    if (fields.activities.trim().length < 5) nextErrors.activities = 'Descreva as atividades realizadas.';
    if (fields.progress.trim() === '' || !Number.isFinite(Number(fields.progress)) || Number(fields.progress) < 0 || Number(fields.progress) > 100) nextErrors.progress = 'Informe um valor de 0 a 100.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true); setError('');
    try {
      const body = { ...fields, progress: Number(fields.progress), photos: photos.map((photo) => photo.id), workId: work.id, version: report?.versions.length };
      const route = report ? `/reports/${report.id}${resubmitting ? '/resubmit' : ''}` : '/reports';
      const response = await request(route, report && !resubmitting ? 'PATCH' : 'POST', body);
      let draftCleanupFailed = false;
      if (draftKey) {
        ++saveAttempt.current;
        try { await reportDrafts.clear(draftKey); }
        catch { draftCleanupFailed = true; }
      }
      onSaved(response.report, draftCleanupFailed);
    } catch (e) { setError(e.message); if (e.fields) setErrors(e.fields); }
    finally { setBusy(false); }
  }
  if (draftStatus === 'loading') return <Text style={styles.subtitle} accessibilityLiveRegion="polite">Carregando rascunho…</Text>;
  const editable = !busy && !confirmDiscard;
  const dateLocked = lockDate || Boolean(report?.correction);
  const draftMessage = {
    idle: 'Os campos de texto são salvos neste dispositivo enquanto você preenche. Fotos não ficam no rascunho.',
    restored: 'Rascunho recuperado. Se necessário, anexe as fotos novamente.',
    saving: 'Salvando rascunho…',
    saved: 'Rascunho salvo neste dispositivo. Fotos não ficam no rascunho.',
  };
  return <View>
    <Text style={styles.title}>{report?.correction ? 'Corrigir RDO' : report ? 'Editar RDO' : 'Preencher RDO'}</Text><Text style={styles.subtitle}>{work.name} · {work.contract}</Text>
    {report?.correction ? <Text style={styles.draftNote}>Correção solicitada: {report.correction.reason}</Text> : null}
    {draftKey ? draftStatus === 'failed' ? <View style={styles.draftWarning}>
      <Text style={styles.error} accessibilityRole="alert">Não foi possível acessar o rascunho local. Não feche a tela sem salvar ou enviar.</Text>
      <ActionButton label="Tentar salvar rascunho" secondary disabled={!editable} onPress={() => persistDraft(latestFields.current)} />
    </View> : <Text style={styles.draftNote}>{draftMessage[draftStatus]}</Text> : null}
    <FormField label="Data do relatório" editable={editable && !dateLocked} maxLength={fieldLimits.date} value={fields.date} onChangeText={(value) => update('date', value)} placeholder="AAAA-MM-DD" hint={dateLocked ? 'A data original do RDO é preservada.' : 'Use o formato AAAA-MM-DD.'} error={errors.date} />
    <FormField label="Atividades realizadas" editable={editable} maxLength={fieldLimits.activities} multiline value={fields.activities} onChangeText={(value) => update('activities', value)} placeholder="O que foi realizado na obra hoje?" error={errors.activities} />
    <FormField label="Avanço da obra (%)" editable={editable} maxLength={fieldLimits.progress} value={fields.progress} onChangeText={(value) => update('progress', value)} inputMode="numeric" keyboardType="numeric" error={errors.progress} />
    <FormField label="Equipe" editable={editable} maxLength={fieldLimits.team} value={fields.team} onChangeText={(value) => update('team', value)} placeholder="Quantidade de profissionais e funções" />
    <FormField label="Condições do tempo" editable={editable} maxLength={fieldLimits.weather} value={fields.weather} onChangeText={(value) => update('weather', value)} placeholder="Ensolarado, chuva..." />
    <FormField label="Materiais utilizados" editable={editable} maxLength={fieldLimits.materials} multiline value={fields.materials} onChangeText={(value) => update('materials', value)} placeholder="Opcional" />
    <FormField label="Ocorrências e observações" editable={editable} maxLength={fieldLimits.occurrences} multiline value={fields.occurrences} onChangeText={(value) => update('occurrences', value)} placeholder="Atrasos, ocorrências ou informações importantes" />
    <Text style={styles.section}>Fotos da obra</Text><Text style={styles.subtitle}>Até 10 imagens, com no máximo 8 MB cada.</Text>
    <Choice label="Tenho autorização para compartilhar estas imagens com as pessoas vinculadas à obra." selected={consent} onPress={() => setConsent(!consent)} />
    <View style={styles.actions}><ActionButton label="Galeria" secondary busy={uploading} disabled={!editable} onPress={() => pick(false)} />{Platform.OS !== 'web' ? <ActionButton label="Câmera" secondary disabled={uploading || !editable} onPress={() => pick(true)} /> : null}</View>
    {photos.map((photo, index) => <View key={photo.id} style={styles.photoRow}>{photo.uri ? <Image source={{ uri: photo.uri }} style={styles.thumbnail} /> : null}<Text style={styles.photoLabel}>Foto {index + 1} anexada</Text><Pressable disabled={!editable || uploading} accessibilityRole="button" accessibilityLabel={`Remover foto ${index + 1}`} onPress={() => setPhotos((previous) => previous.filter((p) => p.id !== photo.id))} style={styles.remove}><Text style={styles.removeText}>Remover</Text></Pressable></View>)}
    {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
    <View style={styles.footer}>
      {confirmDiscard ? <>
        <Text style={styles.subtitle}>Descartar o texto salvo neste dispositivo? O RDO não será enviado.</Text>
        <ActionButton label="Descartar rascunho" busy={busy} onPress={discardDraft} />
        <ActionButton label="Continuar preenchendo" secondary disabled={busy} onPress={() => setConfirmDiscard(false)} />
      </> : <>
        <ActionButton label={resubmitting ? 'Reenviar RDO' : report?.correction ? 'Salvar e voltar à revisão' : report ? 'Salvar alterações' : 'Enviar RDO'} busy={busy} disabled={uploading} onPress={save} />
        <ActionButton label={draftKey ? 'Voltar sem enviar' : 'Cancelar'} secondary disabled={busy || uploading || draftStatus === 'saving'} onPress={onCancel} />
        {draftKey && draftStatus !== 'idle' ? <ActionButton label="Descartar rascunho" secondary disabled={busy || uploading} onPress={() => setConfirmDiscard(true)} /> : null}
      </>}
    </View>
  </View>;
}
