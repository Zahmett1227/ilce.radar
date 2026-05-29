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

export default function PrivacyPolicyPage({ onBack }) {
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
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Gizlilik Politikası</h1>
        <p className="mt-2 text-xs text-slate-500">Son güncelleme: 29 Mayıs 2026</p>

        <Section title="1. Veri Sorumlusu">
          <p>
            İlçe Radar (&quot;Site&quot;), bireysel bir geliştirici tarafından işletilmektedir.
            Kişisel verilerle ilgili taleplerinizi aşağıdaki iletişim bölümünden iletebilirsiniz.
          </p>
        </Section>

        <Section title="2. Topladığımız Veriler">
          <p>
            Site, kullanıcı hesabı oluşturmaz ve doğrudan kişisel veri toplamaz. Aşağıdaki veriler
            yalnızca teknik işleyiş kapsamında işlenir:
          </p>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              <strong className="text-slate-300">Çerez ve yerel depolama:</strong> Çerez tercihiniz,
              favori ilçeleriniz ve sihirbaz oturumu verileri tarayıcınızda (
              <code className="rounded bg-white/5 px-1 text-xs text-slate-300">localStorage</code> /{' '}
              <code className="rounded bg-white/5 px-1 text-xs text-slate-300">sessionStorage</code>
              ) saklanır; sunucularımıza gönderilmez.
            </li>
            <li>
              <strong className="text-slate-300">Yapay zeka istekleri:</strong> Kişisel analiz
              oluşturulurken tercihleriniz (bölge ve kriter puanları) sunucuya iletilir. Bu veriler
              saklanmaz; yalnızca Groq API&apos;sine iletilip yanıt döndürülür.
            </li>
            <li>
              <strong className="text-slate-300">Sunucu günlükleri:</strong> IP adresi ve istek
              zamanı, kötüye kullanımı önlemek amacıyla kısa süreli oran sınırlama için tutulur.
            </li>
          </ul>
        </Section>

        <Section title="3. Çerezler">
          <p>
            Sitemiz iki tür çerez kullanır:
          </p>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              <strong className="text-slate-300">Zorunlu çerezler:</strong> Tercih kaydetme
              (çerez onayı, favoriler). Reklam amacı taşımaz.
            </li>
            <li>
              <strong className="text-slate-300">Reklam çerezleri (isteğe bağlı):</strong> Yalnızca
              onay vermeniz durumunda Google AdSense tarafından yüklenir. Bu çerezleri reddetmeniz
              hâlinde reklam gösterilmez.
            </li>
          </ul>
        </Section>

        <Section title="4. Google AdSense ve Reklam Çerezleri">
          <p>
            Onay vermeniz durumunda sitemizde Google AdSense aracılığıyla reklamlar görüntülenir.
            Google, reklam hizmetini sunmak için kendi çerezlerini (ör.{' '}
            <code className="rounded bg-white/5 px-1 text-xs text-slate-300">IDE</code>,{' '}
            <code className="rounded bg-white/5 px-1 text-xs text-slate-300">__gads</code>,{' '}
            <code className="rounded bg-white/5 px-1 text-xs text-slate-300">NID</code>) kullanır.
            Bu çerezler Google&apos;ın kendi gizlilik politikasına tabidir.
          </p>
          <p>
            Google&apos;ın reklam çerezlerini yönetmek için{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              Google Reklam Ayarları
            </a>{' '}
            sayfasını kullanabilirsiniz.
          </p>
        </Section>

        <Section title="5. Groq Yapay Zeka Servisi">
          <p>
            Kişisel analiz metni, sunucu üzerinden Groq LLC&apos;ye ait API aracılığıyla üretilir.
            API anahtarı tarayıcıya iletilmez. Groq&apos;un veri işleme koşulları için{' '}
            <a
              href="https://groq.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              Groq Gizlilik Politikası
            </a>
            &apos;nı inceleyebilirsiniz.
          </p>
        </Section>

        <Section title="6. Verilerin Saklanması ve Aktarımı">
          <p>
            Kullanıcı tercihleri yalnızca kendi cihazınızda saklanır. Sunucu tarafında kalıcı
            kullanıcı verisi tutulmaz. Site Vercel altyapısında barındırılmaktadır; Vercel&apos;in
            veri işleme koşulları için{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              Vercel Gizlilik Politikası
            </a>
            &apos;nı inceleyebilirsiniz.
          </p>
        </Section>

        <Section title="7. KVKK Kapsamındaki Haklarınız">
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 11. maddesi uyarınca
            aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini isteme</li>
            <li>İşlemeye itiraz etme</li>
          </ul>
          <p>
            Bu hakları kullanmak için aşağıdaki iletişim kanalından bize ulaşabilirsiniz.
          </p>
        </Section>

        <Section title="8. Çerez Tercihlerini Değiştirme">
          <p>
            Tarayıcınızın çerez ayarlarını değiştirerek veya{' '}
            <code className="rounded bg-white/5 px-1 text-xs text-slate-300">
              localStorage
            </code>
            &apos;dan{' '}
            <code className="rounded bg-white/5 px-1 text-xs text-slate-300">
              ilceradar_consent
            </code>{' '}
            anahtarını silerek tercihlerinizi sıfırlayabilirsiniz. Sayfa yenilendikten sonra
            çerez bildirimi yeniden görüntülenecektir.
          </p>
        </Section>

        <Section title="9. İletişim">
          <p>
            Gizlilik ile ilgili sorularınız için GitHub üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </Section>

        <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
          Bu politika değişebilir. Önemli değişiklikler olduğunda bu sayfada güncelleme tarihi
          ile birlikte yayımlanır.
        </p>
      </motion.article>
    </PageShell>
  )
}
