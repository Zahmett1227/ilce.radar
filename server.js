import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'

config({ path: '.env.local' })

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY tanımlı değil' })
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    console.log('Anthropic yanıtı:', JSON.stringify(data).slice(0, 200))
    res.json(data)
  } catch (err) {
    console.error('Hata:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Sunucu çalışıyor: http://localhost:3001'))
