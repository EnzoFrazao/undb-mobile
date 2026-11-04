import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { request } from './api';

export async function exportReport(report) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('O compartilhamento não está disponível neste dispositivo.');
  }
  const bytes = await request(`/reports/${report.id}/pdf?version=${report.versions.length}`, 'GET', undefined, 'pdf');
  const file = new File(Paths.cache, `RDO-${report.date}-${report.id.slice(0, 8)}-v${report.versions.length}.pdf`);
  file.create({ overwrite: true });
  file.write(bytes);
  await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Compartilhar RDO' });
}
