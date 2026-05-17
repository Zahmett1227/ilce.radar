import { handleAnalyzeRequest } from './lib/handleAnalyze.js'

export default async function handler(req, res) {
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

  const { status, body: payload } = await handleAnalyzeRequest(body)
  return res.status(status).json(payload)
}
