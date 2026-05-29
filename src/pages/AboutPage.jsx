import { motion } from 'framer-motion'
import { Database, Globe, Sparkles } from 'lucide-react'
import PageShell from '../components/PageShell'

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

export default function AboutPage({ onBack }) {
  return (
    <PageShell onBack={onBack}>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80">
          Proje
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Hakkında</h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          İlçe Radar, Türkiye&apos;de yaşayacağınız yeri seçerken kişisel önceliklerinizi merkeze
          alan bağımsız, kâr amacı gütmeyen bir araçtır. Herhangi bir emlak firması, kamu kurumu
          veya yatırım platformuyla bağlantısı bulunmamaktadır.
        </p>

        <section className="mt-8 space-y-6">
          <Block icon={Sparkles} iconClass="text-emerald-400" title="Nasıl çalışır?">
            <p>
              Sosyal imkânlar, denize yakınlık, deprem güvenliği, sakinlik, adli olay azlığı ve
              konut erişilebilirliği olmak üzere 6 kriter için 1–5 arası önem puanı girersiniz.
              Sistem bu puanları, derlediğimiz ilçe veri setiyle eşleştirerek size en uygun 20
              ilçeyi sıralar. İsteğe bağlı olarak Groq yapay zeka modelinden kişiselleştirilmiş
              yorum talep edebilirsiniz.
            </p>
          </Block>

          <Block icon={Database} iconClass="text-cyan-400" title="Veri kaynakları">
            <p>
              Veri seti; SEGE bölgesel gelişmişlik endeksleri, Endeksa konut piyasası verileri,
              nüfus istatistikleri, deprem risk bantları ve kıyı sınıflandırmalarından
              derlenmektedir. Veri belirli aralıklarla güncellenir; anlık piyasa koşullarını veya
              resmi suç istatistiklerini yansıtmaz.
            </p>
          </Block>

          <Block icon={Globe} iconClass="text-purple-400" title="İletişim">
            <p>
              Hata bildirimi, veri düzeltme talebi veya öneri için GitHub deposunu
              ziyaret edebilirsiniz. Gizlilik ile ilgili talepler için lütfen{' '}
              <button
                type="button"
                onClick={() => {
                  window.history.pushState(null, '', '/gizlilik')
                  window.dispatchEvent(new PopStateEvent('popstate'))
                }}
                className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
              >
                Gizlilik Politikası
              </button>
              &apos;ndaki iletişim bölümüne bakınız.
            </p>
          </Block>
        </section>

        <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
          İlçe Radar, sunduğu bilgilerin doğruluğunu garanti etmez. Nihai karar öncesinde resmi
          kaynaklar ve uzman görüşleriyle doğrulama yapmanızı öneririz.
        </p>
      </motion.article>
    </PageShell>
  )
}
