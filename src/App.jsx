import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import Footer from './components/Footer'
import Loader from './components/Loader'
import { useTheme } from './hooks/useTheme'
import { appNavigationEvents } from './utils/navigation'

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
      <div className="bg-squares" aria-hidden="true" />
      <div className="bg-squares-secondary" aria-hidden="true" />
      {internalLoading && <Loader mode="internal" />}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
      <Footer />
    </>
  )
}
