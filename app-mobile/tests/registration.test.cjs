const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeName,
  validateRegistrationFields,
} = require('../services/registration');

test('normaliza o nome', () => {
  assert.equal(normalizeName('  Maria   da Silva  '), 'Maria da Silva');
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
      [{ email: 'cliente@diariodeobra.com.br' }],
    ),
    {
      email: 'Este e-mail já possui cadastro. Faça login para continuar.',
    },
  );
});
