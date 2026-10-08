const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeEmail, validateLoginFields } = require('../services/auth');
test('normaliza o e-mail', () => {
  assert.equal(normalizeEmail('  RESPONSAVEL@DIARIODEOBRA.COM.BR '), 'responsavel@diariodeobra.com.br');
});
test('valida campos obrigatórios e formato do e-mail', () => {
  assert.deepEqual(validateLoginFields({ email: '', password: '' }), { email: 'Informe seu e-mail.', password: 'Informe sua senha.' });
  assert.ok(validateLoginFields({ email: 'aluno', password: '123456' }).email);
  assert.deepEqual(validateLoginFields({ email: 'aluno@exemplo.com', password: '123456' }), {});
});
