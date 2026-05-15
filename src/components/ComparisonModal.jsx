import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import RadarChart, { DATASET_COLORS } from './RadarChart.jsx'
import { getScoreBreakdown } from '../utils/scoring.js'
import {
  formatPopulation,
  formatScore,
  formatTRY,
  formatTRYPerM2,
} from '../utils/formatters.js'

const DISTRICT_THEME = [
  {
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/15 text-emerald-200',
    bar: 'bg-emerald-400',
  },
  {
    dot: 'bg-cyan-400',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/15 text-cyan-200',
    bar: 'bg-cyan-400',
  },
  {
    dot: 'bg-purple-400',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/15 text-purple-200',
    bar: 'bg-purple-400',
  },
]

function MiniBar({ value, max, colorClass }) {
  const pct = Math.min(Math.max((value / Math.max(max, 1)) * 100, 0), 100)
  return (
    <div className="h-1 w-full rounded-full bg-slate-800">
      <div className={`h-1 rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function ComparisonModal({ districts, questions, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!districts || districts.length < 2) return null

  const breakdowns = districts.map((d) => getScoreBreakdown(d, questions))

  const datasets = districts.map((d, i) => ({
    breakdown: breakdowns[i],
    ...DATASET_COLORS[i % DATASET_COLORS.length],
  }))

  return (
    <AnimatePresence>
      <motion.div
        key="comparison-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" aria-hidden />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl ring-1 ring-white/10 sm:p-7"
          role="dialog"
          aria-modal="true"
          aria-label="İlçe Karşılaştırması"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              İlçe Karşılaştırması
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/60 text-slate-400 transition hover:bg-slate-700/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {/* Combined radar */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="w-full max-w-[220px]">
              <RadarChart datasets={datasets} />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {districts.map((d, i) => {
                const theme = DISTRICT_THEME[i % DISTRICT_THEME.length]
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
                    <span className="text-xs text-slate-300">
                      {d.ilce ?? d.full_name}
                      {d.il ? <span className="text-slate-500"> / {d.il}</span> : null}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Comparison columns */}
          <div
            className="mt-6 grid gap-4"
            style={{ gridTemplateColumns: `repeat(${districts.length}, minmax(0, 1fr))` }}
          >
            {districts.map((d, i) => {
              const theme = DISTRICT_THEME[i % DISTRICT_THEME.length]
              const bd = breakdowns[i]
              const ilce = d.ilce ?? d.full_name ?? 'İlçe'
              const il = d.il ?? ''
              const score = formatScore(d.user_score_100)

              return (
                <div
                  key={i}
                  className={`rounded-2xl border ${theme.border} bg-slate-800/40 p-4 space-y-4`}
                >
                  {/* Header */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${theme.dot}`} />
                      <p className={`truncate text-sm font-semibold ${theme.text}`}>{ilce}</p>
                    </div>
                    {il && <p className="pl-3.5 text-xs text-slate-500">{il}</p>}
                    <div className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${theme.badge}`}>
                      {score}/100
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div className="space-y-2.5">
                    {bd.map((row) => (
                      <div key={row.key}>
                        <div className="mb-1 flex items-center justify-between gap-1">
                          <span className="truncate text-[10px] text-slate-400">{row.label}</span>
                          <span className="shrink-0 tabular-nums text-[10px] font-medium text-slate-200">
                            {row.value}/{row.max}
                          </span>
                        </div>
                        <MiniBar value={row.value} max={row.max} colorClass={theme.bar} />
                      </div>
                    ))}
                  </div>

                  {/* Housing data */}
                  <div className="border-t border-white/10 pt-3 space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Konut
                    </p>
                    {[
                      { label: 'Ort. kira/ay', val: formatTRY(d.avg_rent_try) },
                      { label: 'Konut fiyatı', val: formatTRY(d.avg_home_price_try) },
                      { label: 'Satış (m²)', val: formatTRYPerM2(d.sale_price_m2_try) },
                      { label: 'Nüfus', val: formatPopulation(d.population_2024) },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex items-start justify-between gap-2">
                        <span className="text-[10px] text-slate-500">{label}</span>
                        <span className="tabular-nums text-[10px] font-medium text-slate-200 text-right">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Disclaimer */}
          <p className="mt-5 text-center text-[10px] leading-relaxed text-slate-600">
            Puanlar kişisel tercihlerinize göre ağırlıklandırılmış eşleşme skorlarıdır.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
