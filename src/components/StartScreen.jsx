import { motion } from 'framer-motion'

export default function StartScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[720px] px-4 py-8 sm:py-12"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-500/5 ring-1 ring-white/10 backdrop-blur-xl sm:p-10 md:p-12">
        <h1 className="text-balance text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          Senin İçin En İdeal İlçeyi Bulalım
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-slate-300 sm:text-lg">
          Önce yaşamak istediğin bölgeyi seç; ardından birkaç kısa tercih sorusunu
          yanıtla. Sosyal hayat, deniz, deprem güvenliği, sakinlik, adli olay
          yoğunluğu ve pahalılık gibi kriterlere göre sana en uygun 5 ilçeyi
          sıralayalım.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full min-h-[52px] rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 text-lg font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-400/40 sm:w-auto sm:min-w-[200px]"
          >
            Başla
          </motion.button>
          <p className="max-w-md text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
            Sonuçlar, ilçelerin karşılaştırmalı veri skorları ve senin
            önceliklerine göre hesaplanır.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
