const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'
const MAX_PROMPT_LENGTH = 4000
const MIN_PROMPT_LENGTH = 3

export async function handleAnalyzeRequest(body) {
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''

  if (prompt.length < MIN_PROMPT_LENGTH) {
    return {
      status: 400,
      body: { ok: false, error: 'Analiz metni çok kısa veya boş.' },
    }
  }

  const truncated =
    prompt.length > MAX_PROMPT_LENGTH ? prompt.slice(0, MAX_PROMPT_LENGTH) : prompt

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return {
      status: 500,
      body: { ok: false, error: 'GROQ_API_KEY tanımlı değil.' },
    }
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: truncated }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const message =
        data?.error?.message ?? `Groq API isteği başarısız (${response.status}).`
      const status = response.status >= 500 ? 502 : 400
      return { status, body: { ok: false, error: message } }
    }

    const result = data.choices?.[0]?.message?.content?.trim() ?? ''
    if (!result) {
      return {
        status: 502,
        body: { ok: false, error: 'Model boş yanıt döndü.' },
      }
    }

    return { status: 200, body: { ok: true, result } }
  } catch {
    return {
      status: 500,
      body: { ok: false, error: 'Analiz isteği işlenirken bir hata oluştu.' },
    }
  }
}
