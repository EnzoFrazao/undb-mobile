const normalizeText = (value = '') => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const pluralize = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`;
module.exports = { normalizeText, pluralize };
