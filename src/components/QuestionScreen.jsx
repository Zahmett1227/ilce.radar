import { useEffect } from 'react'
import { motion } from 'framer-motion'

const LABELS = {
  1: 'Az önemli',
  2: 'Biraz önemli',
  3: 'Orta',
  4: 'Önemli',
  5: 'Çok önemli',
}

export default function QuestionScreen({
  question,
  currentIndex,
  total,
  value,
  onChange,
  onBack,
  onNext,
  isLast,
  canProceed,
}) {
  const Icon = question.icon
  const progress = ((currentIndex + 1) / total) * 100

  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return
      const k = e.key
      if (k !== '1' && k !== '2' && k !== '3' && k !== '4' && k !== '5') return
      e.preventDefault()
      onChange(Number(k))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onChange])

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[720px] px-4 py-6 sm:py-10"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-8 md:p-10">
        <div className="mb-6 flex items-center justify-between gap-3 text-sm text-slate-400">
          <span className="font-medium tabular-nums text-slate-300">
            {currentIndex + 1} / {total}
          </span>
        </div>
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
            <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2
            id="question-title"
            className="mt-5 text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            {question.title}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
            {question.description}
          </p>
          <p className="mt-6 max-w-xl text-base font-medium leading-snug text-slate-200 sm:text-lg">
            {question.question}
          </p>
        </div>

        <div
          className="mt-8 grid grid-cols-5 gap-2 sm:gap-3"
          role="radiogroup"
          aria-labelledby="question-title"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = value === n
            return (
              <motion.button
                key={n}
                type="button"
                role="radio"
                aria-checked={selected}
                whileTap={{ scale: 0.94 }}
                onClick={() => onChange(n)}
                className={[
                  'flex min-h-[48px] flex-col items-center justify-center rounded-2xl border text-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:min-h-[56px]',
                  selected
                    ? 'border-emerald-400/80 bg-gradient-to-b from-emerald-400/25 to-cyan-500/20 text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/50'
                    : 'border-white/10 bg-slate-900/40 text-slate-200 hover:border-emerald-500/40 hover:bg-slate-800/60',
                ].join(' ')}
              >
                {n}
              </motion.button>
            )
          })}
        </div>

        <p
          className="mt-4 text-center text-sm text-slate-400"
          aria-live="polite"
          aria-atomic="true"
        >
          {value != null ? (
            <>
              Seçim: <span className="font-medium text-emerald-300">{LABELS[value]}</span>
              <span className="sr-only">. Klavyede 1–5 ile değiştirebilirsin.</span>
            </>
          ) : (
            'Lütfen 1–5 arası bir önem derecesi seç (klavyede 1–5).'
          )}
        </p>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="min-h-[48px] rounded-2xl border border-white/15 bg-transparent px-6 text-base font-medium text-slate-200 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Geri
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            disabled={!canProceed}
            onClick={onNext}
            className={[
              'min-h-[48px] rounded-2xl px-8 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
              canProceed
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/35'
                : 'cursor-not-allowed bg-slate-700 text-slate-500',
            ].join(' ')}
          >
            {isLast ? 'Bitir' : 'İleri'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
