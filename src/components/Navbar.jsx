import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'
import { navigateToSection, navigateToTop } from '../utils/navigation'

const NAV_LINKS = [
  { href: '#about',          label: 'About'          },
  { href: '#skills',         label: 'Skills'         },
  { href: '#experience',     label: 'Experience'     },
  { href: '#projects',       label: 'Projects'       },
  { href: '#tools',          label: 'Tools'          },
  { href: '#certifications', label: 'Certifications' },
  { href: '#education',      label: 'Education'      },
  { href: '#contact',        label: 'Contact'        },
  { href: '/blog',           label: 'Blog'           },
]

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the active nav link based on scroll position
  useEffect(() => {
    if (location.pathname !== '/') return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.3 }
    )
    NAV_LINKS.forEach(({ href }) => {
      if (href.startsWith('#')) {
        const el = document.querySelector(href)
        if (el) observer.observe(el)
      }
    })
    return () => observer.disconnect()
  }, [location.pathname])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate(`/${href}`)
        // The App will need to handle scrolling to hash on load, or the user can click again
      } else {
        navigateToSection(href)
      }
    } else {
      navigate(href)
    }
  }

  // Handle hash scrolling on page load/navigation if needed
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => navigateToSection(location.hash), 100)
    }
  }, [location.pathname, location.hash])

  const isActive = (href) => {
    if (href.startsWith('#')) {
      return location.pathname === '/' && activeSection === href.slice(1)
    }
    return location.pathname.startsWith(href)
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a
          href="/"
          className={styles.logo}
          onClick={e => {
            e.preventDefault()
            if (location.pathname !== '/') {
              navigate('/')
            } else {
              navigateToTop()
            }
          }}
        >
          <span className={styles.logoText}>SD</span>
          <span className={styles.logoDot}>.</span>
        </a>

        {/* Desktop nav */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`${styles.navLink} ${isActive(href) ? styles.active : ''}`}
              onClick={e => { e.preventDefault(); handleNavClick(href) }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <a
            href="https://github.com/soumyadeepdutta"
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}
          >
            GitHub
          </a>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`${styles.mobileLink} ${isActive(href) ? styles.active : ''}`}
              onClick={e => { e.preventDefault(); handleNavClick(href) }}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
