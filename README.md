# ilce.radar

Türkiye'de yaşam yeri tercihlerine göre ilçe öneren React + Vite uygulaması.

## Groq API (yapay zeka analizi)

Analiz istekleri yalnızca sunucu tarafından Groq'a iletilir. `GROQ_API_KEY` asla frontend bundle'ına yazılmaz.

### Yerel geliştirme

1. `.env.example` dosyasını `.env` olarak kopyalayın.
2. [Groq Console](https://console.groq.com/) üzerinden API anahtarı alın.
3. `.env` içine ekleyin:

```env
GROQ_API_KEY=your_groq_api_key_here
```

4. `npm run dev` — Vite dev sunucusu `/api/analyze` endpoint'ini yerelde de sunar.

Sonuçlar oturum boyunca `sessionStorage`'da saklanır; paylaşılabilir link için sonuç ekranındaki **Linki kopyala** butonunu kullanın.

Veri metodolojisi: `/veri` veya ana sayfadaki footer linki.

### Vercel deploy

Vercel Dashboard → Project Settings → Environment Variables bölümüne `GROQ_API_KEY` ekleyin (Production, Preview, Development).

Deploy sonrası frontend `POST /api/analyze` üzerinden `api/analyze.js` serverless fonksiyonunu çağırır.

### Güvenlik

- Gerçek API anahtarını yalnızca `.env` (yerel) ve Vercel Environment Variables (production) içinde tutun.
- `.env`, `.env.local`, `.env.*.local` dosyalarını asla commit etmeyin.
- `.env.example` yalnızca placeholder içerir; gerçek anahtar yazmayın.
- Anahtar yanlışlıkla paylaşıldıysa [Groq Console](https://console.groq.com/) üzerinden iptal edip yenisini oluşturun.

## Komutlar

```bash
npm install
npm run dev      # geliştirme
npm run build    # production build
npm run preview  # build önizleme
npm test         # birim testleri
```
