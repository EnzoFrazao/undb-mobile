const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createStore, hashPassword, verifyPassword, publicUser, recordVersion, snapshot } = require('./store');

const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
class ApiError extends Error {
  constructor(status, message, fields) { super(message); this.status = status; this.fields = fields; }
}
const check = (condition, status, message, fields) => { if (!condition) throw new ApiError(status, message, fields); };
const text = (value, max = 5000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const canAccess = (user, work) => user.role === 'owner' || (user.role === 'client' ? work.clientIds : work.operatorIds).includes(user.id);
function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function reportFields(body, data, workId) {
  const date = text(body.date, 10);
  const activities = text(body.activities);
  const progress = typeof body.progress === 'number' ? body.progress : NaN;
  const photos = Array.isArray(body.photos) ? [...new Set(body.photos)] : [];
  check(validDate(date), 400, 'Informe uma data válida.', { date: 'Use uma data válida (AAAA-MM-DD).' });
  check(activities.length >= 5, 400, 'Descreva as atividades realizadas.', { activities: 'Descreva as atividades com pelo menos 5 caracteres.' });
  check(Number.isFinite(progress) && progress >= 0 && progress <= 100, 400, 'O avanço deve estar entre 0 e 100%.');
  check(photos.length <= 10 && photos.every((id) => data.uploads.some((photo) => photo.id === id && photo.workId === workId)), 400, 'Fotos inválidas ou de outra obra.');
  return { date, activities, progress, team: text(body.team, 500), materials: text(body.materials, 1500), weather: text(body.weather, 100), occurrences: text(body.occurrences, 2000), photos };
}
async function readBody(req) {
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    check(size <= 12 * 1024 * 1024, 413, 'Arquivo muito grande. Use uma foto de até 8 MB.');
    chunks.push(chunk);
  }
  let body;
  try { body = JSON.parse(Buffer.concat(chunks).toString() || '{}'); }
  catch { throw new ApiError(400, 'JSON inválido.'); }
  check(body && typeof body === 'object' && !Array.isArray(body), 400, 'Envie um objeto JSON válido.');
  return body;
}

