import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Droplets, ShieldCheck, Trees, Scale, Wallet, Users, Home, Sparkles } from 'lucide-react'
import districtsBundle from '../data/districts.json'
import PageShell from '../components/PageShell'
import SiteFooter from '../components/SiteFooter'
import { formatTRY, formatPopulation, formatScore } from '../utils/formatters'

const allDistricts = Array.isArray(districtsBundle)
  ? districtsBundle
  : (districtsBundle?.districts ?? [])

const METRICS = [
  { key: 'social_culture_score_20', label: 'Sosyal / Kültürel', Icon: Sparkles, color: 'emerald' },
  { key: 'sea_access_score_20', label: 'Denize Yakınlık', Icon: Droplets, color: 'cyan' },
  { key: 'earthquake_safety_score_20', label: 'Deprem Güvenliği', Icon: ShieldCheck, color: 'purple' },
  { key: 'low_crowding_score_20', label: 'Sakinlik', Icon: Trees, color: 'green' },
  { key: 'judicial_low_event_score_20', label: 'Adli Olay Azlığı', Icon: Scale, color: 'amber' },
  { key: 'affordability_score_20', label: 'Erişilebilir Konut', Icon: Wallet, color: 'pink' },
]

const BAR_COLOR = {
  emerald: 'from-emerald-400 to-emerald-500',
  cyan: 'from-cyan-400 to-cyan-500',
  purple: 'from-purple-400 to-purple-500',
  green: 'from-green-400 to-green-500',
  amber: 'from-amber-400 to-amber-500',
  pink: 'from-pink-400 to-pink-500',
}

function MetricRow({ label, Icon, color, value, max = 20 }) {
  const n = typeof value === 'number' ? value : 0
  const pct = Math.max(0, Math.min(100, Math.round((n / max) * 100)))
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} aria-hidden />
      <div className="flex-1">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-slate-400">{label}</span>
          <span className="tabular-nums text-slate-300">{n}/20</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800">
          <div
            className={`h-1.5 rounded-full bg-gradient-to-r ${BAR_COLOR[color]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function navigateHome() {
  window.history.pushState(null, '', '/')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const DEFAULT_TITLE = 'İlçe Radar — İdeal ilçeni bul'
const DEFAULT_DESC =
  "Önceliklerine göre Türkiye'de sana en uygun ilçeleri keşfet. 6 kriter, bölge filtresi ve yapay zeka destekli kişisel analiz."

export default function DistrictPage({ onHome }) {
  const districtId = useMemo(() => {
    const path = window.location.pathname
    const match = path.match(/^\/ilce\/(.+)$/)
    return match ? match[1] : null
  }, [])

  const district = useMemo(
    () => allDistricts.find((d) => d.district_id === districtId) ?? null,
    [districtId],
  )

  useEffect(() => {
    if (!district) {
      document.title = 'İlçe bulunamadı — İlçe Radar'
      return
    }
    document.title = `${district.ilce} / ${district.il} — İlçe Radar`
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      const kira = district.avg_rent_try ? formatTRY(district.avg_rent_try) : '?'
      metaDesc.content = `${district.ilce} (${district.il}) ilçe analizi: ${district.sea_category ?? ''}, deprem riski ${district.earthquake_risk_band ?? ''}, ortalama kira ${kira} TL. İlçe Radar ile kendi uyumunu keşfet.`
    }
    return () => {
      document.title = DEFAULT_TITLE
      const m = document.querySelector('meta[name="description"]')
      if (m) m.content = DEFAULT_DESC
    }
  }, [district])

  if (!district) {
    return (
      <PageShell onBack={onHome}>
        <div className="py-20 text-center">
          <p className="text-slate-400">İlçe bulunamadı.</p>
          <button
            type="button"
            onClick={onHome}
            className="mt-4 rounded-2xl border border-white/15 px-6 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            Ana sayfaya dön
          </button>
        </div>
      </PageShell>
    )
  }

  const score = typeof district.default_overall_score_100 === 'number'
    ? formatScore(district.default_overall_score_100)
    : null

  return (
    <PageShell onBack={onHome}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80">
            İlçe Analizi
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {district.ilce}
          </h1>
          <p className="mt-1 text-lg text-slate-400">{district.il}</p>

          {score && (
            <div className="mt-4 inline-flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums text-emerald-400">{score}</span>
              <span className="text-sm text-slate-500">/100 genel uyum skoru</span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {district.population_2024 != null && (
              <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-2.5">
                <Users className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} aria-hidden />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">Nüfus</p>
                  <p className="text-xs font-medium text-slate-300">
                    {formatPopulation(district.population_2024)}
                  </p>
                </div>
              </div>
            )}
            {district.sea_category && (
              <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-2.5">
                <Droplets className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} aria-hidden />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">Deniz</p>
                  <p className="text-xs font-medium text-slate-300">{district.sea_category}</p>
                </div>
              </div>
            )}
            {district.earthquake_risk_band && (
              <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} aria-hidden />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">Deprem</p>
                  <p className="text-xs font-medium text-slate-300">{district.earthquake_risk_band}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metric scores */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8">
          <h2 className="mb-5 text-sm font-semibold text-white">Kriter Skorları</h2>
          <div className="space-y-4">
            {METRICS.map(({ key, label, Icon, color }) => (
              <MetricRow
                key={key}
                label={label}
                Icon={Icon}
                color={color}
                value={district[key]}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-600">
            Her kriter 0–20 ölçeğinde puanlanmıştır. Yüksek puan daha avantajlı durumu ifade eder.
          </p>
        </div>

        {/* Housing data */}
        {(district.avg_rent_try || district.sale_price_m2_try || district.avg_home_price_try) && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <Home className="h-4 w-4 text-slate-500" strokeWidth={1.75} aria-hidden />
              Konut Piyasası
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {district.avg_rent_try != null && (
                <div className="rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-slate-600">Ort. Kira</dt>
                  <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-200">
                    {formatTRY(district.avg_rent_try)} TL
                  </dd>
                </div>
              )}
              {district.sale_price_m2_try != null && (
                <div className="rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-slate-600">Satış /m²</dt>
                  <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-200">
                    {formatTRY(district.sale_price_m2_try)} TL
                  </dd>
                </div>
              )}
              {district.avg_home_price_try != null && (
                <div className="rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-slate-600">Ort. Konut</dt>
                  <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-200">
                    {formatTRY(district.avg_home_price_try)} TL
                  </dd>
                </div>
              )}
              {district.amortization_years != null && (
                <div className="rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-slate-600">Amortisman</dt>
                  <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-200">
                    {district.amortization_years} yıl
                  </dd>
                </div>
              )}
              {district.rent_increase_1y_pct != null && (
                <div className="rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-slate-600">Kira Artışı (1y)</dt>
                  <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-200">
                    %{Math.round(district.rent_increase_1y_pct)}
                  </dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-xs text-slate-600">
              Kaynak: Endeksa. Veriler periyodik güncellenir; anlık piyasa koşullarını yansıtmayabilir.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 ring-1 ring-emerald-400/10 text-center">
          <p className="text-sm text-slate-300">
            <strong className="text-white">{district.ilce}</strong> senin için ne kadar uygun?
            Kendi önceliklerine göre kişisel sıralamana bak.
          </p>
          <button
            type="button"
            onClick={navigateHome}
            className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:opacity-90"
          >
            Kişisel analizi başlat →
          </button>
        </div>

        <SiteFooter />
      </motion.div>
    </PageShell>
  )
}
