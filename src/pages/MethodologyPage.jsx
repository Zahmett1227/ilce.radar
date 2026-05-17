import { motion } from 'framer-motion'
import { ArrowLeft, Database, Scale, Shield } from 'lucide-react'

function Block({ icon: Icon, iconClass, title, children }) {
  return (
    <div className="flex gap-3">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} aria-hidden />
      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <div className="mt-2 text-sm leading-relaxed text-slate-400">{children}</div>
      </div>
    </div>
  )
}

export default function MethodologyPage({ onBack }) {
  return (
    <motion.div className="min-h-svh bg-[#050810] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(148,163,184,0.055) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Ana sayfaya dön
        </button>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80">
            Veri ve metodoloji
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Skorlar nasıl hesaplanır?
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            İlçe Radar, yaşam tercihlerini 6 boyutta puanlayıp ilçe veri setiyle eşleştirir.
            Sonuçlar bir danışmanlık hizmeti değil; şeffaf veri ve ağırlıklı model çıktısıdır.
          </p>

          <section className="mt-8 space-y-6">
            <Block icon={Database} iconClass="text-emerald-400" title="Veri kaynakları">
              <ul className="list-disc space-y-1 pl-4">
                <li>SEGE ve bölgesel gelişmişlik göstergeleri</li>
                <li>Endeksa konut piyasası (kira, satış m², amortisman)</li>
                <li>Deprem risk bantları ve jeolojik sınıflandırma</li>
                <li>Nüfus (2024) ve kıyı/deniz erişim kategorileri</li>
                <li>
                  Adli olay yoğunluğu: Adalet Bakanlığı bölgesel istatistiklerinden türetilmiş
                  proxy — ilçe bazlı kesin suç oranı değildir
                </li>
              </ul>
            </Block>

            <Block icon={Scale} iconClass="text-cyan-400" title="Skorlama modeli">
              <p>
                Her kriter için 1–5 arası önem verirsin. İlçenin ilgili metrik skoru (0–20 ölçeği)
                bu ağırlıkla çarpılır; toplam ağırlığa bölünerek 0–100 uyum skoru üretilir.
                Pahalılık metriği ters yorumlanır: yüksek skor daha erişilebilir konut anlamına
                gelir.
              </p>
            </Block>

            <Block icon={Shield} iconClass="text-purple-400" title="Yapay zeka analizi">
              <p>
                Kişisel yorum metni Groq üzerinden sunucu tarafında üretilir; API anahtarı
                tarayıcıya gönderilmez. Aynı tercih kombinasyonu için sonuçlar önbelleğe
                alınabilir.
              </p>
            </Block>
          </section>

          <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
            Veri seti periyodik güncellenir. Karar vermeden önce resmi kurumlar, emlak
            uzmanları ve yerel araştırmalarla doğrulama yapmanı öneririz.
          </p>
        </motion.article>
      </main>
    </motion.div>
  )
}
