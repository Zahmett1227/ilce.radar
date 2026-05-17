export default function SiteFooter({ onOpenMethodology }) {
  return (
    <footer className="mt-10 pb-6 text-center">
      <button
        type="button"
        onClick={onOpenMethodology}
        className="text-xs text-slate-600 underline-offset-2 transition hover:text-emerald-400/80 hover:underline"
      >
        Veri kaynakları ve metodoloji
      </button>
    </footer>
  )
}
