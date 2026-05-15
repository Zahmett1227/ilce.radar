import {
  districtMatchesSelectedRegions,
  normalizeSelectedRegions,
} from './regions.js'

/**
 * @param {unknown} value
 * @param {number} [fallback=0]
 * @returns {number}
 */
export function safeNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/**
 * @param {Record<string, unknown>[]} districts
 * @returns {{ p33: number; p67: number }}
 */
export function computePopulationThresholds(districts) {
  const pops = districts
    .map((d) => safeNumber(d.population_2024, 0))
    .filter((n) => n > 0)
    .sort((a, b) => a - b)
  if (pops.length === 0) return { p33: 0, p67: 0 }
  const i33 = Math.floor((pops.length - 1) * 0.33)
  const i67 = Math.floor((pops.length - 1) * 0.67)
  return { p33: pops[i33], p67: pops[i67] }
}

/**
 * @param {Record<string, unknown>[]} districts
 * @param {{ region?: string | null; populationPref?: string | null }} prefs
 * @param {Record<string, string>} ilToBolge il adı -> bölge
 */
export function filterDistrictsByPreferences(districts, prefs, ilToBolge) {
  let list = districts
  const region = prefs.region
  if (region && region !== 'any') {
    list = list.filter((d) => {
      const il = d.il
      if (il == null || il === '') return true
      const key = String(il).trim()
      const b = ilToBolge[key]
      if (!b) return true
      return b === region
    })
  }

  const popPref = prefs.populationPref
  if (!popPref || popPref === 'any') return list

  const { p33, p67 } = computePopulationThresholds(list.length > 0 ? list : districts)

  if (popPref === 'small') {
    return list.filter((d) => safeNumber(d.population_2024, Infinity) <= p33)
  }
  if (popPref === 'large') {
    return list.filter((d) => safeNumber(d.population_2024, 0) >= p67)
  }

  return list
}

/**
 * Filtre sonucu çok dar kalırsa gevşetme: önce nüfus filtresini, gerekirse tamamını kullan.
 * @returns {{ districts: Record<string, unknown>[]; relaxed: boolean; note: string | null }}
 */
export function resolveDistrictsForScoring(allDistricts, prefs, ilToBolge) {
  let relaxed = false
  let note = null

  let filtered = filterDistrictsByPreferences(allDistricts, prefs, ilToBolge)

  if (filtered.length < 5 && prefs.populationPref && prefs.populationPref !== 'any') {
    filtered = filterDistrictsByPreferences(
      allDistricts,
      { region: prefs.region, populationPref: 'any' },
      ilToBolge,
    )
    relaxed = true
    note = 'Nüfus tercihi çok seçici olduğu için bu adımda gevşetildi; sıralama tüm nüfus bandında yapıldı.'
  }

  if (filtered.length < 5 && prefs.region && prefs.region !== 'any') {
    filtered = allDistricts
    relaxed = true
    note =
      'Bölge ve nüfus filtresiyle yeterli ilçe kalmadığı için sıralama tüm Türkiye veri seti üzerinden yapıldı.'
  }

  return { districts: filtered, relaxed, note }
}

/**
 * @param {Record<string, unknown>} district
 * @param {Record<string, number | null>} answers
 * @param {{ key: string; scoreColumn: string }[]} questions
 * @returns {number}
 */
export function calculateDistrictScore(district, answers, questions) {
  let weightedSum = 0
  let totalWeight = 0

  for (const q of questions) {
    const w = answers[q.key]
    const weight = typeof w === 'number' && w >= 1 && w <= 5 ? w : 0
    if (weight === 0) continue
    const score = safeNumber(district[q.scoreColumn], 0)
    weightedSum += score * weight
    totalWeight += weight
  }

  if (totalWeight === 0) return 0
  return (weightedSum / totalWeight) * 5
}

/**
 * @param {Record<string, unknown>[]} districts
 * @param {Record<string, number | null>} answers
 * @param {{ key: string; scoreColumn: string; title?: string }[]} questions
 * @param {number | { limit?: number; selectedRegions?: string[] }} [optionsOrLimit=5]
 */
export function getTopDistricts(districts, answers, questions, optionsOrLimit = 5) {
  const options =
    typeof optionsOrLimit === 'number'
      ? { limit: optionsOrLimit, selectedRegions: ['any'] }
      : optionsOrLimit
  const { limit = 5, selectedRegions = ['any'] } = options

  const normalized = normalizeSelectedRegions(selectedRegions)
  if (normalized.length === 0) {
    return []
  }

  const filteredDistricts = districts.filter((district) =>
    districtMatchesSelectedRegions(district, normalized),
  )

  return filteredDistricts
    .map((district) => ({
      ...district,
      user_score_100: calculateDistrictScore(district, answers, questions),
    }))
    .sort((a, b) => b.user_score_100 - a.user_score_100)
    .slice(0, limit)
}

