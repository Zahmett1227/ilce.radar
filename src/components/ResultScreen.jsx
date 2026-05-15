import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Bookmark, Share2, X } from 'lucide-react'
import LifeProfileCard from './LifeProfileCard.jsx'
import ResultCard from './ResultCard.jsx'
import DistrictMap from './DistrictMap.jsx'
import Toast from './Toast.jsx'
import { getLifeProfile } from '../utils/profile.js'
import {
  getSelectedRegionLabels,
  isAnyRegionSelected,
  normalizeSelectedRegions,
} from '../utils/regions.js'
import { createShareText, shareResultText } from '../utils/share.js'
import { formatScore } from '../utils/formatters.js'
import { useFavorites, districtKey } from '../hooks/useFavorites.js'
import ComparisonModal from './ComparisonModal.jsx'
import AIInsightCard from './AIInsightCard.jsx'
import AIChatPanel from './AIChatPanel.jsx'
import ResultFilters, { defaultFilters, MAX_RENT_LIMIT } from './ResultFilters.jsx'

function formatSnapshotDate(iso) {
  if (!iso || typeof iso !== 'string') return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function ResultScreen({
  districts,
  allDistricts,
  selectedRegions = [],
  generatedAt,
  rowCount,
  answers,
  questions,
  onChangePreferences,
  onRestart,
}) {
  const [toast, setToast] = useState(null)
  const [insightText, setInsightText] = useState('')
  const [comparisonSet, setComparisonSet] = useState(new Set())
  const [showComparison, setShowComparison] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const toggleComparison = useCallback((key) => {
    setComparisonSet((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else if (next.size < 3) {
        next.add(key)
      }
      return next
    })
  }, [])

  const comparisonDistricts = useMemo(
    () => districts.filter((d) => comparisonSet.has(districtKey(d))),
    [districts, comparisonSet],
  )

  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      if (filters.maxRent < MAX_RENT_LIMIT && d.avg_rent_try && d.avg_rent_try > filters.maxRent)
        return false
      if (filters.earthquakeBands.length > 0 && !filters.earthquakeBands.includes(d.earthquake_risk_band))
        return false
      if (filters.seaCategories.length > 0 && !filters.seaCategories.includes(d.sea_category))
        return false
      if (filters.minPop !== '' && d.population_2024 < Number(filters.minPop)) return false
      if (filters.maxPop !== '' && d.population_2024 > Number(filters.maxPop)) return false
      return true
    })
  }, [districts, filters])

  const profile = useMemo(() => getLifeProfile(answers), [answers])
  const snapshotLabel = formatSnapshotDate(generatedAt)
  const count = typeof rowCount === 'number' ? rowCount : districts.length

  const normalizedRegions = useMemo(
    () => normalizeSelectedRegions(selectedRegions),
    [selectedRegions],
  )
  const isAny = isAnyRegionSelected(selectedRegions)
  const regionPillLabels = useMemo(
    () => getSelectedRegionLabels(selectedRegions),
    [selectedRegions],
  )

  const favoriteDistricts = useMemo(() => {
    if (!allDistricts || favorites.size === 0) return []
    return allDistricts.filter((d) => favorites.has(districtKey(d)))
  }, [allDistricts, favorites])

  const isFilteredEmpty =
    districts.length === 0 && !isAny && normalizedRegions.length > 0

  const handleShare = async () => {
    const text = createShareText(profile, districts, selectedRegions)
    const r = await shareResultText(text)
    setToast(
      r === 'shared'
        ? 'Paylaşım penceresi açıldı.'
        : r === 'copied'
          ? 'Sonuç panoya kopyalandı.'
          : 'Bu cihazda paylaşım veya pano kullanılamadı.',
    )
    setTimeout(() => setToast(null), 2800)
  }

  return (
    <>
      <Toast message={toast} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[720px] px-4 py-6 sm:py-10"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-8 md:p-10">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Sana En Uygun 5 İlçe
          </h2>

          {allDistricts?.length > 0 && districts.length > 0 && (
            <div className="mt-6">
              <DistrictMap allDistricts={allDistricts} topDistricts={districts} />
              <p className="mt-2 text-center text-xs text-slate-500">
                Yeşil = yüksek uyum · Sarı = orta · Kırmızı = düşük · Beyaz halka = senin için önerilen
              </p>
            </div>
          )}

          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-400 sm:text-base">
            {isAny ? (
              <>Tüm Türkiye genelinde verdiğin önceliklere göre hesaplandı.</>
            ) : (
              <>Seçtiğin bölgeler içinde verdiğin önceliklere göre hesaplandı.</>
            )}
          </p>

          {regionPillLabels.length > 0 ? (
            <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2">
              {regionPillLabels.map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className="rounded-full border border-white/10 bg-slate-900/50 px-3 py-1 text-xs text-slate-300"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}

          {snapshotLabel || count ? (
            <p className="mx-auto mt-3 max-w-xl text-center text-xs text-slate-500 sm:text-sm">
              {count > 0 ? (
                <>
                  Veri seti:{' '}
                  <span className="tabular-nums text-slate-400">{count}</span> ilçe
                </>
              ) : null}
              {snapshotLabel ? (
                <>
                  {count > 0 ? ' · ' : null}
                  güncelleme: <span className="text-slate-400">{snapshotLabel}</span>
                </>
              ) : null}
            </p>
          ) : null}

          <div className="mt-6 space-y-4">
            <LifeProfileCard profile={profile} />
          </div>

          {isFilteredEmpty ? (
            <div className="mx-auto mt-10 max-w-md text-center">
              <p className="text-base font-semibold text-slate-200">
                Bu seçimle yeterli ilçe bulunamadı
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Bölge seçimini genişleterek veya &apos;Farketmez&apos; seçeneğini kullanarak tüm
                Türkiye genelinde öneri alabilirsin.
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={onChangePreferences}
                className="mt-6 min-h-[48px] w-full rounded-2xl border border-white/15 bg-transparent px-6 text-base font-medium text-slate-100 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                Bölgeyi değiştir
              </motion.button>
            </div>
          ) : districts.length === 0 ? (
            <p className="mx-auto mt-10 max-w-md text-center text-sm text-slate-400">
              Veri yüklenemedi veya sonuç üretilemedi. Lütfen sayfayı yenileyip tekrar dene.
            </p>
          ) : (
            <div className="mt-8 space-y-4">
              <ResultFilters
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredDistricts.length}
                totalCount={districts.length}
              />
              {filteredDistricts.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-300">Filtrelerle eşleşen ilçe yok</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Filtreleri gevşeterek daha fazla sonuç görebilirsin.
                  </p>
                </div>
              ) : (
                filteredDistricts.map((d, i) => {
                  const key = districtKey(d)
                  return (
                    <ResultCard
                      key={`${d.district_id ?? d.full_name ?? i}-${i}`}
                      rank={i + 1}
                      district={d}
                      answers={answers}
                      questions={questions}
                      motionIndex={i}
                      allDistricts={allDistricts}
                      isFavorite={isFavorite}
                      toggleFavorite={toggleFavorite}
                      inComparisonSet={comparisonSet.has(key)}
                      comparisonFull={comparisonSet.size >= 3 && !comparisonSet.has(key)}
                      toggleComparison={toggleComparison}
                    />
                  )
                })
              )}
            </div>
          )}

          {filteredDistricts.length > 0 && (
            <div className="mt-8 space-y-4">
              <AIInsightCard
                profile={profile}
                answers={answers}
                questions={questions}
                districts={filteredDistricts}
                selectedRegionLabels={regionPillLabels}
                onInsightReady={setInsightText}
              />
              <AIChatPanel
                profile={profile}
                answers={answers}
                questions={questions}
                districts={filteredDistricts}
                selectedRegionLabels={regionPillLabels}
                insightText={insightText}
              />
            </div>
          )}

          {favoriteDistricts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 ring-1 ring-emerald-400/10"
            >
              <div className="mb-3 flex items-center gap-2">
                <Bookmark
                  className="h-4 w-4 fill-emerald-400 text-emerald-400"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300/80">
                  Kaydettiklerim
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {favoriteDistricts.map((d, i) => {
                  const ilce = d.ilce ?? d.full_name ?? 'İlçe'
                  const il = d.il ?? ''
                  const sc = formatScore(d.default_overall_score_100 ?? d.user_score_100)
                  return (
                    <div
                      key={`fav-${districtKey(d)}-${i}`}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-slate-100">{ilce}</span>
                      {il ? <span className="text-slate-500">/ {il}</span> : null}
                      <span className="tabular-nums text-emerald-400/80">{sc}</span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(districtKey(d))}
                        aria-label={`${ilce} favorilerden çıkar`}
                        className="ml-1 rounded p-0.5 text-slate-600 transition hover:text-slate-300 focus:outline-none"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {filteredDistricts.length > 0 ? (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Özet
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{profile.name}</p>
                <ol className="mt-3 space-y-1.5 text-sm text-slate-300">
                  {filteredDistricts.map((d, i) => {
                    const ilce = d.ilce ?? d.full_name ?? 'İlçe'
                    const il = d.il != null && d.il !== '' ? d.il : ''
                    const label = il ? `${ilce} / ${il}` : ilce
                    const sc = formatScore(d.user_score_100)
                    return (
                      <li key={`prev-${d.full_name ?? ilce}-${i}`} className="tabular-nums">
                        {i + 1}. {label} — {sc}/100
                      </li>
                    )
                  })}
                </ol>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-900/55 px-6 text-base font-medium text-slate-100 shadow-inner shadow-black/20 transition hover:border-emerald-500/35 hover:bg-slate-800/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Share2 className="h-5 w-5 shrink-0 text-emerald-300/90" aria-hidden />
                Sonucumu paylaş
              </motion.button>
            </div>
          ) : null}

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
            Not: Adli olay yoğunluğu puanı, Adalet Bakanlığı&apos;nın bölgesel adalet
            istatistiklerinden türetilmiş proxy puandır; ilçe bazlı kesin suç oranı
            değildir. Pahalılık puanı, konut piyasası göstergeleri ters puanlanarak
            hesaplanmıştır. Yüksek puan daha avantajlı durumu ifade eder.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onChangePreferences}
              className="min-h-[48px] rounded-2xl border border-white/15 bg-transparent px-6 text-base font-medium text-slate-100 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Tercihleri değiştir
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onRestart}
              className="min-h-[48px] rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Baştan başla
            </motion.button>
          </div>
        </div>
      </motion.div>
      {/* Floating comparison bar */}
      <AnimatePresence>
        {comparisonSet.size >= 1 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 w-full max-w-lg px-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-slate-900/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden />
                {comparisonDistricts.map((d) => (
                  <span
                    key={districtKey(d)}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800/60 px-2 py-1 text-xs text-slate-200"
                  >
                    {d.ilce ?? d.full_name}
                    <button
                      type="button"
                      onClick={() => toggleComparison(districtKey(d))}
                      aria-label={`${d.ilce ?? d.full_name} karşılaştırmadan çıkar`}
                      className="ml-0.5 text-slate-500 hover:text-white"
                    >
                      <X className="h-3 w-3" aria-hidden />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setComparisonSet(new Set())}
                  className="rounded-lg px-2 py-1.5 text-xs text-slate-500 transition hover:text-slate-300"
                >
                  Temizle
                </button>
                <button
                  type="button"
                  onClick={() => setShowComparison(true)}
                  disabled={comparisonSet.size < 2}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Karşılaştır {comparisonSet.size >= 2 ? `(${comparisonSet.size})` : ''}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showComparison && comparisonDistricts.length >= 2 && (
        <ComparisonModal
          districts={comparisonDistricts}
          questions={questions}
          onClose={() => setShowComparison(false)}
        />
      )}
    </>
  )
}
