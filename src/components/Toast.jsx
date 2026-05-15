import { AnimatePresence, motion } from 'framer-motion'

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 max-w-[min(92vw,360px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-900/95 px-4 py-3 text-center text-sm text-slate-100 shadow-xl shadow-black/40 ring-1 ring-emerald-500/20 backdrop-blur-md"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
