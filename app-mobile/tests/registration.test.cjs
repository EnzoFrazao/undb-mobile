const test = require('node:test');
const assert = require('node:assert/strict');

const { mockUsers } = require('../data/mockUsers');
const {
  createClientUser,
  normalizeName,
  validateRegistrationFields,
} = require('../services/registration');

test('normaliza o nome e cria sempre um usuário Cliente', () => {
  assert.equal(normalizeName('  Maria   da Silva  '), 'Maria da Silva');
  assert.deepEqual(
    createClientUser({
      name: '  Maria   da Silva  ',
      email: '  MARIA@EMAIL.COM  ',
      password: 'abcdef',
    }),
    {
      email: 'maria@email.com',
      password: 'abcdef',
      name: 'Maria da Silva',
      role: 'client',
      roleLabel: 'Cliente',
    },
  );
});

test('valida campos obrigatórios, tamanho e confirmação da senha', () => {
  assert.deepEqual(
    validateRegistrationFields({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    }),
    {
      name: 'Informe seu nome.',
      email: 'Informe seu e-mail.',
      password: 'Informe uma senha.',
      passwordConfirmation: 'Confirme sua senha.',
    },
  );

  assert.deepEqual(
    validateRegistrationFields({
      name: 'Maria',
      email: 'maria@email.com',
      password: '123',
      passwordConfirmation: '456',
    }),
    {
      password: 'A senha deve ter pelo menos 6 caracteres.',
      passwordConfirmation: 'As senhas não conferem.',
    },
  );
});

test('recusa e-mail que já possui cadastro', () => {
  assert.deepEqual(
    validateRegistrationFields(
      {
        name: 'Outro Cliente',
        email: ' CLIENTE@DIARIODEOBRA.COM.BR ',
        password: '123456',
        passwordConfirmation: '123456',
      },
      mockUsers,
    ),
    {
      email: 'Este e-mail já possui cadastro. Faça login para continuar.',
    },
  );
});
