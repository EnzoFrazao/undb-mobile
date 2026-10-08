import { useState } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FormField from '../FormField';
import ActionButton from '../ActionButton';
import Choice from '../Choice';
import { request } from '../../services/api';
import { localDate } from '../../services/dates';
import styles from './styles';

export default function ReportEditor({ work, report, onSaved, onCancel }) {
  const [fields, setFields] = useState({ date: report?.date || localDate(), activities: report?.activities || '', weather: report?.weather || 'Ensolarado', team: report?.team || '', materials: report?.materials || '', occurrences: report?.occurrences || '', progress: String(report?.progress ?? 0) });
  const [photos, setPhotos] = useState((report?.photos || []).map((id) => ({ id })));
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  function update(field, value) { setFields((previous) => ({ ...previous, [field]: value })); setErrors((previous) => ({ ...previous, [field]: undefined })); }
  async function pick(camera = false) {
    if (uploading) return;
    if (!consent) { setError('Confirme a autorização de uso das fotos antes de anexar.'); return; }
    if (photos.length >= 10) { setError('Você pode anexar até 10 fotos.'); return; }
    setError('');
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) { setError('Autorize a câmera ou escolha uma foto da galeria.'); return; }
      }
      const options = { mediaTypes: ['images'], quality: 0.6, base64: true, allowsMultipleSelection: !camera, selectionLimit: 10 - photos.length };
      const result = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled) return;
      setUploading(true);
      for (const asset of result.assets.slice(0, 10 - photos.length)) {
        if (!asset.base64) throw new Error('Não foi possível ler a foto. Use JPEG ou PNG.');
        const { photo } = await request('/photos', 'POST', { workId: work.id, base64: asset.base64, consent });
        setPhotos((previous) => [...previous, { id: photo.id, uri: asset.uri }]);
      }
    } catch (e) { setError(e.message); }
    finally { setUploading(false); }
  }
  async function save() {
    const nextErrors = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) nextErrors.date = 'Use o formato AAAA-MM-DD.';
    if (fields.activities.trim().length < 5) nextErrors.activities = 'Descreva as atividades realizadas.';
    if (fields.progress.trim() === '' || !Number.isFinite(Number(fields.progress)) || Number(fields.progress) < 0 || Number(fields.progress) > 100) nextErrors.progress = 'Informe um valor de 0 a 100.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true); setError('');
    try {
      const body = { ...fields, progress: Number(fields.progress), photos: photos.map((photo) => photo.id), workId: work.id, version: report?.versions.length };
      await request(report ? `/reports/${report.id}` : '/reports', report ? 'PATCH' : 'POST', body);
      await onSaved();
    } catch (e) { setError(e.message); if (e.fields) setErrors(e.fields); }
    finally { setBusy(false); }
  }
  return <View>
    <Text style={styles.title}>{report ? 'Editar relatório' : 'Novo relatório'}</Text><Text style={styles.subtitle}>{work.name} · {work.contract}</Text>
    <FormField label="Data do relatório" value={fields.date} onChangeText={(value) => update('date', value)} placeholder="AAAA-MM-DD" hint="Exemplo: 2026-10-07" error={errors.date} />
    <FormField label="Atividades realizadas" multiline value={fields.activities} onChangeText={(value) => update('activities', value)} placeholder="O que foi realizado na obra hoje?" error={errors.activities} />
    <FormField label="Avanço da obra (%)" value={fields.progress} onChangeText={(value) => update('progress', value)} inputMode="numeric" keyboardType="numeric" error={errors.progress} />
    <FormField label="Equipe" value={fields.team} onChangeText={(value) => update('team', value)} placeholder="Quantidade de profissionais e funções" />
    <FormField label="Condições do tempo" value={fields.weather} onChangeText={(value) => update('weather', value)} placeholder="Ensolarado, chuva..." />
    <FormField label="Materiais utilizados" multiline value={fields.materials} onChangeText={(value) => update('materials', value)} placeholder="Opcional" />
    <FormField label="Ocorrências e observações" multiline value={fields.occurrences} onChangeText={(value) => update('occurrences', value)} placeholder="Atrasos, ocorrências ou informações importantes" />
    <Text style={styles.section}>Fotos da obra</Text><Text style={styles.subtitle}>Até 10 imagens, com no máximo 8 MB cada.</Text>
    <Choice label="Tenho autorização para compartilhar estas imagens com as pessoas vinculadas à obra." selected={consent} onPress={() => setConsent(!consent)} />
    <View style={styles.actions}><ActionButton label="Galeria" secondary busy={uploading} disabled={busy} onPress={() => pick(false)} />{Platform.OS !== 'web' ? <ActionButton label="Câmera" secondary disabled={uploading || busy} onPress={() => pick(true)} /> : null}</View>
    {photos.map((photo, index) => <View key={photo.id} style={styles.photoRow}>{photo.uri ? <Image source={{ uri: photo.uri }} style={styles.thumbnail} /> : null}<Text style={styles.photoLabel}>Foto {index + 1} anexada</Text><Pressable disabled={busy || uploading} accessibilityRole="button" accessibilityLabel={`Remover foto ${index + 1}`} onPress={() => setPhotos((previous) => previous.filter((p) => p.id !== photo.id))} style={styles.remove}><Text style={styles.removeText}>Remover</Text></Pressable></View>)}
    {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
    <View style={styles.footer}><ActionButton label={report ? 'Salvar alterações' : 'Enviar relatório'} busy={busy} disabled={uploading} onPress={save} /><ActionButton label="Cancelar" secondary disabled={busy || uploading} onPress={onCancel} /></View>
  </View>;
}
