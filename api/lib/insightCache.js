const TTL_MS = 24 * 60 * 60 * 1000

/** @type {Map<string, { result: string; expiresAt: number }>} */
const cache = new Map()

/**
 * @param {string} cacheKey
 * @returns {string | null}
 */
export function getCachedInsight(cacheKey) {
  if (!cacheKey || typeof cacheKey !== 'string') return null
  const entry = cache.get(cacheKey)
  if (!entry) return null
  if (Date.now() >= entry.expiresAt) {
    cache.delete(cacheKey)
    return null
  }
  return entry.result
}

/**
 * @param {string} cacheKey
 * @param {string} result
 */
export function setCachedInsight(cacheKey, result) {
  if (!cacheKey || !result) return
  cache.set(cacheKey, { result, expiresAt: Date.now() + TTL_MS })
}
