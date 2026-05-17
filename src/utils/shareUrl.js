const PARAM = 's'

/**
 * @param {{ answers: Record<string, number|null>; selectedRegions: string[] }} state
 * @returns {string}
 */
export function encodeShareState({ answers, selectedRegions }) {
  const payload = {
    a: answers,
    r: selectedRegions,
  }
  const json = JSON.stringify(payload)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * @param {string} encoded
 * @returns {{ answers: Record<string, number|null>; selectedRegions: string[] } | null}
 */
export function decodeShareState(encoded) {
  if (!encoded || typeof encoded !== 'string') return null
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const json = decodeURIComponent(escape(atob(b64)))
    const data = JSON.parse(json)
    if (!data?.a || typeof data.a !== 'object') return null
    return {
      answers: data.a,
      selectedRegions: Array.isArray(data.r) ? data.r : [],
    }
  } catch {
    return null
  }
}

/**
 * @param {{ answers: Record<string, number|null>; selectedRegions: string[] }} state
 * @returns {string}
 */
export function buildShareUrl(state) {
  const token = encodeShareState(state)
  const base =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : ''
  return `${base}?${PARAM}=${token}`
}

/**
 * @returns {{ answers: Record<string, number|null>; selectedRegions: string[] } | null}
 */
export function readShareStateFromUrl() {
  if (typeof window === 'undefined') return null
  const token = new URLSearchParams(window.location.search).get(PARAM)
  if (!token) return null
  return decodeShareState(token)
}

/**
 * @param {{ answers: Record<string, number|null>; selectedRegions: string[] }} state
 */
export function writeShareStateToUrl(state) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set(PARAM, encodeShareState(state))
  window.history.replaceState(null, '', url.toString())
}

export function clearShareStateFromUrl() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.delete(PARAM)
  window.history.replaceState(null, '', url.toString())
}
