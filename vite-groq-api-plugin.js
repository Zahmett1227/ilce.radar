import { handleAnalyzeRequest } from './api/lib/handleAnalyze.js'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new Error('invalid_json'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export function groqApiDevPlugin(env) {
  return {
    name: 'ilce-radar-groq-api',
    configureServer(server) {
      // Vite iç middleware'lerinden sonra ekle (async middleware + erken next() sorununu önler)
      return () => {
        server.middlewares.use((req, res, next) => {
          const pathname = req.url?.split('?')[0]?.replace(/\/$/, '') || ''
          if (pathname !== '/api/analyze') return next()

          const method = (req.method || 'GET').toUpperCase()

          if (method === 'OPTIONS') {
            res.statusCode = 204
            res.end()
            return
          }

          if (method !== 'POST') {
            sendJson(res, 405, { ok: false, error: 'Yalnızca POST desteklenir.' })
            return
          }

          if (env.GROQ_API_KEY) {
            process.env.GROQ_API_KEY = env.GROQ_API_KEY
          }

          readJsonBody(req)
            .then((body) => handleAnalyzeRequest(body))
            .then(({ status, body: payload }) => {
              sendJson(res, status, payload)
            })
            .catch((err) => {
              sendJson(res, err?.message === 'invalid_json' ? 400 : 500, {
                ok: false,
                error:
                  err?.message === 'invalid_json'
                    ? 'Geçersiz JSON gövdesi.'
                    : 'Analiz isteği işlenirken bir hata oluştu.',
              })
            })
        })
      }
    },
  }
}
