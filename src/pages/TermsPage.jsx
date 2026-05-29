import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-400">{children}</div>
    </section>
  )
}

export default function TermsPage({ onBack }) {
  return (
    <PageShell onBack={onBack}>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80">
          Hukuki Bildirim
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Kullanım Koşulları</h1>
        <p className="mt-2 text-xs text-slate-500">Son güncelleme: 29 Mayıs 2026</p>

        <Section title="1. Hizmetin Niteliği">
          <p>
            İlçe Radar, Türkiye&apos;deki ilçeler hakkında kamuya açık ve derlenmiş veriler
            temelinde kişiselleştirilmiş sıralama sunan bilgi amaçlı bir araçtır. Sunulan
            içerik; hukuki, finansal, yatırım veya gayrimenkul danışmanlığı niteliği taşımaz.
          </p>
        </Section>

        <Section title="2. Sorumluluk Reddi">
          <p>
            Site&apos;nin sunduğu bilgiler &quot;olduğu gibi&quot; sunulmaktadır. Veri setindeki
            eksiklik, hata veya güncel olmayan bilgilerden kaynaklanabilecek kayıplar için
            sorumluluk kabul edilmez.
          </p>
          <p>
            Yapay zeka tarafından üretilen yorumlar otomatik olarak oluşturulur; uzman
            değerlendirmesinin yerini tutmaz. Önemli kararlar vermeden önce ilgili uzmanlara,
            belediye kayıtlarına ve güncel piyasa verilerine başvurmanızı öneririz.
          </p>
        </Section>

        <Section title="3. Veri Doğruluğu">
          <p>
            Deprem risk bantları, adli olay yoğunluğu ve konut fiyatları periyodik olarak
            güncellenir ancak anlık değişimleri yansıtmayabilir. Adli olay yoğunluğu puanı,
            Adalet Bakanlığı bölgesel istatistiklerinden türetilmiş bir proxy değerdir; ilçe
            bazlı kesin suç oranı değildir.
          </p>
        </Section>

        <Section title="4. Fikri Mülkiyet">
          <p>
            Site tasarımı, kodu ve derleme metodolojisi geliştiriciye aittir. Kaynak veri setleri
            ilgili kurumların lisans koşullarına tabidir. İzinsiz veri toplama (scraping) yasaktır.
          </p>
        </Section>

        <Section title="5. Hizmet Sürekliliği">
          <p>
            Site herhangi bir bildirimde bulunmaksızın değiştirilebilir veya erişime
            kapatılabilir. Vercel altyapısı kaynaklı geçici kesintilerden sorumluluk
            kabul edilmez.
          </p>
        </Section>

        <Section title="6. Uygulanacak Hukuk">
          <p>
            Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul
            mahkemeleri yetkilidir.
          </p>
        </Section>

        <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
          Siteyi kullanmaya devam etmeniz bu koşulları kabul ettiğiniz anlamına gelir.
          Koşullar zaman zaman güncellenebilir; güncel hâli bu sayfada yayımlanır.
        </p>
      </motion.article>
    </PageShell>
  )
}
