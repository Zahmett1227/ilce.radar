import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { hasDecided, setConsent } from '../utils/consent'

function navigateTo(path) {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !hasDecided())

  const accept = () => {
    setConsent('accepted')
    setVisible(false)
  }

  const reject = () => {
    setConsent('rejected')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          role="dialog"
          aria-modal="false"
          aria-label="Çerez bildirimi"
        >
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/15 bg-slate-900/95 px-5 py-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <p className="text-sm leading-relaxed text-slate-300">
              Siteyi geliştirmek ve kişiselleştirilmiş reklam göstermek amacıyla Google
              AdSense dahil üçüncü taraf çerezler kullanıyoruz.{' '}
              <button
                type="button"
                onClick={() => navigateTo('/gizlilik')}
                className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
              >
                Gizlilik Politikası
              </button>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={accept}
                className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Kabul Et
              </button>
              <button
                type="button"
                onClick={reject}
                className="rounded-xl border border-white/15 px-5 py-2 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Yalnızca Zorunlu
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
