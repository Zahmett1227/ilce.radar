import { handleAnalyzeRequest } from './lib/handleAnalyze.js'
import { getClientIp } from './lib/rateLimit.js'

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

function setCorsHeaders(req, res) {
  const origin = req.headers?.origin
  if (!origin) return
  const allowed =
    ALLOWED_ORIGINS.length === 0 ||
    ALLOWED_ORIGINS.includes(origin) ||
    ALLOWED_ORIGINS.includes('*')
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
}

export default async function handler(req, res) {
  setCorsHeaders(req, res)

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Yalnızca POST desteklenir.' })
  }

  const body =
    typeof req.body === 'string'
      ? JSON.parse(req.body || '{}')
      : req.body ?? {}

  const clientIp = getClientIp(req)
  const { status, body: payload } = await handleAnalyzeRequest(body, { clientIp })
  return res.status(status).json(payload)
}
