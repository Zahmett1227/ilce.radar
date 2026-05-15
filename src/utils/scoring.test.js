import { describe, expect, it } from 'vitest'
import {
  buildRankingSummarySentence,
  calculateDistrictScore,
  filterDistrictsByPreferences,
  generateRecommendationReasons,
  getTopDistricts,
  getTradeOffs,
  resolveDistrictsForScoring,
  safeNumber,
} from './scoring.js'

const profileQuestions = [
  { key: 'socialCulture', scoreColumn: 'social_culture_score_20' },
  { key: 'seaAccess', scoreColumn: 'sea_access_score_20' },
]

const questions = [
  { key: 'a', scoreColumn: 's_a', title: 'Metrik A' },
  { key: 'b', scoreColumn: 's_b', title: 'Metrik B' },
]

describe('safeNumber', () => {
  it('returns fallback for invalid', () => {
    expect(safeNumber('x', 0)).toBe(0)
    expect(safeNumber(null, 3)).toBe(3)
    expect(safeNumber('', 1)).toBe(1)
  })
  it('parses valid numbers', () => {
    expect(safeNumber('12.5', 0)).toBe(12.5)
    expect(safeNumber(20, 0)).toBe(20)
  })
})

describe('calculateDistrictScore', () => {
  it('weights and scales to ~100 scale', () => {
    const d = { s_a: 10, s_b: 20 }
    const answers = { a: 5, b: 5 }
    const v = calculateDistrictScore(d, answers, questions)
    expect(v).toBeCloseTo(75, 5)
  })
  it('returns 0 when no weights', () => {
    expect(calculateDistrictScore({ s_a: 10 }, { a: null }, questions)).toBe(0)
  })
})

describe('getTopDistricts', () => {
  it('sorts by weighted score', () => {
    const list = [
      { id: 1, s_a: 20, s_b: 0 },
      { id: 2, s_a: 0, s_b: 20 },
    ]
    const answers = { a: 5, b: 1 }
    const top = getTopDistricts(list, answers, questions, 1)
    expect(top[0].id).toBe(1)
    expect(top[0].user_score_100).toBeDefined()
  })

  it('filters by selected regions', () => {
    const list = [
      { id: 1, il: 'İzmir', s_a: 10, s_b: 10 },
      { id: 2, il: 'Ankara', s_a: 20, s_b: 20 },
    ]
    const answers = { a: 5, b: 5 }
    const top = getTopDistricts(list, answers, questions, {
      limit: 5,
      selectedRegions: ['ege'],
    })
    expect(top).toHaveLength(1)
    expect(top[0].il).toBe('İzmir')
  })

  it('returns no districts when selectedRegions normalizes to empty', () => {
    const list = [{ id: 1, il: 'İzmir', s_a: 10, s_b: 10 }]
    const answers = { a: 5, b: 5 }
    const top = getTopDistricts(list, answers, questions, {
      limit: 5,
      selectedRegions: [],
    })
    expect(top).toHaveLength(0)
  })
})

describe('filterDistrictsByPreferences', () => {
  const bolge = { İzmir: 'Ege', Ankara: 'İç Anadolu' }
  it('filters by region', () => {
    const list = [{ il: 'İzmir' }, { il: 'Ankara' }]
    const f = filterDistrictsByPreferences(list, { region: 'Ege', populationPref: 'any' }, bolge)
    expect(f).toHaveLength(1)
    expect(f[0].il).toBe('İzmir')
  })
  it('population small uses lower third', () => {
    const list = [
      { il: 'X', population_2024: 100 },
      { il: 'Y', population_2024: 200 },
      { il: 'Z', population_2024: 300 },
    ]
    const f = filterDistrictsByPreferences(
      list,
      { region: 'any', populationPref: 'small' },
      {},
    )
    expect(f.length).toBeGreaterThanOrEqual(1)
  })
})

describe('resolveDistrictsForScoring', () => {
  it('falls back when filters too tight', () => {
    const list = [{ il: 'İzmir', population_2024: 500000 }]
    const r = resolveDistrictsForScoring(
      list,
      { region: 'Karadeniz', populationPref: 'small' },
      { İzmir: 'Ege' },
    )
    expect(r.districts.length).toBeGreaterThanOrEqual(1)
    expect(r.relaxed).toBe(true)
  })
})

describe('buildRankingSummarySentence', () => {
  it('mentions top titles', () => {
    const answers = { a: 5, b: 3 }
    const s = buildRankingSummarySentence(answers, questions)
    expect(s).toContain('Metrik A')
  })
})

describe('generateRecommendationReasons', () => {
  it('caps at three items', () => {
    const district = {
      social_culture_score_20: 16,
      sea_access_score_20: 16,
    }
    const answers = { socialCulture: 5, seaAccess: 5 }
    const r = generateRecommendationReasons(district, answers, profileQuestions)
    expect(r.length).toBeLessThanOrEqual(3)
    expect(r.length).toBeGreaterThanOrEqual(1)
  })
})

describe('getTradeOffs', () => {
  it('returns placeholder when no conflict', () => {
    const district = { social_culture_score_20: 18 }
    const answers = { socialCulture: 5 }
    const t = getTradeOffs(district, answers, profileQuestions)
    expect(t).toEqual(['Belirgin bir taviz alanı öne çıkmıyor.'])
  })

  it('flags low score on high priority', () => {
    const district = { social_culture_score_20: 5 }
    const answers = { socialCulture: 5 }
    const t = getTradeOffs(district, answers, profileQuestions)
    expect(t.some((x) => x.includes('Sosyal'))).toBe(true)
  })
})
