function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}
function validateLoginFields({ email = '', password = '' }) {
  const errors = {};
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) errors.email = 'Informe seu e-mail.';
  else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) errors.email = 'Digite um e-mail válido. Exemplo: nome@empresa.com.br.';
  if (!password) errors.password = 'Informe sua senha.';
  return errors;
}
module.exports = { normalizeEmail, validateLoginFields };
