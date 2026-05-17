/**
 * Groq analizi — yalnızca kendi backend endpoint'imize istek atar.
 * API anahtarı asla frontend'e girmez.
 *
 * @example
 * import { analyzeWithGroq } from '../services/aiService.js'
 * import { buildInsightPrompt } from '../utils/aiPrompt.js'
 *
 * const prompt = buildInsightPrompt({ profile, answers, questions, districts, selectedRegionLabels })
 * const insight = await analyzeWithGroq(prompt)
 */
export async function analyzeWithGroq(prompt) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
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
