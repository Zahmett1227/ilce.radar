import { describe, expect, it } from 'vitest'
import { decodeShareState, encodeShareState } from './shareUrl.js'

describe('shareUrl', () => {
  it('round-trips answers and regions', () => {
    const state = {
      answers: { socialCulture: 5, seaAccess: 3 },
      selectedRegions: ['akdeniz', 'any'],
    }
    const encoded = encodeShareState(state)
    const decoded = decodeShareState(encoded)
    expect(decoded).toEqual(state)
  })

  it('returns null for invalid token', () => {
    expect(decodeShareState('not-valid!!!')).toBeNull()
  })
})
