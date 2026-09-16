const test = require('node:test');
const assert = require('node:assert/strict');

const {
  authenticateUser,
  normalizeEmail,
  validateLoginFields,
} = require('../services/auth');

test('normaliza o e-mail antes de autenticar', () => {
  assert.equal(
    normalizeEmail('  RESPONSAVEL@DIARIODEOBRA.COM.BR '),
    'responsavel@diariodeobra.com.br',
  );
});

test('autentica a credencial fictícia sem devolver a senha', () => {
  assert.deepEqual(
    authenticateUser('RESPONSAVEL@DIARIODEOBRA.COM.BR', '123456'),
    {
      email: 'responsavel@diariodeobra.com.br',
      name: 'Responsável pela obra',
      role: 'operator',
      roleLabel: 'Responsável',
    },
  );
});

test('diferencia dono, responsável e cliente pela credencial', () => {
  const owner = authenticateUser('dono@diariodeobra.com.br', '123456');
  const operator = authenticateUser(
    'responsavel@diariodeobra.com.br',
    '123456',
  );
  const client = authenticateUser('cliente@diariodeobra.com.br', '123456');

  assert.deepEqual([owner.role, operator.role, client.role], [
    'owner',
    'operator',
    'client',
  ]);
});

test('recusa uma senha incorreta', () => {
  assert.equal(
    authenticateUser('cliente@diariodeobra.com.br', 'incorreta'),
    null,
  );
});

test('autentica um cliente cadastrado durante a execução', () => {
  const registeredUsers = [
    {
      email: 'novo.cliente@email.com',
      password: 'abcdef',
      name: 'Novo Cliente',
      role: 'client',
      roleLabel: 'Cliente',
    },
  ];

  assert.deepEqual(
    authenticateUser('novo.cliente@email.com', 'abcdef', registeredUsers),
    {
      email: 'novo.cliente@email.com',
      name: 'Novo Cliente',
      role: 'client',
      roleLabel: 'Cliente',
    },
  );
});

test('valida campos obrigatórios e formato do e-mail', () => {
  assert.deepEqual(validateLoginFields({ email: '', password: '' }), {
    email: 'Informe seu e-mail.',
    password: 'Informe sua senha.',
  });

  assert.deepEqual(validateLoginFields({ email: 'aluno', password: '123456' }), {
    email: 'Digite um e-mail válido. Exemplo: nome@empresa.com.br.',
  });
});
