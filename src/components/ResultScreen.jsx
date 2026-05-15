import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'
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
              {districts.map((d, i) => (
                <ResultCard
                  key={`${d.district_id ?? d.full_name ?? i}-${i}`}
                  rank={i + 1}
                  district={d}
                  answers={answers}
                  questions={questions}
                  motionIndex={i}
                />
              ))}
            </div>
          )}

          {districts.length > 0 ? (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Özet
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{profile.name}</p>
                <ol className="mt-3 space-y-1.5 text-sm text-slate-300">
                  {districts.map((d, i) => {
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
    </>
  )
}
