import { useEffect, useRef, useState } from 'react'
import { CONSENT_CHANGE_EVENT, getConsent, injectAdSense } from '../utils/consent'

const PUBLISHER_ID = 'ca-pub-2788592361348858'

export default function AdUnit({ slot, className = '' }) {
  const [consent, setConsent] = useState(() => getConsent())
  const pushed = useRef(false)

  useEffect(() => {
    const handler = () => setConsent(getConsent())
    window.addEventListener(CONSENT_CHANGE_EVENT, handler)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler)
  }, [])

  useEffect(() => {
    if (consent !== 'accepted' || pushed.current) return
    pushed.current = true
    injectAdSense().then(() => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch { /* adsbygoogle not ready */ }
    })
  }, [consent])

  if (consent !== 'accepted') return null

  return (
    <div className={`overflow-hidden text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
