import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import IdealDistrictWizard from './pages/IdealDistrictWizard'
import MethodologyPage from './pages/MethodologyPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import AboutPage from './pages/AboutPage'
import TermsPage from './pages/TermsPage'
import CookieConsent from './components/CookieConsent'
import ErrorBoundary from './components/ErrorBoundary'
import { trackPageView } from './utils/analytics.js'

const DistrictPage = lazy(() => import('./pages/DistrictPage'))

function getRoute() {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/veri' || path === '/metodoloji') return 'methodology'
  if (path === '/gizlilik') return 'privacy'
  if (path === '/hakkinda') return 'about'
  if (path === '/kullanim-kosullari') return 'terms'
  if (path.startsWith('/ilce/')) return 'district'
  return 'home'
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onPop = () => {
      const next = getRoute()
      setRoute(next)
      trackPageView(window.location.pathname)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const goHome = useCallback(() => {
    window.history.pushState(null, '', '/')
    setRoute('home')
    trackPageView('/')
  }, [])

  const goMethodology = useCallback(() => {
    window.history.pushState(null, '', '/veri')
    setRoute('methodology')
    trackPageView('/veri')
  }, [])

  let page
  if (route === 'methodology') page = <MethodologyPage onBack={goHome} />
  else if (route === 'privacy') page = <PrivacyPolicyPage onBack={goHome} />
  else if (route === 'about') page = <AboutPage onBack={goHome} />
  else if (route === 'terms') page = <TermsPage onBack={goHome} />
  else if (route === 'district')
    page = (
      <ErrorBoundary>
        <Suspense fallback={null}>
          <DistrictPage onHome={goHome} />
        </Suspense>
      </ErrorBoundary>
    )
  else page = <IdealDistrictWizard onOpenMethodology={goMethodology} />

  return (
    <ErrorBoundary>
      {page}
      <CookieConsent />
    </ErrorBoundary>
  )
}
