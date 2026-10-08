const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}
function verifyPassword(password, stored) {
  const [salt, expected] = stored.split(':');
  const actual = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
function publicUser({ passwordHash, ...user }) { return user; }
function day(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function snapshot(report) {
  const { versions, ...content } = report;
  return structuredClone(content);
}
function recordVersion(report, actor, action) {
  const at = new Date().toISOString();
  report.updatedAt = at;
  const version = { number: report.versions.length + 1, action, actorId: actor.id, actorName: actor.name, at, content: snapshot(report) };
  version.previousHash = report.versions.at(-1)?.hash ?? null;
  version.hash = crypto.createHash('sha256').update(JSON.stringify(version)).digest('hex');
  report.versions.push(version);
}
function seed() {
  const users = [
    { id: 'owner', name: 'Dono da empresa', email: 'dono@diariodeobra.com.br', role: 'owner', roleLabel: 'Dono/Empresa' },
    { id: 'operator', name: 'Responsável pela obra', email: 'responsavel@diariodeobra.com.br', role: 'operator', roleLabel: 'Responsável' },
    { id: 'client', name: 'Cliente da obra', email: 'cliente@diariodeobra.com.br', role: 'client', roleLabel: 'Cliente' },
    { id: 'client-two', name: 'Cliente de outro contrato', email: 'outro.cliente@diariodeobra.com.br', role: 'client', roleLabel: 'Cliente' },
  ].map((user) => ({ ...user, passwordHash: hashPassword('123456'), consentAt: new Date().toISOString(), guideSeen: false }));
  const works = [
    { id: 'obra-jardins', name: 'Residência Jardins', address: 'Rua dos Ipês, 120 · São Luís', contract: 'CTR-2026-001', clientIds: ['client'], operatorIds: ['operator'], startDate: day(-30), status: 'Em andamento' },
    { id: 'obra-atelie', name: 'Reforma do Ateliê', address: 'Av. dos Holandeses, 460 · São Luís', contract: 'CTR-2026-002', clientIds: ['client-two'], operatorIds: ['operator'], startDate: day(-15), status: 'Em andamento' },
  ];
  const reports = [];
  for (const [offset, activities, progress] of [
    [-2, 'Conferência das medidas e preparação das paredes para revestimento.', 32],
    [-1, 'Execução do revestimento das paredes e organização do canteiro.', 36],
  ]) {
    const report = { id: crypto.randomUUID(), workId: 'obra-jardins', date: day(offset), activities, team: '1 encarregado e 4 profissionais', weather: 'Ensolarado', materials: 'Argamassa e revestimentos', occurrences: 'Sem ocorrências.', progress, photos: [], authorId: 'operator', authorName: users[1].name, createdAt: new Date(`${day(offset)}T16:00:00-03:00`).toISOString(), status: 'pending', signature: null, versions: [] };
    recordVersion(report, users[1], 'Enviado');
    reports.push(report);
  }
  return { schemaVersion: 1, users, works, reports, uploads: [], sessions: [] };
}
function createStore(directory) {
  fs.mkdirSync(directory, { recursive: true });
  fs.mkdirSync(path.join(directory, 'photos'), { recursive: true });
  const file = path.join(directory, 'data.json');
  let data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : seed();
  function save(next) {
    const temporary = `${file}.tmp`;
    const fd = fs.openSync(temporary, 'w', 0o600);
    try { fs.writeFileSync(fd, JSON.stringify(next, null, 2)); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    fs.renameSync(temporary, file);
  }
  if (!fs.existsSync(file)) save(data);
  return {
    read: () => data,
    transaction(action) {
      const next = structuredClone(data);
      const result = action(next);
      save(next);
      data = next;
      return result;
    },
    directory,
  };
}
module.exports = { createStore, hashPassword, verifyPassword, publicUser, recordVersion, snapshot };
