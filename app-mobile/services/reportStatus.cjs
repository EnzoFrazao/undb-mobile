function reportStatus(report) {
  if (report.signature) return 'signed';
  return report.status === 'returned' ? 'returned' : 'pending';
}

function reportStatusLabel(report) {
  return { signed: 'Assinado', returned: 'Em correção', pending: 'Aguardando assinatura' }[reportStatus(report)];
}

module.exports = { reportStatus, reportStatusLabel };
