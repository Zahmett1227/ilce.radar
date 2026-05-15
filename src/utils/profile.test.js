import { describe, expect, it } from 'vitest'
import { getLifeProfile, getTopAnswerKeys } from './profile.js'

describe('getTopAnswerKeys', () => {
  it('returns highest weighted keys', () => {
    const keys = getTopAnswerKeys(
      { a: 2, b: 5, c: 4 },
      2,
    )
    expect(keys[0]).toBe('b')
    expect(keys[1]).toBe('c')
  })
})

describe('getLifeProfile', () => {
  it('returns default when no strong signal', () => {
    const p = getLifeProfile({
      socialCulture: 3,
      seaAccess: 3,
      earthquakeSafety: 3,
      lowCrowding: 3,
      lowJudicialIntensity: 3,
      affordability: 3,
    })
    expect(p.name).toBe('Dengeli Yaşam Arayan')
  })

  it('detects sakin ve güvenli', () => {
    const p = getLifeProfile({
      earthquakeSafety: 4,
      lowCrowding: 4,
      socialCulture: 3,
      seaAccess: 2,
      lowJudicialIntensity: 2,
      affordability: 3,
    })
    expect(p.name).toBe('Sakin ve Güvenli Yaşam Arayan')
  })
})
