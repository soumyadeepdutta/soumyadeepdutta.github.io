import { useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/Home'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import Footer from './components/Footer'
import Loader from './components/Loader'
import { useTheme } from './hooks/useTheme'
import { appNavigationEvents } from './utils/navigation'

const VIEW_MODE_KEY = 'portfolio-view-mode'

function readViewMode() {
  if (typeof window === 'undefined') return 'portfolio'
  try {
    return window.localStorage.getItem(VIEW_MODE_KEY) === 'brief'
      ? 'brief'
      : 'portfolio'
  } catch {
    return 'portfolio'
  }
}

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [viewMode, setViewMode] = useState(readViewMode)
  const [internalLoading, setInternalLoading] = useState(false)

  const changeViewMode = (nextMode) => {
    if (nextMode === viewMode) return
    setViewMode(nextMode)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  useEffect(() => {
    document.documentElement.dataset.view = viewMode
    try {
      window.localStorage.setItem(VIEW_MODE_KEY, viewMode)
    } catch {
      // Storage can be unavailable in privacy-restricted contexts.
    }
  }, [viewMode])

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

  const location = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const timer = setTimeout(() => {
      const revealEls = document.querySelectorAll('.reveal')
      revealEls.forEach(el => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [location.pathname])

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ type: 'spring', visualDuration: 0.4, bounce: 0 }}
    >
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="bg-dots" aria-hidden="true" />
      {internalLoading && <Loader mode="internal" />}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        viewMode={viewMode}
        onViewModeChange={changeViewMode}
      />
      <Routes>
        <Route path="/" element={<Home viewMode={viewMode} />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
      <Footer />
    </MotionConfig>
  )
}
