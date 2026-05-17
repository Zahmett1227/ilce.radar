const WINDOW_MS = 60_000
const MAX_REQUESTS = 20

/** @type {Map<string, { count: number; resetAt: number }>} */
const buckets = new Map()

export function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).trim()
  }
  return req.socket?.remoteAddress ?? 'unknown'
}

/**
 * @param {string} key
 * @returns {{ allowed: boolean; retryAfterSec?: number }}
 */
export function checkRateLimit(key) {
  const now = Date.now()
  let bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS }
    buckets.set(key, bucket)
  }

  bucket.count += 1

  if (bucket.count > MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }

  return { allowed: true }
}
