const { normalizeEmail } = require('./auth');

function normalizeName(name = '') {
  return name.trim().replace(/\s+/g, ' ');
}

function validateRegistrationFields(
  { name = '', email = '', password = '', passwordConfirmation = '' },
  users = [],
) {
  const errors = {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizeName(name)) {
    errors.name = 'Informe seu nome.';
  }

  if (!normalizedEmail) {
    errors.email = 'Informe seu e-mail.';
  } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    errors.email = 'Digite um e-mail válido. Exemplo: nome@empresa.com.br.';
  } else if (
    users.some((user) => normalizeEmail(user.email) === normalizedEmail)
  ) {
    errors.email = 'Este e-mail já possui cadastro. Faça login para continuar.';
  }

  if (!password) {
    errors.password = 'Informe uma senha.';
  } else if (password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.';
  }

  if (!passwordConfirmation) {
    errors.passwordConfirmation = 'Confirme sua senha.';
  } else if (passwordConfirmation !== password) {
    errors.passwordConfirmation = 'As senhas não conferem.';
  }

  return errors;
}

function createClientUser({ name, email, password }) {
  return {
    email: normalizeEmail(email),
    password,
    name: normalizeName(name),
    role: 'client',
    roleLabel: 'Cliente',
  };
}

module.exports = {
  createClientUser,
  normalizeName,
  validateRegistrationFields,
};
