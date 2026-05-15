import { motion } from 'framer-motion'
import { Check, MapPin } from 'lucide-react'
import {
  ALL_REGION_KEYS,
  ANY_REGION_KEY,
  REGION_OPTIONS,
  getSelectedRegionLabels,
} from '../utils/regions.js'

export default function RegionScreen({
  selectedRegions,
  onChangeSelectedRegions,
  onNext,
  onBack,
}) {
  const canContinue = selectedRegions.length > 0

  function toggleRegion(regionKey) {
    if (regionKey === ANY_REGION_KEY) {
      onChangeSelectedRegions([ANY_REGION_KEY])
      return
    }

    onChangeSelectedRegions((prev) => {
      const withoutAny = prev.filter((k) => k !== ANY_REGION_KEY)
      const alreadySelected = withoutAny.includes(regionKey)
      let next = alreadySelected
        ? withoutAny.filter((k) => k !== regionKey)
        : [...withoutAny, regionKey]
      const validOnly = next.filter((k) => ALL_REGION_KEYS.includes(k))
      if (validOnly.length === ALL_REGION_KEYS.length) {
        return [ANY_REGION_KEY]
      }
      return validOnly
    })
  }

  const summaryText = (() => {
    if (!canContinue) {
      return 'Devam etmek için en az bir seçenek seç.'
    }
    const labels = getSelectedRegionLabels(selectedRegions)
    return `Seçilen bölgeler: ${labels.join(', ')}`
  })()

  const anySelected = selectedRegions.includes(ANY_REGION_KEY)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[720px] px-4 py-6 sm:py-10"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-8 md:p-10">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
            <MapPin className="h-7 w-7" strokeWidth={1.75} aria-hidden />
          </div>
        </div>
        <h2 className="mt-5 text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Hangi Bölgeler Senin İçin Uygun?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-slate-400 sm:text-base">
          Birden fazla bölge seçebilirsin. Hepsi uygunsa &apos;Farketmez&apos; seçeneğini
          kullan.
        </p>

        <div className="mt-8">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleRegion(ANY_REGION_KEY)}
            className={[
              'flex w-full min-h-[64px] flex-col rounded-2xl border px-5 py-4 text-left transition',
              anySelected
                ? 'border-emerald-400/80 bg-gradient-to-b from-emerald-400/20 to-cyan-500/15 text-white ring-2 ring-emerald-400/45'
                : 'border-white/12 bg-slate-900/45 text-slate-200 hover:border-emerald-500/35 hover:bg-slate-800/50',
            ].join(' ')}
            aria-pressed={anySelected}
          >
            <span className="flex items-start justify-between gap-2">
              <span className="text-base font-semibold sm:text-lg">Farketmez</span>
              {anySelected ? (
                <Check
                  className="h-5 w-5 shrink-0 text-emerald-300"
                  strokeWidth={2.5}
                  aria-hidden
                />
              ) : null}
            </span>
            <span className="mt-1.5 text-xs leading-snug text-slate-400 sm:text-sm">
              Tüm Türkiye genelinde öneri al.
            </span>
          </motion.button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {REGION_OPTIONS.map((opt) => {
            const selected = selectedRegions.includes(opt.key)
            return (
              <motion.button
                key={opt.key}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleRegion(opt.key)}
                className={[
                  'flex min-h-[56px] flex-col rounded-2xl border px-4 py-3 text-left transition sm:min-h-[60px]',
                  selected
                    ? 'border-emerald-400/80 bg-gradient-to-b from-emerald-400/15 to-cyan-500/10 text-white ring-2 ring-emerald-400/40'
                    : 'border-white/10 bg-slate-900/40 text-slate-200 hover:border-emerald-500/35 hover:bg-slate-800/50',
                ].join(' ')}
                aria-pressed={selected}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold sm:text-base">{opt.label}</span>
                  {selected ? (
                    <Check
                      className="h-5 w-5 shrink-0 text-emerald-300"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  ) : null}
                </span>
                <span className="mt-1 text-xs leading-snug text-slate-400 sm:text-sm">
                  {opt.description}
                </span>
              </motion.button>
            )
          })}
        </div>

        <p
          className={[
            'mt-6 text-center text-xs sm:text-sm',
            canContinue ? 'text-slate-400' : 'text-slate-500',
          ].join(' ')}
        >
          {summaryText}
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
            disabled={!canContinue}
            onClick={onNext}
            className={[
              'min-h-[48px] rounded-2xl px-8 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
              canContinue
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'cursor-not-allowed bg-slate-700 text-slate-500',
            ].join(' ')}
          >
            İleri
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
