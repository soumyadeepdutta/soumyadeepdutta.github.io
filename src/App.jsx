import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
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

  const location = useLocation()

  // Intersection Observer for scroll-reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Optionally unobserve if you only want the animation to happen once
            // observer.unobserve(entry.target) 
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    // Using a timeout allows the DOM to render the new route's elements before observing
    const timer = setTimeout(() => {
      const revealEls = document.querySelectorAll('.reveal')
      revealEls.forEach(el => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [location.pathname, initialLoading])

  if (initialLoading) {
    return <Loader mode="initial" />
  }

  return (
    <>
      <div className="bg-dots" aria-hidden="true" />
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
