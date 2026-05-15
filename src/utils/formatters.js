function isEmpty(value) {
  return value === null || value === undefined || value === ''
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function formatTRY(value) {
  if (isEmpty(value)) return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function formatPopulation(value) {
  if (isEmpty(value)) return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 0,
  }).format(n)
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function formatScore(value) {
  if (isEmpty(value)) return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })
}

/**
 * m² birim fiyatı (TRY) — etiket metninde /m² kullanın.
 * @param {unknown} value
 * @returns {string}
 */
export function formatTRYPerM2(value) {
  if (isEmpty(value)) return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  const s = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)
  return `${s}/m²`
}
