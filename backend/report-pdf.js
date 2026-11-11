const fs = require('node:fs/promises');
const path = require('node:path');
const { PDFDocument } = require('pdfkit');
const sharp = require('sharp');

const productName = 'Workfy - Diário de Obra';
const logoPath = path.join(__dirname, 'assets', 'planengen-letterhead.png');
const brand = '#010028';
const ink = '#202020';
const muted = '#4F5D70';
const divider = '#D7DEE6';
const pageMargins = { top: 86, bottom: 64, left: 48, right: 48 };

const timestamp = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo',
});
const displayDate = (date) => date.split('-').reverse().join('/');
// The built-in PDF fonts use WinAnsi; remove unsupported characters instead of
// emitting corrupt glyphs. The original report remains unchanged.
const printable = (value) => String(value ?? '').normalize('NFC')
  .replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2010-\u2015]/g, '-').replace(/[^\x20-\x7e\xa0-\xff\n\r\t]/gu, '?');

async function createReportPdf({ work, report, photos, directory }) {
  const doc = new PDFDocument({
    size: 'A4', margins: pageMargins,
    bufferPages: true, info: { Title: 'Relatório Diário de Obra', Author: productName },
  });
  const chunks = [];
  const bytes = new Promise((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.once('end', () => resolve(Buffer.concat(chunks)));
    doc.once('error', reject);
  });
  const width = doc.page.width - pageMargins.left - pageMargins.right;
  function ensure(height) {
    if (doc.y + height > doc.page.height - pageMargins.bottom) doc.addPage();
  }
  function section(title, value) {
    ensure(52);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(brand).text(title);
    doc.moveDown(0.25);
    doc.font('Helvetica').fontSize(11).fillColor(ink)
      .text(printable(value) || 'Não informado.', { lineGap: 3 });
    doc.moveDown(0.85);
  }
  doc.font('Helvetica-Bold').fontSize(24).fillColor(brand).text('Relatório Diário de Obra');
  doc.moveDown(0.25);
  doc.font('Helvetica').fontSize(12).fillColor(muted)
    .text(`${displayDate(report.date)}   |   Versão ${report.versions.length}   |   ${report.signature ? 'Assinado' : report.status === 'returned' ? 'Em correção' : 'Aguardando assinatura'}`);
  doc.moveDown(1.25);
  section('Obra e contrato', `${work.name}\nContrato: ${work.contract}\n${work.address}`);
  section('Autoria', `${report.authorName} - ${timestamp.format(new Date(report.createdAt))} (Brasília)`);
  section('Atividades realizadas', report.activities);
  section('Avanço informado', `${report.progress}%`);
  section('Equipe', report.team);
  section('Condições do tempo', report.weather);
  section('Materiais utilizados', report.materials);
  section('Ocorrências e observações', report.occurrences);
  if (report.signature) {
    const s = report.signature;
    section('Confirmação eletrônica registrada', `${s.authorName} - ${timestamp.format(new Date(s.at))} (Brasília)\nVersão revisada: ${s.version}\nHash do registro: ${s.contentHash}\nConfirmação acadêmica, sem certificação ICP-Brasil. O PDF é uma cópia do registro.`);
  }
  if (!report.photos.length) section('Registro fotográfico', 'Nenhuma foto anexada.');
  for (const [index, id] of report.photos.entries()) {
    const title = `Registro fotográfico - ${index + 1} de ${report.photos.length}`;
    let image;
    try {
      const photo = photos.find((item) => item.id === id && item.workId === report.workId);
      if (!photo) throw new Error('Foto ausente');
      const original = await fs.readFile(path.join(directory, 'photos', `${photo.id}.${photo.ext}`));
      image = await sharp(original, { limitInputPixels: 50_000_000 }).rotate()
        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .flatten({ background: '#ffffff' }).jpeg({ quality: 82 }).toBuffer();
    } catch {
      section(title, 'Imagem indisponível nesta exportação.');
      continue;
    }
    ensure(270);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(brand).text(title);
    const y = doc.y + 8;
    doc.image(image, pageMargins.left, y, { fit: [width, 225], align: 'left', valign: 'top' });
    doc.y = y + 237;
  }
  const range = doc.bufferedPageRange();
  const logo = doc.openImage(logoPath);
  const left = pageMargins.left;
  const right = left + width;
  for (let i = range.start; i < range.start + range.count; i += 1) {
    doc.switchToPage(i);
    doc.image(logo, left, 30, { width: 118 });
    doc.font('Helvetica-Bold').fontSize(10).fillColor(brand);
    doc.text(productName, right - doc.widthOfString(productName), 41, { lineBreak: false });
    doc.moveTo(left, 68).lineTo(right, 68).lineWidth(0.8).strokeColor(brand).stroke();

    const bottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const footerLine = doc.page.height - 51;
    const footerY = footerLine + 11;
    const pageNumber = `Página ${i - range.start + 1} de ${range.count}`;
    doc.moveTo(left, footerLine).lineTo(right, footerLine).lineWidth(0.6).strokeColor(divider).stroke();
    doc.font('Helvetica').fontSize(9).fillColor(muted);
    doc.text('Cópia para consulta', left, footerY, { lineBreak: false });
    doc.text(pageNumber, right - doc.widthOfString(pageNumber), footerY, { lineBreak: false });
    doc.page.margins.bottom = bottomMargin;
  }
  doc.end();
  return bytes;
}

module.exports = { createReportPdf };
