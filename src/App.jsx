import { useCallback, useEffect, useState } from 'react'
import IdealDistrictWizard from './pages/IdealDistrictWizard'
import MethodologyPage from './pages/MethodologyPage'

function getRoute() {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/veri' || path === '/metodoloji') return 'methodology'
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

  if (route === 'methodology') {
    return <MethodologyPage onBack={goHome} />
  }

  return <IdealDistrictWizard onOpenMethodology={goMethodology} />
}
