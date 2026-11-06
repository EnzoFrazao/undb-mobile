function normalize(value) {
  if (Array.isArray(value)) return JSON.stringify([...value].sort());
  if (value == null) return '';
  return typeof value === 'string' ? value.trim() : value;
}

function isDirty(initial, current) {
  const keys = new Set([...Object.keys(initial), ...Object.keys(current)]);
  return [...keys].some((key) => normalize(initial[key]) !== normalize(current[key]));
}

module.exports = { isDirty };
