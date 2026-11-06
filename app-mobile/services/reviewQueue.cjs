const { reportStatus } = require('./reportStatus.cjs');

const { normalizeText } = require('./text.cjs');

function validReviewDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function filterReviewReports(reports, works, { status, query, date }) {
  if (date && !validReviewDate(date)) return [];
  const workById = new Map(works.map((work) => [work.id, work]));
  const search = normalizeText(query);
  return reports.flatMap((report) => {
    const work = workById.get(report.workId);
    if (!work || (status !== 'all' && reportStatus(report) !== status)) return [];
    if (date && report.date !== date) return [];
    if (search && !normalizeText(`${work.name} ${work.contract}`).includes(search)) return [];
    return [{ report, work }];
  }).sort((a, b) => b.report.date.localeCompare(a.report.date));
}

module.exports = { filterReviewReports, validReviewDate };
