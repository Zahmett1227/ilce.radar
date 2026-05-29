import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function PageShell({ onBack, backLabel = 'Ana sayfaya dön', children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-svh bg-[#050810] text-slate-100"
    >
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
          {backLabel}
        </button>
        {children}
      </main>
    </motion.div>
  )
}
