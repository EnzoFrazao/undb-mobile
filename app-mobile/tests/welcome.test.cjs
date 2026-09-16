const test = require('node:test');
const assert = require('node:assert/strict');

const { getWelcomeMessage } = require('../services/welcome');

test('personaliza a mensagem de boas-vindas para cada perfil', () => {
  assert.equal(
    getWelcomeMessage('owner'),
    'Você entrou como Dono/Empresa. Aqui você poderá acompanhar as obras e os registros da equipe.',
  );
  assert.equal(
    getWelcomeMessage('operator'),
    'Você entrou como Responsável. Aqui você poderá registrar o andamento diário das obras.',
  );
  assert.equal(
    getWelcomeMessage('client'),
    'Você entrou como Cliente. Aqui você poderá acompanhar a evolução da sua obra.',
  );
});

test('mantém uma mensagem segura para um perfil desconhecido', () => {
  assert.equal(
    getWelcomeMessage('unknown'),
    'Seu acesso foi confirmado. Você já pode continuar no Diário de Obra.',
  );
});
