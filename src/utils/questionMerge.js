/**
 * metric_config sheet satırları ile sabit ikonları birleştirir.
 * @param {Array<Record<string, unknown>>} rows
 * @param {Record<string, unknown>} iconByKey
 * @returns {Array<Record<string, unknown>> | null}
 */
export function mergeMetricQuestions(rows, iconByKey) {
  if (!Array.isArray(rows) || rows.length === 0) return null
  const out = []
  for (const row of rows) {
    const key = row.key
    if (!key || typeof key !== 'string') continue
    const icon = iconByKey[key]
    if (!icon) continue
    const title = typeof row.title === 'string' ? row.title : ''
    const question = typeof row.question === 'string' ? row.question : ''
    const description = typeof row.description === 'string' ? row.description : ''
    const scoreColumn =
      typeof row.scoreColumn === 'string' ? row.scoreColumn : ''
    if (!title || !question || !scoreColumn) continue
    out.push({ key, title, question, description, scoreColumn, icon })
  }
  return out.length > 0 ? out : null
}
