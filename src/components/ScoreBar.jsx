import { motion } from 'framer-motion'

export default function ScoreBar({ label, value, max = 20 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="tabular-nums text-slate-300">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400/90 to-cyan-400/90"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 20, delay: 0.05 }}
        />
      </div>
    </div>
  )
}
