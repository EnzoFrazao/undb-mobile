import { request } from './api';

export async function exportReport(report) {
  const bytes = await request(`/reports/${report.id}/pdf?version=${report.versions.length}`, 'GET', undefined, 'pdf');
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `RDO-${report.date}-${report.id.slice(0, 8)}.pdf`;
  document.body.appendChild(link);
  try { link.click(); }
  finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
