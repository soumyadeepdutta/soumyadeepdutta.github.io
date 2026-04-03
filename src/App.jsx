import { Suspense, lazy, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Loader from './components/Loader'
import { useTheme } from './hooks/useTheme'
import { appNavigationEvents } from './utils/navigation'

const NetworkScene = lazy(() => import('./components/NetworkScene'))

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [initialLoading, setInitialLoading] = useState(true)
  const [internalLoading, setInternalLoading] = useState(false)

  useEffect(() => {
    let isDone = false

    const finishInitialLoad = () => {
      if (isDone) return
      isDone = true
      setInitialLoading(false)
    }

    // Fallback ensures loader always exits even if a load event is missed.
    const fallbackTimer = window.setTimeout(finishInitialLoad, 1200)

    if (document.readyState === 'complete') {
      finishInitialLoad()
    } else {
      window.addEventListener('load', finishInitialLoad, { once: true })
    }

    return () => {
      window.removeEventListener('load', finishInitialLoad)
      window.clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    let endTimer

    const handleNavigationStart = () => {
      setInternalLoading(true)
      window.clearTimeout(endTimer)
    }

    const handleNavigationEnd = () => {
      window.clearTimeout(endTimer)
      endTimer = window.setTimeout(() => setInternalLoading(false), 100)
    }

    window.addEventListener(appNavigationEvents.start, handleNavigationStart)
    window.addEventListener(appNavigationEvents.end, handleNavigationEnd)

    return () => {
      window.removeEventListener(appNavigationEvents.start, handleNavigationStart)
      window.removeEventListener(appNavigationEvents.end, handleNavigationEnd)
      window.clearTimeout(endTimer)
    }
  }, [])

  if (initialLoading) {
    return <Loader mode="initial" />
  }

  return (
    <>
      <Suspense fallback={null}>
        <NetworkScene theme={theme} className="network-scene" />
      </Suspense>
      {internalLoading && <Loader mode="internal" />}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
