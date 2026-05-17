import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { buildInsightPrompt } from '../utils/aiPrompt.js'
import { analyzeWithGroq } from '../services/aiService.js'

export default function AIInsightCard({
  profile,
  answers,
  questions,
  districts,
  selectedRegionLabels,
  onInsightReady,
}) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const insightKey = [
    districts.map((d) => d.district_id ?? d.full_name).join('|'),
    JSON.stringify(answers),
    questions.map((q) => q.key).join(','),
    (selectedRegionLabels ?? []).join(','),
  ].join('::')

  useEffect(() => {
    if (!districts?.length || !questions?.length) return

    let cancelled = false
    setText('')
    setLoading(true)
    setError(false)

    async function fetchInsight() {
      try {
        const prompt = buildInsightPrompt({
          profile,
          answers,
          questions,
          districts,
          selectedRegionLabels,
        })
        const insightText = await analyzeWithGroq(prompt)
        if (cancelled) return

        if (!cancelled) {
          setText(insightText)
          onInsightReady?.(insightText)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message ?? true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchInsight()
    return () => {
      cancelled = true
    }
  }, [insightKey])

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-slate-900/40 to-cyan-500/10 p-6 shadow-lg ring-1 ring-white/10 sm:p-7"
    >
      {/* Arka plan parıltısı */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 80% 100%, rgba(168, 85, 247, 0.3), transparent)',
        }}
        aria-hidden
      />

      <div className="relative">
        {/* Başlık */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/30">
            <Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-200/80">
              Yapay Zeka Analizi
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Sonuçların kişisel yorumu</p>
          </div>
        </div>

        {/* İçerik */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm leading-relaxed text-slate-500"
            >
              {typeof error === 'string' ? error : 'Analiz yüklenemedi.'}{' '}
              {typeof error === 'string' ? null : (
                <>
                  Yerelde{' '}
                  <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-slate-300">
                    .env
                  </code>{' '}
                  içinde{' '}
                  <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-slate-300">
                    GROQ_API_KEY
                  </code>{' '}
                  tanımlı olduğundan emin ol.
                </>
              )}
            </motion.p>
          ) : loading && text === '' ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2.5"
            >
              {[100, 90, 75].map((w, i) => (
                <div
                  key={i}
                  className="h-3.5 animate-pulse rounded-full bg-slate-800"
                  style={{ width: `${w}%` }}
                />
              ))}
              <p className="mt-3 text-xs text-slate-600">Analiz hazırlanıyor...</p>
            </motion.div>
          ) : (
            <motion.p
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="whitespace-pre-line text-sm leading-relaxed text-slate-300 sm:text-base"
            >
              {text}
              {loading && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-purple-400 align-middle" />
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
