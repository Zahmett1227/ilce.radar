import { motion } from 'framer-motion'
import { Sparkles, Waves, ShieldCheck, Trees, Scale, Wallet } from 'lucide-react'
import SiteFooter from './SiteFooter.jsx'

const CRITERIA = [
  { icon: Sparkles, label: 'Sosyal' },
  { icon: Waves, label: 'Deniz' },
  { icon: ShieldCheck, label: 'Deprem' },
  { icon: Trees, label: 'Sakinlik' },
  { icon: Scale, label: 'Adli' },
  { icon: Wallet, label: 'Fiyat' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function StartScreen({ onStart, onOpenMethodology }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
      className="w-full max-w-[600px] px-6 py-16 sm:py-24"
    >
      {/* Brand badge */}
      <motion.div variants={item} className="mb-10 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-emerald-400 uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          İlçe Radar
        </span>
      </motion.div>

      {/* Heading */}
      <motion.div variants={item} className="text-center">
        <h1 className="text-[2.6rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[3.5rem]">
          İdeal İlçeni
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Birlikte Bulalım
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xs text-[15px] leading-relaxed text-slate-400 sm:text-base">
          Önceliklerine göre kişiselleştirilmiş öneri.
        </p>
        <p className="mt-1.5 text-[13px] text-slate-600">
          6 kriter · 249 ilçe · 7 bölge
        </p>
      </motion.div>

      {/* Criteria chips */}
      <motion.div variants={item} className="mt-9 flex flex-wrap justify-center gap-2">
        {CRITERIA.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/50 px-3 py-1.5 text-[11px] font-medium text-slate-500"
          >
            <Icon className="h-3 w-3 text-slate-600" strokeWidth={1.75} aria-hidden />
            {label}
          </span>
        ))}
      </motion.div>

      {/* Divider */}
      <motion.div variants={item} className="my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/8" />
        <div className="h-1 w-1 rounded-full bg-white/15" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/8" />
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-12 py-[15px] text-[15px] font-semibold text-slate-950 shadow-[0_4px_28px_rgba(52,211,153,0.28)] transition-shadow hover:shadow-[0_6px_44px_rgba(52,211,153,0.45)]"
        >
          <span className="flex items-center gap-2">
            Başla
            <span className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </motion.button>
        <p className="text-[11px] tracking-widest text-slate-600 uppercase">
          Bölge seçimi · 6 soru · Kişisel sonuç
        </p>
      </motion.div>

      {onOpenMethodology ? <SiteFooter onOpenMethodology={onOpenMethodology} /> : null}
    </motion.div>
  )
}
