function maskDate(value) {
  return (value.match(/\d/g) || []).slice(0, 8).join('').replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2');
}

function parseDisplayDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match || Number(match[3]) < 2000) return null;
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  const date = new Date(`${iso}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : null;
}

function toDisplayDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

function parsePercent(value) {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const percent = Number(normalized);
  return percent <= 100 ? percent : null;
}

module.exports = { maskDate, parseDisplayDate, toDisplayDate, parsePercent };
