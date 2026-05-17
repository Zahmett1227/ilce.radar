/**
 * Groq analizi — yalnızca kendi backend endpoint'imize istek atar.
 */
export async function analyzeWithGroq(prompt, options = {}) {
  const body = { prompt }
  if (options.cacheKey) {
    body.cacheKey = options.cacheKey
  }

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('Sunucudan geçersiz yanıt alındı.')
  }

  if (!data.ok) {
    throw new Error(data.error ?? 'Analiz başarısız oldu.')
  }

  return data.result
}

export function buildInsightCacheKey({ districts, answers, questions, selectedRegionLabels }) {
  const districtIds = districts.map((d) => d.district_id ?? d.full_name).join('|')
  const answerKeys = questions.map((q) => `${q.key}:${answers[q.key] ?? ''}`).join(',')
  const regions = (selectedRegionLabels ?? []).join(',')
  return `insight::${districtIds}::${answerKeys}::${regions}`
}
