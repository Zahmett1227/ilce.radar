import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-slate-400">
            Bu bölüm yüklenirken bir sorun oluştu.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
          >
            Yeniden Dene
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
