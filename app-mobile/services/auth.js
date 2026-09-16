const { mockUsers } = require('../data/mockUsers');

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

function validateLoginFields({ email = '', password = '' }) {
  const errors = {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    errors.email = 'Informe seu e-mail.';
  } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    errors.email = 'Digite um e-mail válido. Exemplo: nome@empresa.com.br.';
  }

  if (!password) {
    errors.password = 'Informe sua senha.';
  }

  return errors;
}

function authenticateUser(email, password, users = mockUsers) {
  const normalizedEmail = normalizeEmail(email);
  const user = users.find(
    (candidate) =>
      candidate.email === normalizedEmail && candidate.password === password,
  );

  if (!user) {
    return null;
  }

  return {
    email: user.email,
    name: user.name,
    role: user.role,
    roleLabel: user.roleLabel,
  };
}

module.exports = {
  authenticateUser,
  normalizeEmail,
  validateLoginFields,
};
