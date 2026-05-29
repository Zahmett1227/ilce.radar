function navigateTo(path) {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const linkClass =
  'text-xs text-slate-600 underline-offset-2 transition hover:text-emerald-400/80 hover:underline'

export default function SiteFooter({ onOpenMethodology }) {
  return (
    <footer className="mt-10 pb-6 text-center">
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5" aria-label="Alt navigasyon">
        <button
          type="button"
          onClick={onOpenMethodology ?? (() => navigateTo('/veri'))}
          className={linkClass}
        >
          Veri ve metodoloji
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/gizlilik')}
          className={linkClass}
        >
          Gizlilik Politikası
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/hakkinda')}
          className={linkClass}
        >
          Hakkında
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/kullanim-kosullari')}
          className={linkClass}
        >
          Kullanım Koşulları
        </button>
      </nav>
    </footer>
  )
}
