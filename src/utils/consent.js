const CONSENT_KEY = 'ilceradar_consent'
const PUBLISHER_ID = 'ca-pub-2788592361348858'
export const CONSENT_CHANGE_EVENT = 'consent-change'

export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value)
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT))
  } catch { /* quota / private mode */ }
}

export function hasConsent() {
  return getConsent() === 'accepted'
}

export function hasDecided() {
  return getConsent() !== null
}

let scriptInjected = false
let scriptLoadPromise = null

export function injectAdSense() {
  if (scriptInjected) return scriptLoadPromise
  scriptInjected = true
  scriptLoadPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.async = true
    script.crossOrigin = 'anonymous'
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`
    script.onload = resolve
    script.onerror = resolve
    document.head.appendChild(script)
  })
  return scriptLoadPromise
}
