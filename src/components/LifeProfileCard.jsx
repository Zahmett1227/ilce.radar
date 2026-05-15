import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'

export default function LifeProfileCard({ profile }) {
  if (!profile?.name) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 p-6 shadow-lg ring-1 ring-white/10 sm:p-7"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 20% 0%, rgba(52, 211, 153, 0.35), transparent)',
        }}
        aria-hidden
      />
      <div className="relative flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30">
          <Compass className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/80">
            Yaşam Profilin
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
            {profile.name}
          </h3>
          {profile.description ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
              {profile.description}
            </p>
          ) : null}
        </div>
      </div>
    </motion.section>
  )
}
