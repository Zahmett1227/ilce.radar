import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Send, Sparkles } from 'lucide-react'
import { buildChatSystemPrompt } from '../utils/aiPrompt.js'

const MAX_TURNS = 5

function DotsLoader() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

export default function AIChatPanel({
  profile,
  answers,
  questions,
  districts,
  selectedRegionLabels,
  insightText,
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const userTurns = messages.filter((m) => m.role === 'user').length
  const limitReached = userTurns >= MAX_TURNS
  const remaining = MAX_TURNS - userTurns

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading || limitReached) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)

    try {
      const res = await fetch('http://localhost:3001/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 600,
          system: buildChatSystemPrompt({
            profile,
            answers,
            questions,
            districts,
            selectedRegionLabels,
            insightText,
          }),
          messages: newMessages,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error?.message ?? 'API hatası')
      }

      const textBlock = data.content?.find((c) => c.type === 'text')
      const reply = textBlock?.text ?? ''

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Yanıt alınamadı. Proxy sunucusunun çalıştığından emin ol (node server.js, port 3001).',
        },
      ])
    } finally {
      setLoading(false)
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/8 via-slate-900/40 to-cyan-500/8 ring-1 ring-white/10">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 sm:p-6"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/30">
          <Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Yapay Zeka ile Soru Sor</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Önerilen ilçeler hakkında merak ettiğin her şeyi sor
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 pb-5 sm:px-6 sm:pb-6">
              {/* Messages */}
              <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                {messages.length === 0 && !loading && (
                  <p className="py-4 text-center text-xs text-slate-600">
                    Henüz soru sormadın. Aşağıdan başlayabilirsin.
                  </p>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-slate-700/80 text-slate-100'
                          : 'bg-gradient-to-br from-purple-500/20 to-cyan-500/10 text-slate-200 ring-1 ring-white/10'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10 px-4 py-3 ring-1 ring-white/10">
                      <DotsLoader />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="mt-4">
                {limitReached ? (
                  <p className="py-3 text-center text-xs text-slate-500">
                    Soru hakkın doldu. Yeni bir sonuç almak için tercihleri değiştir.
                  </p>
                ) : (
                  <div className="flex items-end gap-2">
                    <textarea
                      rows={2}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Bir şey sor… (Enter = gönder, Shift+Enter = satır sonu)"
                      disabled={loading}
                      className="flex-1 resize-none rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/30 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      aria-label="Gönder"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-500/25 text-purple-200 transition hover:bg-purple-500/40 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60"
                    >
                      <Send className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] text-slate-600">
                    Bu konuşma sadece bu oturumda geçerlidir
                  </p>
                  {!limitReached && (
                    <p className="text-[10px] text-slate-600">
                      {remaining} soru hakkın kaldı
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
