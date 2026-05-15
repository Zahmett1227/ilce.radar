import { useEffect } from 'react'
import { motion } from 'framer-motion'

const SCALE_LABELS = { 1: 'Az', 5: 'Çok' }

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
      className="w-full max-w-[680px] px-4 py-6 sm:py-10"
    >
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30 ring-1 ring-white/8 backdrop-blur-xl sm:p-8 md:p-10">

        {/* Step + progress */}
        <div className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold tabular-nums tracking-wider text-slate-500 uppercase">
              {currentIndex + 1} / {total}
            </span>
            <span className="text-[11px] text-slate-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 110, damping: 24 }}
            />
          </div>
        </div>

        {/* Question body */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
            <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </div>

          <h2
            id="question-title"
            className="mt-5 text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            {question.title}
          </h2>
          <p className="mt-2.5 max-w-lg text-[13px] leading-relaxed text-slate-500 sm:text-sm">
            {question.description}
          </p>
          <p className="mt-5 max-w-xl text-base font-medium leading-snug text-slate-200 sm:text-lg">
            {question.question}
          </p>
        </div>

        {/* 1-5 scale */}
        <div className="mt-8">
          <div className="mb-2.5 flex justify-between px-0.5">
            <span className="text-[10px] text-slate-600">Az önemli</span>
            <span className="text-[10px] text-slate-600">Çok önemli</span>
          </div>
          <div
            className="grid grid-cols-5 gap-2 sm:gap-2.5"
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
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onChange(n)}
                  className={[
                    'flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-xl border text-[15px] font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                    selected
                      ? 'border-emerald-400/50 bg-emerald-400/12 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.12)]'
                      : 'border-white/8 bg-transparent text-slate-500 hover:border-white/20 hover:text-slate-300',
                  ].join(' ')}
                >
                  {n}
                  {SCALE_LABELS[n] && (
                    <span className={`text-[9px] font-normal ${selected ? 'text-emerald-400/60' : 'text-slate-700'}`}>
                      {SCALE_LABELS[n]}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Selection label */}
        <p
          className="mt-4 text-center text-[12px] text-slate-500"
          aria-live="polite"
          aria-atomic="true"
        >
          {value != null ? (
            <>
              Seçim:{' '}
              <span className="font-medium text-emerald-400/80">
                {value} — {['Az önemli','Biraz önemli','Orta','Önemli','Çok önemli'][value - 1]}
              </span>
              <span className="sr-only">. Klavyede 1–5 ile değiştirebilirsin.</span>
            </>
          ) : (
            <span className="text-slate-600">1–5 arası bir önem derecesi seç</span>
          )}
        </p>

        {/* Navigation */}
        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="min-h-[48px] rounded-2xl border border-white/10 bg-transparent px-6 text-[15px] font-medium text-slate-400 transition hover:border-white/20 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Geri
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            disabled={!canProceed}
            onClick={onNext}
            className={[
              'min-h-[48px] rounded-2xl px-8 text-[15px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
              canProceed
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/35'
                : 'cursor-not-allowed bg-white/5 text-slate-600',
            ].join(' ')}
          >
            {isLast ? 'Bitir' : 'İleri'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
