import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'
import { navigateToSection, navigateToTop } from '../utils/navigation'

const NAV_LINKS = [
  { href: '#about',          label: 'About'          },
  { href: '#skills',         label: 'Skills'         },
  { href: '#experience',     label: 'Experience'     },
  { href: '#projects',       label: 'Projects'       },
  { href: '#certifications', label: 'Certifications' },
  { href: '#education',      label: 'Education'      },
  { href: '#contact',        label: 'Contact'        },
]

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the active nav link based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.3 }
    )
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    navigateToSection(href)
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a
          href="#"
          className={styles.logo}
          onClick={e => {
            e.preventDefault()
            navigateToTop()
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
              className={`${styles.navLink} ${activeSection === href.slice(1) ? styles.active : ''}`}
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
              className={`${styles.mobileLink} ${activeSection === href.slice(1) ? styles.active : ''}`}
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
