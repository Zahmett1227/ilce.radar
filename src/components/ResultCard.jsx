import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Bookmark, Check, ChevronDown, ExternalLink } from 'lucide-react'
import ScoreBar from './ScoreBar.jsx'
import RadarChart from './RadarChart.jsx'
import {
  formatPopulation,
  formatScore,
  formatTRY,
  formatTRYPerM2,
} from '../utils/formatters.js'
import {
  findSimilarDistricts,
  generateRecommendationReasons,
  getScoreBreakdown,
  getTradeOffs,
  safeNumber,
} from '../utils/scoring.js'
import { districtKey } from '../hooks/useFavorites.js'

function badgeText(label, value) {
  if (value === null || value === undefined || value === '') return null
  return `${label}: ${value}`
}

export default function ResultCard({
  rank,
  district,
  answers,
  questions,
  motionIndex,
  allDistricts,
  isFavorite,
  toggleFavorite,
  inComparisonSet,
  comparisonFull,
  toggleComparison,
}) {
  const [open, setOpen] = useState(false)
  const ilceName = district.ilce ?? district.full_name ?? 'İlçe'
  const ilName = district.il ?? ''
  const score = formatScore(district.user_score_100)
  const key = districtKey(district)
  const favorited = isFavorite ? isFavorite(key) : false

  const badges = [
    badgeText('Deniz', district.sea_category),
    badgeText('Deprem', district.earthquake_risk_band),
    badgeText('Nüfus', formatPopulation(district.population_2024)),
    badgeText('Ort. kira', formatTRY(district.avg_rent_try)),
    badgeText('Endeksa', district.endeksa_data_level),
  ].filter(Boolean)

  const displayBadges = badges.slice(0, 4)

  const breakdown = getScoreBreakdown(district, questions)
  const reasons = generateRecommendationReasons(district, answers, questions)
  const tradeOffs = getTradeOffs(district, answers, questions)

  const similarDistricts = useMemo(() => {
    if (!allDistricts || allDistricts.length === 0 || !open) return []
    return findSimilarDistricts(district, allDistricts, questions, 4)
  }, [district, allDistricts, questions, open])

  const searchQuery = encodeURIComponent(
    `${ilceName} ${ilName} ilçe`.replace(/\s+/g, ' ').trim(),
  )
  const googleUrl = `https://www.google.com/search?q=${searchQuery}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`

  const amortYears = safeNumber(district.amortization_years, NaN)
  const amortLabel = Number.isFinite(amortYears)
    ? `${amortYears.toLocaleString('tr-TR')} yıl`
    : '—'

  const listingNote =
    typeof district.listing_stock_note === 'string' &&
    district.listing_stock_note.trim().length > 0
      ? district.listing_stock_note.trim()
      : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: motionIndex * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl ring-1 ring-white/10 backdrop-blur-xl"
    >
      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/30 to-cyan-500/20 text-lg font-bold text-white ring-1 ring-emerald-400/40">
            {rank}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-white sm:text-xl">
              {ilceName}
            </h3>
            <p className="text-sm text-slate-400">{ilName}</p>
            <p className="mt-2 text-sm text-emerald-300/90">
              Eşleşme skoru:{' '}
              <span className="font-semibold tabular-nums text-white">{score}</span>
              <span className="text-slate-500">/100</span>
            </p>
          </div>
          <div className="flex shrink-0 self-start gap-1">
            {toggleComparison && (
              <button
                type="button"
                onClick={() => toggleComparison(key)}
                disabled={comparisonFull && !inComparisonSet}
                title={inComparisonSet ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}
                aria-label={inComparisonSet ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}
                aria-pressed={inComparisonSet}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
                  inComparisonSet
                    ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                    : comparisonFull
                      ? 'cursor-not-allowed border-white/10 bg-slate-900/40 text-slate-700'
                      : 'border-white/10 bg-slate-900/40 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300'
                }`}
              >
                <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </button>
            )}
            {toggleFavorite && (
              <button
                type="button"
                onClick={() => toggleFavorite(key)}
                aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                aria-pressed={favorited}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/40 transition hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
              >
                <Bookmark
                  className={`h-4 w-4 transition-colors ${favorited ? 'fill-emerald-400 text-emerald-400' : 'text-slate-500'}`}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {displayBadges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-white/10 bg-slate-900/50 px-3 py-1 text-xs text-slate-300"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Neden önerildi?
          </p>
          <ul className="mt-2 space-y-2">
            {reasons.map((r, idx) => (
              <li key={`${idx}-${r.slice(0, 24)}`} className="flex gap-2 text-sm text-slate-200">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 ring-1 ring-amber-400/15">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-200/90">
            Taviz verdiğin alan
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-snug text-amber-100/90">
            {tradeOffs.map((t, idx) => (
              <li key={`${idx}-${t.slice(0, 20)}`}>{t}</li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/40 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          {open ? 'Detayları gizle' : 'Detayları göster'}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
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
              <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Puan dağılımı
                </p>
                <RadarChart breakdown={breakdown} />

                {breakdown.map((row) => (
                  <ScoreBar
                    key={row.key}
                    label={row.label}
                    value={row.value}
                    max={row.max}
                  />
                ))}

                <div className="space-y-2 border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Konut ve piyasa
                  </p>
                  <dl className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-slate-500">Satış (TRY/m²)</dt>
                      <dd className="font-medium tabular-nums">
                        {formatTRYPerM2(district.sale_price_m2_try)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Kira (TRY/m²)</dt>
                      <dd className="font-medium tabular-nums">
                        {formatTRYPerM2(district.rent_price_m2_try)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Ortalama konut fiyatı</dt>
                      <dd className="font-medium tabular-nums">
                        {formatTRY(district.avg_home_price_try)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Amortisman süresi</dt>
                      <dd className="font-medium">{amortLabel}</dd>
                    </div>
                  </dl>
                  {listingNote ? (
                    <p className="text-xs leading-relaxed text-slate-500">{listingNote}</p>
                  ) : null}
                </div>

                {similarDistricts.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Buna benzer ilçeler
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {similarDistricts.map((sim, idx) => {
                        const simIlce = sim.ilce ?? sim.full_name ?? 'İlçe'
                        const simIl = sim.il ?? ''
                        const simScore = formatScore(sim.default_overall_score_100)
                        return (
                          <span
                            key={`sim-${simIlce}-${idx}`}
                            className="rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-xs text-slate-300"
                          >
                            <span className="font-medium text-slate-100">{simIlce}</span>
                            {simIl ? (
                              <span className="text-slate-500"> / {simIl}</span>
                            ) : null}
                            <span className="ml-1.5 tabular-nums text-emerald-400/80">
                              {simScore}
                            </span>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-xs font-medium text-emerald-200/90 transition hover:border-emerald-500/40 hover:bg-slate-800/60"
                  >
                    Google&apos;da ara
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  </a>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 text-xs font-medium text-cyan-200/90 transition hover:border-cyan-500/40 hover:bg-slate-800/60"
                  >
                    Haritada aç
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}