function createApp({ directory = process.env.DATA_DIR || path.join(__dirname, 'storage'), secure = false } = {}) {
  const store = createStore(directory);
  const attempts = new Map();
  const origins = (process.env.CORS_ORIGINS || 'http://localhost:8081,http://127.0.0.1:8081,http://localhost:4173,http://127.0.0.1:4173').split(',');
  const handler = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (secure) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    const origin = req.headers.origin;
    if (origins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    const send = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(body)); };
    try {
      if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
      if (origin) check(origins.includes(origin), 403, 'Origem não autorizada.');
      const url = new URL(req.url, 'http://localhost');
      const route = url.pathname;
      const method = req.method;
      if (route === '/api/health' && method === 'GET') return send(200, { status: 'ok' });
      if (route === '/api/register' && method === 'POST') {
        const body = await readBody(req);
        const name = text(body.name, 100);
        const email = text(body.email, 254).toLowerCase();
        const password = body.password;
        check(name && /^\S+@\S+\.\S+$/.test(email), 400, 'Informe nome e e-mail válidos.');
        check(typeof password === 'string' && password.length >= 6 && password.length <= 128 && password === body.passwordConfirmation, 400, 'Confira a senha e a confirmação (6 a 128 caracteres).');
        check(body.consent === true, 400, 'É necessário consentir com o tratamento dos dados.');
        const user = { id: crypto.randomUUID(), name, email, role: 'client', roleLabel: 'Cliente', passwordHash: hashPassword(password), consentAt: new Date().toISOString(), guideSeen: false };
        store.transaction((data) => {
          check(!data.users.some((u) => u.email === email), 409, 'Este e-mail já possui cadastro.', { email: 'Este e-mail já possui cadastro. Faça login.' });
          data.users.push(user);
        });
        return send(201, { user: publicUser(user) });
      }
      if (route === '/api/login' && method === 'POST') {
        const key = req.socket.remoteAddress;
        let attempt = attempts.get(key);
        if (!attempt || attempt.until < Date.now()) { attempt = { count: 0, until: Date.now() + 60000 }; attempts.set(key, attempt); }
        check(attempt.count < 20, 429, 'Muitas tentativas. Aguarde um minuto.');
        attempt.count++;
        if (attempts.size > 1000) for (const [ip, value] of attempts) if (value.until < Date.now()) attempts.delete(ip);
        const body = await readBody(req);
        check(typeof body.password === 'string' && body.password.length <= 128, 401, 'E-mail ou senha não conferem.');
        const user = store.read().users.find((u) => u.email === text(body.email, 254).toLowerCase());
        check(user && verifyPassword(body.password, user.passwordHash), 401, 'E-mail ou senha não conferem.');
        const token = crypto.randomBytes(32).toString('hex');
        store.transaction((data) => {
          data.sessions = data.sessions.filter((s) => s.expiresAt > Date.now());
          data.sessions.push({ hash: digest(token), userId: user.id, expiresAt: Date.now() + 8 * 3600000 });
        });
        return send(200, { token, user: publicUser(user) });
      }
      const token = req.headers.authorization?.replace(/^Bearer /, '') || '';
      const session = store.read().sessions.find((s) => s.hash === digest(token) && s.expiresAt > Date.now());
      check(session, 401, 'Sua sessão expirou. Faça login novamente.');
      const user = store.read().users.find((u) => u.id === session.userId);
      check(user, 401, 'Usuário não encontrado.');
      const workFor = (id, data = store.read()) => {
        const work = data.works.find((w) => w.id === id);
        check(work && canAccess(user, work), 404, 'Obra não encontrada.');
        return work;
      };
      const reportFor = (id, data = store.read()) => {
        const report = data.reports.find((r) => r.id === id);
        check(report, 404, 'Relatório não encontrado.'); workFor(report.workId, data); return report;
      };
      if (route === '/api/logout' && method === 'POST') {
        store.transaction((data) => { data.sessions = data.sessions.filter((s) => s.hash !== session.hash); });
        return send(200, { ok: true });
      }
      if (route === '/api/guide' && method === 'POST') {
        store.transaction((data) => { data.users.find((u) => u.id === user.id).guideSeen = true; });
        return send(200, { ok: true });
      }
      if (route === '/api/state' && method === 'GET') {
        const data = store.read();
        const works = data.works.filter((w) => canAccess(user, w));
        const reports = data.reports.filter((r) => works.some((w) => w.id === r.workId)).map((r) => ({ ...r, versions: r.versions.map(({ content, ...v }) => v) }));
        return send(200, { user: publicUser(user), works, reports, users: user.role === 'owner' ? data.users.map(publicUser) : [], serverTime: new Date().toISOString() });
      }
      if (route === '/api/operators' && method === 'POST') {
        check(user.role === 'owner', 403, 'Somente o dono pode criar responsáveis.');
        const body = await readBody(req);
        const name = text(body.name, 100); const email = text(body.email, 254).toLowerCase();
        check(name && /^\S+@\S+\.\S+$/.test(email) && typeof body.password === 'string' && body.password.length >= 6 && body.password.length <= 128, 400, 'Confira nome, e-mail e senha.');
        const operator = { id: crypto.randomUUID(), name, email, role: 'operator', roleLabel: 'Responsável', passwordHash: hashPassword(body.password), guideSeen: false, consentAt: null };
        store.transaction((data) => { check(!data.users.some((u) => u.email === email), 409, 'E-mail já cadastrado.'); data.users.push(operator); });
        return send(201, { user: publicUser(operator) });
      }
      if (route === '/api/consent' && method === 'POST') {
        const body = await readBody(req); check(body.consent === true, 400, 'Confirme o consentimento.');
        store.transaction((data) => { data.users.find((u) => u.id === user.id).consentAt = new Date().toISOString(); });
        return send(200, { ok: true });
      }
      if (route === '/api/works' && method === 'POST') {
        check(user.role === 'owner', 403, 'Somente o dono pode cadastrar obras.');
        const body = await readBody(req);
        const work = { id: crypto.randomUUID(), name: text(body.name, 120), address: text(body.address, 300), contract: text(body.contract, 80), startDate: text(body.startDate, 10), status: 'Em andamento', clientIds: Array.isArray(body.clientIds) ? [...new Set(body.clientIds)] : [], operatorIds: Array.isArray(body.operatorIds) ? [...new Set(body.operatorIds)] : [] };
        store.transaction((data) => {
          check(work.name && work.address && work.contract && validDate(work.startDate), 400, 'Preencha nome, endereço, contrato e data de início.');
          check(!data.works.some((w) => w.contract.toLowerCase() === work.contract.toLowerCase()), 409, 'Número de contrato já cadastrado.');
          check(work.clientIds.length > 0 && work.operatorIds.length > 0 && work.clientIds.every((id) => data.users.some((u) => u.id === id && u.role === 'client')) && work.operatorIds.every((id) => data.users.some((u) => u.id === id && u.role === 'operator')), 400, 'Selecione ao menos um cliente e um responsável válidos.');
          data.works.push(work);
        });
        return send(201, { work });
      }
      const workMatch = route.match(/^\/api\/works\/([^/]+)$/);
      if (workMatch && method === 'PATCH') {
        check(user.role === 'owner', 403, 'Somente o dono pode alterar vínculos.');
        const body = await readBody(req);
        store.transaction((data) => {
          const work = workFor(workMatch[1], data);
          for (const [field, role] of [['clientIds', 'client'], ['operatorIds', 'operator']]) {
            if (body[field] !== undefined) {
              check(Array.isArray(body[field]) && body[field].length > 0 && body[field].every((id) => data.users.some((u) => u.id === id && u.role === role)), 400, 'Vínculos inválidos.');
              work[field] = [...new Set(body[field])];
            }
          }
        });
        return send(200, { ok: true });
      }
      if (route === '/api/photos' && method === 'POST') {
        check(user.role !== 'client', 403, 'Clientes não podem enviar fotos.');
        const body = await readBody(req); workFor(body.workId);
        check(body.consent === true, 400, 'Confirme a autorização de uso da imagem.');
        check(typeof body.base64 === 'string' && /^[A-Za-z0-9+/]+={0,2}$/.test(body.base64), 400, 'Foto inválida.');
        const bytes = Buffer.from(body.base64, 'base64');
        check(bytes.length <= 8 * 1024 * 1024, 413, 'Foto maior que 8 MB.');
        let ext;
        if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) ext = 'jpg';
        else if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ext = 'png';
        else if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') ext = 'webp';
        check(ext, 400, 'Use uma imagem JPEG, PNG ou WebP.');
        const photo = { id: crypto.randomUUID(), workId: body.workId, authorId: user.id, at: new Date().toISOString(), ext, hash: digest(bytes) };
        const file = path.join(directory, 'photos', `${photo.id}.${ext}`);
        fs.writeFileSync(file, bytes, { mode: 0o600 });
        try { store.transaction((data) => data.uploads.push(photo)); } catch (error) { fs.unlinkSync(file); throw error; }
        return send(201, { photo });
      }
      const photoMatch = route.match(/^\/api\/photos\/([^/]+)$/);
      if (photoMatch && method === 'GET') {
        const photo = store.read().uploads.find((p) => p.id === photoMatch[1]);
        check(photo, 404, 'Foto não encontrada.'); workFor(photo.workId);
        const bytes = fs.readFileSync(path.join(directory, 'photos', `${photo.id}.${photo.ext}`));
        return send(200, { uri: `data:image/${photo.ext === 'jpg' ? 'jpeg' : photo.ext};base64,${bytes.toString('base64')}` });
      }
      if (route === '/api/reports' && method === 'POST') {
        check(['operator', 'owner'].includes(user.role), 403, 'Clientes não podem criar relatórios.');
        const body = await readBody(req);
        let report;
        store.transaction((data) => {
          workFor(body.workId, data);
          const fields = reportFields(body, data, body.workId);
          check(!data.reports.some((r) => r.workId === body.workId && r.date === fields.date), 409, 'Esta obra já possui um relatório nessa data.');
          report = { id: crypto.randomUUID(), workId: body.workId, ...fields, authorId: user.id, authorName: user.name, createdAt: new Date().toISOString(), status: 'pending', signature: null, versions: [] };
          recordVersion(report, user, 'Enviado'); data.reports.push(report);
        });
        return send(201, { report });
      }
      const reportMatch = route.match(/^\/api\/reports\/([^/]+)$/);
      if (reportMatch && method === 'GET') return send(200, { report: reportFor(reportMatch[1]) });
      if (reportMatch && method === 'PATCH') {
        check(user.role === 'owner', 403, 'Somente o dono pode editar relatórios enviados.');
        const body = await readBody(req);
        let report;
        store.transaction((data) => {
          report = reportFor(reportMatch[1], data);
          check(!report.signature, 409, 'Relatório assinado: edição bloqueada.');
          check(body.version === report.versions.length, 409, 'Este relatório mudou. Atualize a tela antes de editar.');
          const fields = reportFields(body, data, report.workId);
          check(!data.reports.some((r) => r.id !== report.id && r.workId === report.workId && r.date === fields.date), 409, 'Já existe relatório nesta data.');
          Object.assign(report, fields); recordVersion(report, user, 'Editado');
        });
        return send(200, { report });
      }
      const signMatch = route.match(/^\/api\/reports\/([^/]+)\/sign$/);
      if (signMatch && method === 'POST') {
        check(user.role === 'owner', 403, 'Somente o dono pode assinar relatórios.');
        const body = await readBody(req);
        check(body.confirm === true, 400, 'Confirme a assinatura e o bloqueio da edição.');
        let report;
        store.transaction((data) => {
          report = reportFor(signMatch[1], data);
          check(!report.signature, 409, 'Relatório já assinado.');
          check(body.version === report.versions.length, 409, 'O relatório mudou. Revise a versão atual antes de assinar.');
          const content = snapshot(report);
          const photoHashes = report.photos.map((id) => data.uploads.find((p) => p.id === id).hash);
          report.signature = { authorId: user.id, authorName: user.name, at: new Date().toISOString(), version: report.versions.length, contentHash: digest(JSON.stringify({ content, photoHashes })), type: 'Confirmação eletrônica acadêmica' };
          report.status = 'signed'; recordVersion(report, user, 'Assinado');
        });
        return send(200, { report });
      }
      send(404, { message: 'Rota não encontrada.' });
    } catch (error) {
      if (!error.status) console.error('Falha na API:', error.message);
      if (!res.headersSent) send(error.status || 500, { message: error.status ? error.message : 'Não foi possível concluir a operação.', fields: error.fields });
    }
  };
  const server = secure ? https.createServer({ key: fs.readFileSync(process.env.TLS_KEY), cert: fs.readFileSync(process.env.TLS_CERT) }, handler) : http.createServer(handler);
  server.requestTimeout = 30000;
  return { server, store };
}
if (require.main === module) {
  const secure = Boolean(process.env.TLS_KEY && process.env.TLS_CERT);
  const { server } = createApp({ secure });
  server.listen(Number(process.env.PORT || 3001), process.env.HOST || '0.0.0.0', () => console.log(`Diário de Obra API: ${secure ? 'https' : 'http'}://localhost:${process.env.PORT || 3001}`));
}
module.exports = { createApp };