const BREAKDOWN_LABELS = {
  social_culture_score_20: 'Sosyal/Kültürel',
  sea_access_score_20: 'Deniz',
  earthquake_safety_score_20: 'Deprem güvenliği',
  low_crowding_score_20: 'Sakinlik',
  judicial_low_event_score_20: 'Adli olay azlığı',
  affordability_score_20: 'Pahalılık düşüklüğü',
}

/**
 * @param {Record<string, unknown>} district
 * @param {{ scoreColumn: string }[]} questions
 */
export function getScoreBreakdown(district, questions) {
  return questions.map((q) => ({
    key: q.scoreColumn,
    label: BREAKDOWN_LABELS[q.scoreColumn] ?? q.scoreColumn,
    value: safeNumber(district[q.scoreColumn], 0),
    max: 20,
  }))
}

const REASON_BY_KEY = {
  socialCulture:
    'Sosyal ve kültürel imkanları önemsediğin için bu ilçe güçlü eşleşti.',
  seaAccess: 'Denize yakınlık tercihin yüksek olduğu için bu ilçe öne çıktı.',
  earthquakeSafety:
    'Deprem güvenliği önceliğin nedeniyle bu ilçe modelde avantaj sağladı.',
  lowCrowding:
    'Daha sakin ve düşük nüfus baskılı ilçeleri önemsediğin için iyi eşleşti.',
  lowJudicialIntensity:
    'Adli olay yoğunluğu düşük bölgeleri önemsediğin için bu ilçe avantajlı görünüyor.',
  affordability:
    'Konut maliyetleri açısından daha erişilebilir göründüğü için önerilerde yükseldi.',
}

const TRADEOFF_BY_KEY = {
  socialCulture:
    'Sosyal/kültürel imkanlar beklentine göre daha sınırlı kalabilir.',
  seaAccess: 'Denize yakınlık açısından beklentini tam karşılamayabilir.',
  earthquakeSafety:
    'Deprem güvenliği önceliğine göre daha dikkatli değerlendirilmesi gerekir.',
  lowCrowding: 'Sakinlik beklentine göre kalabalık veya yoğun hissedebilir.',
  lowJudicialIntensity:
    'Adli olay yoğunluğu kriterinde modelde çok güçlü görünmüyor.',
  affordability: 'Konut maliyetleri açısından pahalı tarafta kalabilir.',
}

/**
 * @param {Record<string, unknown>} district
 * @param {Record<string, number | null>} answers
 * @param {{ key: string; scoreColumn: string }[]} questions
 * @returns {string[]}
 */
export function generateRecommendationReasons(district, answers, questions) {
  const reasons = []

  for (const q of questions) {
    const importance = answers[q.key]
    if (importance !== 4 && importance !== 5) continue
    const metric = safeNumber(district[q.scoreColumn], 0)
    if (metric < 15) continue
    const line = REASON_BY_KEY[q.key]
    if (line) reasons.push(line)
  }

  if (reasons.length === 0) {
    return ['Genel denge skoru yüksek olduğu için önerildi.']
  }

  return reasons.slice(0, 3)
}

/**
 * @param {Record<string, unknown>} district
 * @param {Record<string, number | null>} answers
 * @param {{ key: string; scoreColumn: string }[]} questions
 * @returns {string[]}
 */
export function getTradeOffs(district, answers, questions) {
  const lines = []

  for (const q of questions) {
    const importance = answers[q.key]
    if (importance !== 4 && importance !== 5) continue
    const metric = safeNumber(district[q.scoreColumn], 0)
    if (metric >= 10) continue
    const line = TRADEOFF_BY_KEY[q.key]
    if (line) lines.push(line)
    if (lines.length >= 2) break
  }

  if (lines.length === 0) {
    return ['Belirgin bir taviz alanı öne çıkmıyor.']
  }

  return lines
}

/**
 * @param {Record<string, number | null>} answers
 * @param {{ key: string; title: string }[]} questions
 * @returns {{ title: string; weight: number }[]}
 */
export function getTopTwoWeightDrivers(answers, questions) {
  return questions
    .map((q) => ({
      title: q.title,
      weight: answers[q.key],
    }))
    .filter((x) => typeof x.weight === 'number' && x.weight >= 1 && x.weight <= 5)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2)
    .map((x) => ({ title: x.title, weight: x.weight }))
}

/**
 * @param {Record<string, number | null>} answers
 * @param {{ key: string; title: string }[]} questions
 */
export function buildRankingSummarySentence(answers, questions) {
  const top = getTopTwoWeightDrivers(answers, questions)
  if (top.length === 0) {
    return 'Önceliklerine göre ağırlıklı bir model ile sıralandı.'
  }
  if (top.length === 1) {
    return `Özellikle “${top[0].title}” başlığına verdiğin önem, bu sıralamada belirleyici oldu.`
  }
  return `Bu sıralamada ağırlık “${top[0].title}” ve “${top[1].title}” başlıklarında; verdiğin önem derecelerine göre şekillendi.`
}
