import { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ActionButton from '../ActionButton';
import Choice from '../Choice';
import ConfirmDialog from '../ConfirmDialog';
import DateField from '../DateField';
import ErrorState from '../ErrorState';
import FormField from '../FormField';
import { request } from '../../services/api';
import { localDate } from '../../services/dates';
import { parseDisplayDate, parsePercent, toDisplayDate } from '../../services/dateMask.cjs';
import { fieldLimits } from '../../services/draftStore.cjs';
import { reportDrafts } from '../../services/reportDrafts';
import { isDirty } from '../../services/dirty.cjs';
import { focusFirstError } from '../../services/formErrors';
import { useExitGuard } from '../../services/useExitGuard';
import styles from './styles';

const maxPhotoSize = 8 * 1024 * 1024;
const fieldOrder = ['date', 'activities', 'progress', 'team', 'weather', 'materials', 'occurrences'];
const fieldLabels = {
  activities: 'Atividades realizadas', progress: 'Avanço da obra (%)', team: 'Equipe',
  weather: 'Condições do tempo', materials: 'Materiais utilizados', occurrences: 'Ocorrências e observações',
};

export default function ReportEditor({ work, report, resubmitting = false, lockDate = false, draftKey, onSaved, onCancel, onDirtyChange, onBlockingChange, scrollRef }) {
  const initial = useRef({
    date: toDisplayDate(report?.date || localDate()), activities: report?.activities || '', weather: report?.weather || '',
    team: report?.team || '', materials: report?.materials || '', occurrences: report?.occurrences || '', progress: String(report?.progress ?? 0),
  });
  const version = useRef(report?.versions.length);
  const [fields, setFields] = useState(initial.current);
  const latest = useRef(fields);
  const refs = useRef(Object.fromEntries(fieldOrder.map((key) => [key, { current: null }]))).current;
  const saveAttempt = useRef(0);
  const operation = useRef(false);
  const [draftStatus, setDraftStatus] = useState(draftKey ? 'loading' : 'idle');
  const [confirmation, setConfirmation] = useState(null);
  const [photos, setPhotos] = useState(() => (report?.photos || []).map((id) => ({ key: id, id })));
  const originalPhotos = useRef(photos.map((item) => item.key));
  const nextPhoto = useRef(0);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const changedText = isDirty(initial.current, fields);
  const changedPhotos = isDirty({ photos: originalPhotos.current }, { photos: photos.map((photo) => photo.key) });
  const draftAtRisk = draftStatus === 'failed' && changedText;
  const dirty = draftAtRisk ? 'O rascunho não foi salvo neste dispositivo. O texto recente será perdido.'
    : draftKey && changedPhotos ? 'As fotos não ficam no rascunho. Você precisará anexá-las novamente.'
      : !draftKey && (changedText || changedPhotos) ? 'As mudanças feitas neste RDO serão descartadas.' : '';
  useExitGuard(dirty, busy || Boolean(uploading) || draftStatus === 'saving' || Boolean(confirmation), onDirtyChange, onBlockingChange);

  useEffect(() => {
    if (!draftKey) return;
    let active = true;
    reportDrafts.load(draftKey).then((draft) => {
      if (!active) return;
      if (draft) {
        const restored = { ...initial.current, ...draft.fields };
        restored.date = toDisplayDate(restored.date);
        latest.current = restored;
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
    reportDrafts.save(draftKey, { ...next, date: parseDisplayDate(next.date) || next.date }).then(
      () => { if (attempt === saveAttempt.current) setDraftStatus('saved'); },
      () => { if (attempt === saveAttempt.current) setDraftStatus('failed'); },
    );
  }
  function update(field, value) {
    if (operation.current || draftStatus === 'loading' || confirmation) return;
    const next = { ...latest.current, [field]: value };
    latest.current = next;
    setFields(next);
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    persistDraft(next);
  }
  async function discardDraft() {
    operation.current = true;
    setBusy(true);
    ++saveAttempt.current;
    try {
      await reportDrafts.clear(draftKey);
      latest.current = initial.current;
      setFields(initial.current);
      setDraftStatus('idle');
    } catch { setError('Não foi possível descartar o rascunho. Tente novamente.'); }
    finally { operation.current = false; setBusy(false); }
  }
  async function upload(photo) {
    try {
      const result = await request('/photos', 'POST', { workId: work.id, base64: photo.base64, consent: true });
      setPhotos((items) => items.map((item) => item.key === photo.key ? { key: item.key, id: result.photo.id, uri: photo.uri } : item));
    } catch (error) {
      setPhotos((items) => items.map((item) => item.key === photo.key
        ? { ...item, error: error.message, retryable: !error.status || error.status >= 500 || error.status === 429 } : item));
    }
  }
  async function retry(photo) {
    if (operation.current) return;
    operation.current = true;
    setUploading('Reenviando foto…');
    try { await upload(photo); }
    finally { operation.current = false; setUploading(''); }
  }
  async function pick(camera = false) {
    if (operation.current || confirmation) return;
    if (!consent) { setError('Confirme a autorização de uso das fotos antes de anexar.'); return; }
    if (photos.length >= 10) { setError('Você pode anexar até 10 fotos.'); return; }
    operation.current = true;
    setError('');
    setUploading('Abrindo seleção…');
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) { setError('Autorize a câmera ou escolha uma foto da galeria.'); return; }
      }
      const options = { mediaTypes: ['images'], quality: 0.6, base64: true, allowsMultipleSelection: !camera, selectionLimit: 10 - photos.length };
      const result = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled) return;
      const batch = result.assets.slice(0, 10 - photos.length).map((asset) => {
        const byteLength = asset.base64 ? Math.floor(asset.base64.length * 3 / 4) - (asset.base64.match(/=+$/)?.[0].length || 0) : 0;
        const message = asset.fileSize > maxPhotoSize || byteLength > maxPhotoSize ? 'A foto excede o limite de 8 MB.' : !asset.base64 ? 'Não foi possível ler a foto. Use JPEG, PNG ou WebP.' : '';
        return { key: `local-${++nextPhoto.current}`, uri: asset.uri, ...(message ? { error: message } : { base64: asset.base64 }) };
      });
      setPhotos((previous) => [...previous, ...batch]);
      for (const [index, photo] of batch.entries()) {
        if (photo.error) continue;
        setUploading(`Enviando foto ${index + 1} de ${batch.length}…`);
        await upload(photo);
      }
    } catch (e) { setError(e.message); }
    finally { operation.current = false; setUploading(''); }
  }
  function showErrors(next) {
    setErrors(next);
    focusFirstError(next, fieldOrder, refs, scrollRef);
  }
  async function save() {
    if (operation.current || photos.some((photo) => !photo.id)) return;
    const values = latest.current;
    const dateLocked = lockDate || Boolean(report?.correction);
    const date = report && (dateLocked || values.date === initial.current.date) ? report.date : parseDisplayDate(values.date);
    const progress = parsePercent(values.progress);
    const nextErrors = {};
    if (!date) nextErrors.date = 'Informe uma data válida, como 04/11/2026.';
    if (values.activities.trim().length < 5) nextErrors.activities = 'Descreva as atividades com pelo menos 5 caracteres.';
    if (progress === null) nextErrors.progress = 'Use um número de 0 a 100, por exemplo 12,5.';
    showErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    operation.current = true;
    setBusy(true); setError('');
    try {
      const body = { ...values, date, progress, photos: photos.map((photo) => photo.id), workId: work.id, version: version.current };
      const route = report ? `/reports/${report.id}${resubmitting ? '/resubmit' : ''}` : '/reports';
      const response = await request(route, report && !resubmitting ? 'PATCH' : 'POST', body);
      let draftCleanupFailed = false;
      if (draftKey) {
        ++saveAttempt.current;
        try { await reportDrafts.clear(draftKey); }
        catch { draftCleanupFailed = true; }
      }
      onSaved(response.report, draftCleanupFailed);
    } catch (e) { setError(e.message); if (e.fields) showErrors(e.fields); }
    finally { operation.current = false; setBusy(false); }
  }

  if (draftStatus === 'loading') return <Text style={styles.subtitle} accessibilityLiveRegion="polite">Carregando rascunho…</Text>;
  const editable = !busy && !uploading && !confirmation;
  const dateLocked = lockDate || Boolean(report?.correction);
  const draftMessage = {
    idle: 'O texto é salvo neste dispositivo enquanto você preenche. Fotos não ficam no rascunho.',
    restored: 'Rascunho recuperado. Se necessário, anexe as fotos novamente.',
    saving: 'Salvando rascunho…',
    saved: 'Rascunho salvo neste dispositivo. Fotos não ficam no rascunho.',
  };
  const fieldProps = (field) => ({
    inputRef: refs[field], editable, value: fields[field], maxLength: fieldLimits[field],
    onChangeText: (value) => update(field, value), error: errors[field],
  });
  return <View>
    {report?.correction ? <Text style={styles.draftNote}>Correção solicitada: {report.correction.reason}</Text> : null}
    {draftKey ? draftStatus === 'failed' ? <ErrorState message="Não foi possível salvar o rascunho neste dispositivo."
      onRetry={editable ? () => persistDraft(latest.current) : undefined} retryLabel="Tentar salvar rascunho" />
      : <Text style={styles.draftNote}>{draftMessage[draftStatus]}</Text> : null}
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.section}>Registro do dia</Text>
      <DateField {...fieldProps('date')} label="Data do relatório" editable={editable && !dateLocked}
        hint={dateLocked ? 'A data original do RDO é preservada.' : undefined} returnKeyType="next" submitBehavior="submit"
        onSubmitEditing={() => refs.activities.current?.focus()} />
      {fieldOrder.slice(1).map((field, index) => {
        const multiline = ['activities', 'materials', 'occurrences'].includes(field);
        const next = fieldOrder[index + 2];
        return <FormField key={field} {...fieldProps(field)} label={fieldLabels[field]} optional={index > 1} multiline={multiline}
          keyboardType={field === 'progress' ? 'decimal-pad' : 'default'} inputMode={field === 'progress' ? 'decimal' : undefined}
          returnKeyType={!multiline && next ? 'next' : undefined} submitBehavior={!multiline && next ? 'submit' : undefined}
          onSubmitEditing={!multiline && next ? () => refs[next].current?.focus() : undefined} />;
      })}
    </View>
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.section}>Fotos da obra</Text>
      <Text style={styles.subtitle}>Até 10 imagens, com no máximo 8 MB cada.</Text>
      <Choice label="Tenho autorização para compartilhar estas imagens com as pessoas vinculadas à obra."
        disabled={!editable} selected={consent} onPress={() => setConsent(!consent)} />
      <View style={styles.actions}>
        <ActionButton label="Galeria" icon="gallery" secondary busy={Boolean(uploading)} busyLabel={uploading} disabled={!editable} onPress={() => pick(false)} />
        {Platform.OS !== 'web' ? <ActionButton label="Câmera" icon="camera" secondary disabled={!editable} onPress={() => pick(true)} /> : null}
      </View>
      {photos.map((photo, index) => <View key={photo.key}>
        <View style={styles.photoRow}>
          {photo.uri ? <Image source={{ uri: photo.uri }} style={styles.thumbnail} accessible={false} /> : null}
          <Text style={styles.photoLabel}>Foto {index + 1}{photo.id ? ' anexada' : ''}</Text>
          <Pressable disabled={!editable} accessibilityRole="button" accessibilityLabel={`Remover foto ${index + 1}`}
            onPress={() => setConfirmation({ title: `Remover foto ${index + 1}?`, message: 'A foto será retirada deste RDO.', label: 'Remover foto', action: () => setPhotos((items) => items.filter((item) => item.key !== photo.key)) })}
            style={styles.remove}><Text style={styles.removeText}>Remover</Text></Pressable>
        </View>
        {photo.error ? <ErrorState message={photo.error} onRetry={photo.retryable && editable ? () => retry(photo) : undefined} /> : null}
      </View>)}
    </View>
    {error ? <ErrorState message={error} /> : null}
    <View style={styles.footer}>
      <ActionButton testID="rdo-save" label={resubmitting ? 'Reenviar RDO' : report?.correction ? 'Salvar e voltar à revisão' : report ? 'Salvar alterações' : 'Enviar RDO'}
        busy={busy} busyLabel={report ? 'Salvando RDO…' : 'Enviando RDO…'} disabled={!editable || photos.some((photo) => !photo.id)} onPress={save} />
      <ActionButton label={draftKey ? 'Voltar sem enviar' : 'Cancelar'} secondary disabled={!editable || draftStatus === 'saving'} onPress={onCancel} />
      {draftKey && draftStatus !== 'idle' ? <ActionButton label="Descartar rascunho" secondary disabled={!editable}
        onPress={() => setConfirmation({ title: 'Descartar rascunho?', message: 'O texto salvo neste dispositivo será apagado.', label: 'Descartar rascunho', action: discardDraft })} /> : null}
    </View>
    <ConfirmDialog visible={Boolean(confirmation)} title={confirmation?.title} message={confirmation?.message} confirmLabel={confirmation?.label}
      onCancel={() => setConfirmation(null)} onConfirm={() => { setConfirmation(null); confirmation?.action(); }} />
  </View>;
}
