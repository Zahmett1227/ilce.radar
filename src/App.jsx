import { useCallback, useEffect, useState } from 'react'
import IdealDistrictWizard from './pages/IdealDistrictWizard'
import MethodologyPage from './pages/MethodologyPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import AboutPage from './pages/AboutPage'
import TermsPage from './pages/TermsPage'
import CookieConsent from './components/CookieConsent'
import ErrorBoundary from './components/ErrorBoundary'

function getRoute() {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/veri' || path === '/metodoloji') return 'methodology'
  if (path === '/gizlilik') return 'privacy'
  if (path === '/hakkinda') return 'about'
  if (path === '/kullanim-kosullari') return 'terms'
  return 'home'
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onPop = () => setRoute(getRoute())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const goHome = useCallback(() => {
    window.history.pushState(null, '', '/')
    setRoute('home')
  }, [])

  const goMethodology = useCallback(() => {
    window.history.pushState(null, '', '/veri')
    setRoute('methodology')
  }, [])

  let page
  if (route === 'methodology') page = <MethodologyPage onBack={goHome} />
  else if (route === 'privacy') page = <PrivacyPolicyPage onBack={goHome} />
  else if (route === 'about') page = <AboutPage onBack={goHome} />
  else if (route === 'terms') page = <TermsPage onBack={goHome} />
  else page = <IdealDistrictWizard onOpenMethodology={goMethodology} />

  return (
    <ErrorBoundary>
      {page}
      <CookieConsent />
    </ErrorBoundary>
  )
}
