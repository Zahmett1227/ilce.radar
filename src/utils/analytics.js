import { CONSENT_CHANGE_EVENT, getConsent } from './consent.js'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let initialized = false

function load() {
  if (initialized || !GA_ID) return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
}

export function initAnalytics() {
  if (getConsent() === 'accepted') load()
  window.addEventListener(CONSENT_CHANGE_EVENT, () => {
    if (getConsent() === 'accepted') load()
  })
}

export function trackPageView(path) {
  if (typeof window.gtag !== 'function' || !GA_ID) return
  window.gtag('event', 'page_view', { page_path: path })
}
