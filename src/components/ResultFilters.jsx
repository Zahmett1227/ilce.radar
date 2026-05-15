import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { formatTRY } from '../utils/formatters.js'

const EQ_BANDS = [
  'Düşük',
  'Düşük-orta',
  'Orta',
  'Orta-yüksek',
  'Yüksek',
  'Yüksek+',
  'Çok yüksek',
]
const SEA_CATS = [
  'Kıyı / ada',
  'Kıyıya yakın metropol içi',
  'Aynı kıyı metrosu/ili ama içte',
  'İç',
  'İç kesim',
]

export const MAX_RENT_LIMIT = 75000
const MIN_RENT_LIMIT = 5000

export const defaultFilters = {
  maxRent: MAX_RENT_LIMIT,
  earthquakeBands: [],
  seaCategories: [],
  minPop: '',
  maxPop: '',
}

function toggleItem(arr, item) {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export function countActiveFilters(filters) {
  let n = 0
  if (filters.maxRent < MAX_RENT_LIMIT) n++
  if (filters.earthquakeBands.length > 0) n++
  if (filters.seaCategories.length > 0) n++
  if (filters.minPop !== '') n++
  if (filters.maxPop !== '') n++
  return n
}

export default function ResultFilters({ filters, onFiltersChange, resultCount, totalCount }) {
  const [open, setOpen] = useState(false)
  const activeCount = countActiveFilters(filters)
  const isFiltered = activeCount > 0

  function reset(e) {
    e.stopPropagation()
    onFiltersChange(defaultFilters)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 sm:p-5"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
            isFiltered
              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30'
              : 'bg-slate-800/60 text-slate-400'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">Filtrele</p>
            {isFiltered && (
              <span className="rounded-full bg-emerald-500/25 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-emerald-300">
                {activeCount}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {isFiltered
              ? `${resultCount} / ${totalCount} ilçe gösteriliyor`
              : 'Kira, deprem riski, konum ve nüfus'}
          </p>
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={reset}
            aria-label="Filtreleri sıfırla"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800/60 hover:text-slate-300 focus:outline-none"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
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
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-white/10 px-4 pb-5 pt-4 sm:px-5">
              {/* Max rent */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400">Maksimum aylık kira</p>
                  <p className="text-xs tabular-nums text-emerald-300/90">
                    {filters.maxRent >= MAX_RENT_LIMIT ? 'Sınırsız' : formatTRY(filters.maxRent)}
                  </p>
                </div>
                <input
                  type="range"
                  min={MIN_RENT_LIMIT}
                  max={MAX_RENT_LIMIT}
                  step={1000}
                  value={filters.maxRent}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, maxRent: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-400"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-600">
                  <span>{formatTRY(MIN_RENT_LIMIT)}</span>
                  <span>Sınırsız</span>
                </div>
              </div>

              {/* Earthquake bands */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-400">Deprem risk bandı</p>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="group"
                  aria-label="Deprem risk bandı seçimi"
                >
                  {EQ_BANDS.map((band) => {
                    const active = filters.earthquakeBands.includes(band)
                    return (
                      <button
                        key={band}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            earthquakeBands: toggleItem(filters.earthquakeBands, band),
                          })
                        }
                        className={`rounded-full border px-3 py-1 text-xs transition focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/60 ${
                          active
                            ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200'
                            : 'border-white/10 bg-slate-900/50 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        {band}
                      </button>
                    )
                  })}
                </div>
                {filters.earthquakeBands.length > 0 && (
                  <p className="mt-1.5 text-[10px] text-slate-600">
                    Yalnızca seçili bandlar gösterilir. Hiç seçilmezse hepsi gösterilir.
                  </p>
                )}
              </div>

              {/* Sea categories */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-400">Konumlanma türü</p>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="group"
                  aria-label="Konumlanma türü seçimi"
                >
                  {SEA_CATS.map((cat) => {
                    const active = filters.seaCategories.includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            seaCategories: toggleItem(filters.seaCategories, cat),
                          })
                        }
                        className={`rounded-full border px-3 py-1 text-xs transition focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/60 ${
                          active
                            ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-200'
                            : 'border-white/10 bg-slate-900/50 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Population range */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-400">Nüfus aralığı</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPop}
                    min={0}
                    onChange={(e) => onFiltersChange({ ...filters, minPop: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  />
                  <span className="shrink-0 text-xs text-slate-600">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPop}
                    min={0}
                    onChange={(e) => onFiltersChange({ ...filters, maxPop: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
