const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createApp } = require('../server');
const { createStore } = require('../store');

test('devolução, reenvio, assinatura e avisos respeitam autoria, versões e vínculos', async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'diario-review-test-'));
  const { server } = createApp({ directory });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}/api`;
  async function api(route, token, method = 'GET', body) {
    const response = await fetch(base + route, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, data: await response.json() };
  }
  async function login(email) {
    const result = await api('/login', null, 'POST', { email, password: '123456' });
    assert.equal(result.status, 200);
    return result.data.token;
  }
  const owner = await login('dono@diariodeobra.com.br');
  const author = await login('responsavel@diariodeobra.com.br');
  const client = await login('cliente@diariodeobra.com.br');
  const unrelated = await login('outro.cliente@diariodeobra.com.br');
  const colleagueUser = await api('/operators', owner, 'POST', { name: 'Colega de teste', email: 'colega@example.test', password: '123456' });
  const colleague = await login('colega@example.test');
  assert.equal((await api('/works/obra-jardins', owner, 'PATCH', { operatorIds: ['operator', colleagueUser.data.user.id] })).status, 200);
  const fields = { workId: 'obra-jardins', date: '2026-05-01', activities: 'Preparo da fundação.', progress: 30, photos: [] };
  const submitted = await api('/reports', author, 'POST', fields);
  assert.equal(submitted.status, 201);
  const id = submitted.data.report.id;
  const report = `/reports/${id}`;
  async function notices(token) {
    const state = await api('/state', token);
    assert.equal(state.status, 200);
    return state.data.notices.filter((n) => n.reportId === id);
  }
  assert.deepEqual((await notices(owner)).map((n) => n.type), ['submitted']);
  assert.deepEqual((await notices(client)).map((n) => n.type), ['submitted']);
  assert.deepEqual(await notices(unrelated), []);
  assert.equal((await api(report + '/resubmit', author, 'POST', { ...fields, version: 1 })).status, 409);
  const reason = 'Confirme a metragem antes de reenviar.';
  assert.equal((await api(report + '/return', author, 'POST', { reason, version: 1 })).status, 403);
  assert.equal((await api(report + '/return', owner, 'POST', { reason: '  ', version: 1 })).status, 400);
  assert.equal((await api(report + '/return', owner, 'POST', { reason, version: 0 })).status, 409);
  const returned = await api(report + '/return', owner, 'POST', { reason, version: 1 });
  assert.equal(returned.status, 200);
  assert.equal(returned.data.report.status, 'returned');
  assert.equal(returned.data.report.versions[1].previousHash, submitted.data.report.versions[0].hash);
  assert.equal((await api(report, author)).data.report.correction.reason, reason);
  assert.equal((await api(report + '/sign', owner, 'POST', { confirm: true, version: 2 })).status, 409);
  assert.equal((await api(report, author, 'PATCH', { ...fields, version: 2 })).status, 409);
  for (const token of [client, colleague]) {
    const detail = await api(report, token);
    assert.equal(detail.status, 200);
    assert.equal(detail.data.report.status, 'returned');
    assert.equal(detail.data.report.correction, undefined);
    assert.equal(detail.data.report.versions[1].content.correction, undefined);
    const summary = (await api('/state', token)).data.reports.find((r) => r.id === id);
    assert.equal(summary.correction, undefined);
  }
  assert.equal((await api(report, unrelated)).status, 404);
  const pdf = await fetch(base + report + '/pdf?version=2', { headers: { Authorization: `Bearer ${client}` } });
  assert.equal(pdf.status, 200);
  const bytes = Buffer.from(await pdf.arrayBuffer());
  assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
  if (process.env.RDO_WORKFLOW_PDF_PATH) fs.writeFileSync(process.env.RDO_WORKFLOW_PDF_PATH, bytes);
  const [notice] = await notices(author);
  assert.equal(notice.type, 'returned');
  assert.equal(notice.readAt, null);
  assert.equal((await api(`/notices/${notice.id}/read`, client, 'POST')).status, 404);
  assert.equal((await api(`/notices/${notice.id}/read`, author, 'POST')).status, 200);
  assert.ok((await notices(author))[0].readAt);
  assert.ok(createStore(directory).read().notices.find((n) => n.id === notice.id).readAt);
  assert.equal((await api(report + '/resubmit', colleague, 'POST', { ...fields, version: 2 })).status, 403);
  assert.equal((await api(report + '/resubmit', author, 'POST', { ...fields, version: 1 })).status, 409);
  assert.equal((await api(report + '/resubmit', author, 'POST', { ...fields, date: '2026-05-02', version: 2 })).status, 400);
  const resent = await api(report + '/resubmit', author, 'POST', { ...fields, activities: 'Fundação com metragem revisada.', version: 2 });
  assert.equal(resent.status, 200);
  assert.equal(resent.data.report.id, id);
  assert.equal(resent.data.report.status, 'pending');
  assert.equal(resent.data.report.correction, undefined);
  assert.equal(resent.data.report.versions[1].content.correction.reason, reason);
  assert.equal(resent.data.report.versions[2].action, 'Reenviado');
  assert.deepEqual((await notices(owner)).map((n) => n.type), ['resubmitted', 'submitted']);
  const signed = await api(report + '/sign', owner, 'POST', { confirm: true, version: 3 });
  assert.equal(signed.status, 200);
  assert.equal((await api(report + '/return', owner, 'POST', { reason, version: 4 })).status, 409);
  assert.equal((await api(report + '/resubmit', author, 'POST', { ...fields, version: 4 })).status, 409);
  assert.equal((await api(report, author, 'PATCH', { ...fields, version: 4 })).status, 409);
  assert.deepEqual((await notices(client)).map((n) => n.type), ['signed', 'resubmitted', 'submitted']);
  const [clientNotice] = await notices(client);
  assert.equal((await api('/works/obra-jardins', owner, 'PATCH', { clientIds: ['client-two'] })).status, 200);
  assert.deepEqual(await notices(client), []);
  assert.deepEqual(await notices(unrelated), []);
  assert.equal((await api(`/notices/${clientNotice.id}/read`, client, 'POST')).status, 404);

  const another = await api('/reports', author, 'POST', { ...fields, date: '2026-05-03' });
  assert.equal(another.status, 201);
  const anotherRoute = `/reports/${another.data.report.id}`;
  const editBody = { ...fields, date: '2026-05-03', activities: 'Metragem ajustada pelo autor.', version: 1 };
  assert.equal((await api(anotherRoute, colleague, 'PATCH', editBody)).status, 403);
  assert.equal((await api(anotherRoute, unrelated, 'PATCH', editBody)).status, 403);
  assert.equal((await api(anotherRoute, author, 'PATCH', { ...editBody, date: '2026-05-04' })).status, 400);
  const edited = await api(anotherRoute, author, 'PATCH', editBody);
  assert.equal(edited.status, 200);
  assert.equal(edited.data.report.id, another.data.report.id);
  assert.equal(edited.data.report.status, 'pending');
  assert.equal(edited.data.report.versions[0].content.activities, fields.activities);
  assert.equal(edited.data.report.versions[1].actorId, 'operator');
  assert.equal((await api('/state', owner)).data.notices[0].type, 'updated');
  assert.equal((await api(anotherRoute + '/sign', owner, 'POST', { confirm: true, version: 1 })).status, 409);
  assert.equal((await api(anotherRoute + '/return', owner, 'POST', { reason, version: 2 })).status, 200);
  assert.equal((await api('/works/obra-jardins', owner, 'PATCH', { operatorIds: [colleagueUser.data.user.id] })).status, 200);
  assert.equal((await api(anotherRoute + '/resubmit', author, 'POST', { ...fields, date: '2026-05-03', version: 3 })).status, 404);
  assert.equal((await api(anotherRoute, author, 'PATCH', { ...editBody, version: 3 })).status, 404);
  const ownerResolved = await api(anotherRoute, owner, 'PATCH', { ...fields, date: '2026-05-03', version: 3 });
  assert.equal(ownerResolved.status, 200);
  assert.equal(ownerResolved.data.report.status, 'pending');
  assert.equal(ownerResolved.data.report.versions[3].action, 'Correção resolvida pelo dono');
});
