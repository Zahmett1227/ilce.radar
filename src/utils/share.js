import { formatScore } from './formatters.js'
import { getSelectedRegionLabels } from './regions.js'

/**
 * @param {{ name: string; description?: string }} profile
 * @param {Array<Record<string, unknown>>} topDistricts
 * @param {string[]} selectedRegions
 */
export function createShareText(profile, topDistricts, selectedRegions) {
  const name = profile?.name ?? 'İdeal ilçe profili'
  const regionText = getSelectedRegionLabels(selectedRegions).join(', ')
  const lines = topDistricts.map((d, i) => {
    const ilce = d.ilce ?? d.full_name ?? 'İlçe'
    const il = d.il != null && d.il !== '' ? d.il : ''
    const label = il ? `${ilce} / ${il}` : String(ilce)
    const sc = formatScore(d.user_score_100)
    return `${i + 1}. ${label} - ${sc}/100`
  })

  return [
    'Benim ideal ilçe profilim:',
    name,
    '',
    'Bölge tercihim:',
    regionText || 'Farketmez',
    '',
    'Bana en uygun 5 ilçe:',
    ...lines,
    '',
    'Kriterlerime göre hesaplandı.',
  ].join('\n')
}

/**
 * @param {string} text
 * @param {{ url?: string }} [options]
 * @returns {Promise<'shared'|'copied'|'unavailable'>}
 */
export async function shareResultText(text, options = {}) {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: 'İdeal İlçe Sonucum',
        text,
        url: options.url,
      })
      return 'shared'
    } catch {
      /* kullanıcı iptal */
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return 'copied'
    } catch {
      return 'unavailable'
    }
  }

  return 'unavailable'
}
