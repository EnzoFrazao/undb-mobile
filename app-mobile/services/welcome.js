const welcomeMessages = {
  owner:
    'Você entrou como Dono/Empresa. Aqui você poderá acompanhar as obras e os registros da equipe.',
  operator:
    'Você entrou como Responsável. Aqui você poderá registrar o andamento diário das obras.',
  client:
    'Você entrou como Cliente. Aqui você poderá acompanhar a evolução da sua obra.',
};

function getWelcomeMessage(role) {
  return (
    welcomeMessages[role] ??
    'Seu acesso foi confirmado. Você já pode continuar no Diário de Obra.'
  );
}

module.exports = { getWelcomeMessage };
