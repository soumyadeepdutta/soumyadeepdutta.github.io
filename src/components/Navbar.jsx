import { useState, useEffect, useCallback, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  stagger,
} from 'motion/react'
import { useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'
import { navigateToSection, navigateToTop } from '../utils/navigation'
import { isModifiedClick, navigateTyped } from '../utils/viewTransitions'
import {
  DESK_DRAW_DELAY_MS,
  PILL_EXPAND_MS,
  startDeskDraw,
} from '../utils/introChoreography'

const PORTFOLIO_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Story' },
  { href: '/blog', label: 'Notes' },
  { href: '#contact', label: 'Say hi' },
]

const BRIEF_LINKS = [
  { href: '#simple-profile', label: 'Profile' },
  { href: '#simple-experience', label: 'Experience' },
  { href: '#simple-systems', label: 'Systems' },
  { href: '#simple-skills', label: 'Skills' },
  { href: '#simple-contact', label: 'Contact' },
  { href: '/blog', label: 'Notes' },
]

const RESUME_HREF = 'https://www.linkedin.com/in/soumyadeep-dutta/'
const DESKTOP_MQ = '(min-width: 821px)'

const easeOut = [0.22, 1, 0.36, 1]
const brandFlySpring = { type: 'spring', visualDuration: 0.72, bounce: 0.04 }

function readInitialIntroPhase(viewMode) {
  if (typeof window === 'undefined') return 'done'
  if (viewMode === 'brief') return 'done'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'done'
  }
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path !== '/') return 'done'
  return 'hold'
}

function measureBrandFly(splashEl, brandEl) {
  const from = splashEl.getBoundingClientRect()
  const to = brandEl.getBoundingClientRect()
  if (from.width < 1 || to.width < 1) return null

  const scale = to.width / from.width
  const x = to.left + to.width / 2 - (from.left + from.width / 2)
  const y = to.top + to.height / 2 - (from.top + from.height / 2)
  return { x, y, scale }
}

export default function Navbar({
  theme,
  toggleTheme,
  viewMode = 'portfolio',
  onViewModeChange,
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [pillHovered, setPillHovered] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_MQ).matches : true
  )
  const [activeSection, setActiveSection] = useState('')
  const [introPhase, setIntroPhase] = useState(() =>
    readInitialIntroPhase(viewMode)
  )
  const [flyTarget, setFlyTarget] = useState(null)
  const prefersReduced = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()
  const brandRef = useRef(null)
  const splashWordRef = useRef(null)
  const navLinks = viewMode === 'brief' ? BRIEF_LINKS : PORTFOLIO_LINKS

  const finishIntro = useCallback(() => {
    setIntroPhase('done')
  }, [])

  useEffect(() => {
    if (prefersReduced && introPhase !== 'done') finishIntro()
  }, [prefersReduced, introPhase, finishIntro])

  useEffect(() => {
    if (viewMode === 'brief' && introPhase !== 'done') finishIntro()
  }, [viewMode, introPhase, finishIntro])

  // hold → fly into the real nav brand label
  useEffect(() => {
    if (introPhase !== 'hold') return undefined

    let cancelled = false
    let startTimer
    let holdTimer

    const beginHoldClock = () => {
      holdTimer = window.setTimeout(() => {
        if (cancelled) return
        const splash = splashWordRef.current
        const brand = brandRef.current
        if (splash && brand) {
          const next = measureBrandFly(splash, brand)
          if (next) setFlyTarget(next)
        }
        setIntroPhase('fly')
      }, 700)
    }

    startTimer = window.setTimeout(() => {
      if (cancelled) return
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (!cancelled) beginHoldClock()
        })
      } else {
        beginHoldClock()
      }
    }, 80)

    return () => {
      cancelled = true
      window.clearTimeout(startTimer)
      window.clearTimeout(holdTimer)
    }
  }, [introPhase])

  // desktop: wait for ~0.72s pill expand; mobile: shorter settle
  useEffect(() => {
    if (introPhase !== 'expanding') return undefined

    const deskTimer = window.setTimeout(() => startDeskDraw(), DESK_DRAW_DELAY_MS)
    const doneMs = isDesktop ? PILL_EXPAND_MS + 40 : 420
    const doneTimer = window.setTimeout(() => finishIntro(), doneMs)

    return () => {
      window.clearTimeout(deskTimer)
      window.clearTimeout(doneTimer)
    }
  }, [introPhase, isDesktop, finishIntro])

  // intro skipped (reduced motion / non-home) — draw promptly
  useEffect(() => {
    if (introPhase === 'done') startDeskDraw()
  }, [introPhase])

  // hard safety cap
  useEffect(() => {
    if (introPhase === 'done') return undefined
    const t = window.setTimeout(() => finishIntro(), 3600)
    return () => window.clearTimeout(t)
  }, [introPhase, finishIntro])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ)
    const sync = () => {
      setIsDesktop(mq.matches)
      if (mq.matches) setMenuOpen(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.3 }
    )

    const sectionIds = navLinks.map(({ href }) => href).filter((href) =>
      href.startsWith('#')
    )

    sectionIds.forEach((href) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [location.pathname, viewMode])

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => navigateToSection(location.hash), 100)
    }
  }, [location.pathname, location.hash])

  const goToRoute = (href) => {
    navigateTyped(navigate, href, location.pathname)
  }

  const handleNavClick = (event, href) => {
    setMenuOpen(false)
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        if (isModifiedClick(event)) return
        event.preventDefault()
        goToRoute(`/${href}`)
      } else {
        event.preventDefault()
        navigateToSection(href)
      }
    } else {
      if (isModifiedClick(event)) return
      event.preventDefault()
      goToRoute(href)
    }
  }

  const isActive = (href) => {
    if (href.startsWith('#')) {
      return location.pathname === '/' && activeSection === href.slice(1)
    }
    return location.pathname.startsWith(href)
  }

  const introBusy = introPhase !== 'done'
  const splashVisible = introPhase === 'hold' || introPhase === 'fly'
  const brandRevealed = introPhase === 'expanding' || introPhase === 'done'
  const showExtras = brandRevealed
  // Pill stays mounted during hold so we can measure brandLabel for the FLIP
  const pillOpacity = introPhase === 'hold' ? 0 : 1

  const chromeExpanded =
    introPhase === 'expanding' ||
    (introPhase === 'done' && (!scrolled || pillHovered || menuOpen))

  const linksVisible = showExtras && isDesktop && chromeExpanded
  const sheetOpen = !isDesktop && menuOpen && showExtras
  const themeVisible = showExtras && chromeExpanded
  const viewSwitchVisible =
    showExtras && chromeExpanded && location.pathname === '/'

  const instant = prefersReduced ? { duration: 0 } : undefined

  const wordAnimate =
    introPhase === 'hold'
      ? { opacity: 1, x: 0, y: 0, scale: 1 }
      : introPhase === 'fly' && flyTarget
        ? {
            opacity: 1,
            x: flyTarget.x,
            y: flyTarget.y,
            scale: flyTarget.scale,
          }
        : introPhase === 'fly'
          ? { opacity: 1, x: 0, y: '-38vh', scale: 0.2 }
          : {
              opacity: 0,
              x: flyTarget?.x ?? 0,
              y: flyTarget?.y ?? 0,
              scale: flyTarget?.scale ?? 0.2,
            }

  return (
    <>
      <AnimatePresence>
        {splashVisible && (
          <motion.div
            key="nav-splash"
            className={styles.splashOverlay}
            aria-hidden="true"
            initial={{ opacity: 1 }}
            animate={{ opacity: introPhase === 'fly' ? 0.55 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.4, ease: easeOut }}
          >
            <motion.p
              ref={splashWordRef}
              className={styles.splashWord}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={wordAnimate}
              transition={
                prefersReduced
                  ? instant
                  : introPhase === 'hold'
                    ? { duration: 0.45, ease: easeOut }
                    : brandFlySpring
              }
              onAnimationComplete={() => {
                if (introPhase === 'fly') setIntroPhase('expanding')
              }}
            >
              Soumyadeep
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${
          linksVisible || sheetOpen || themeVisible || viewSwitchVisible
            ? styles.expanded
            : styles.collapsed
        } ${introBusy ? styles.introBusy : ''}`}
      >
        <div className={styles.wrap}>
          <motion.div
            className={styles.pill}
            layout={false}
            style={{ borderRadius: 999 }}
            initial={false}
            animate={{
              opacity: pillOpacity,
              scale: 1,
            }}
            transition={
              prefersReduced
                ? instant
                : {
                    opacity: { duration: 0.28, ease: easeOut },
                    scale: { type: 'spring', visualDuration: 0.4, bounce: 0.1 },
                  }
            }
            onMouseEnter={() =>
              isDesktop && !introBusy && setPillHovered(true)
            }
            onMouseLeave={() =>
              isDesktop && !introBusy && setPillHovered(false)
            }
            onClick={() => {
              if (isDesktop || introBusy || !showExtras) return
              setMenuOpen((open) => !open)
            }}
          >
            <a
              href="/"
              className={styles.logo}
              onClick={(e) => {
                e.stopPropagation()
                if (isModifiedClick(e)) return
                e.preventDefault()
                setMenuOpen(false)
                if (location.pathname !== '/') {
                  goToRoute('/')
                } else {
                  navigateToTop()
                }
              }}
            >
              <motion.span
                ref={brandRef}
                className={styles.brandLabel}
                aria-hidden={splashVisible ? true : undefined}
                initial={false}
                animate={{ opacity: brandRevealed || !splashVisible ? 1 : 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.12 }}
              >
                Soumyadeep
              </motion.span>
            </a>

            {isDesktop && (
              <div
                className={`${styles.desktopNavClip} ${
                  linksVisible ? styles.desktopNavClipOpen : ''
                }`}
              >
                <div className={styles.desktopNavClipInner}>
                  <nav
                    className={styles.desktopNav}
                    aria-label="Main navigation"
                    aria-hidden={linksVisible ? undefined : true}
                  >
                    <div className={styles.linkRow}>
                      {navLinks.map(({ href, label }) => (
                        <a
                          key={href}
                          href={href}
                          tabIndex={linksVisible ? undefined : -1}
                          className={`${styles.navLink} ${isActive(href) ? styles.active : ''}`}
                          onClick={(e) => handleNavClick(e, href)}
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </nav>
                </div>
              </div>
            )}

            <div
              className={`${styles.navExtras} ${
                brandRevealed ? '' : styles.navExtrasHidden
              }`}
              aria-hidden={brandRevealed ? undefined : true}
            >
              <div
                className={`${styles.viewSlot} ${
                  viewSwitchVisible ? styles.viewSlotOpen : ''
                }`}
                aria-hidden={viewSwitchVisible ? undefined : true}
              >
                <div className={styles.viewSlotInner}>
                  <div
                    className={styles.viewSwitch}
                    role="group"
                    aria-label="Portfolio view"
                  >
                    <button
                      type="button"
                      className={
                        viewMode === 'portfolio' ? styles.viewOptionActive : ''
                      }
                      aria-pressed={viewMode === 'portfolio'}
                      tabIndex={viewSwitchVisible ? undefined : -1}
                      onClick={(event) => {
                        event.stopPropagation()
                        setMenuOpen(false)
                        onViewModeChange?.('portfolio')
                      }}
                    >
                      Portfolio
                    </button>
                    <button
                      type="button"
                      className={
                        viewMode === 'brief' ? styles.viewOptionActive : ''
                      }
                      aria-pressed={viewMode === 'brief'}
                      tabIndex={viewSwitchVisible ? undefined : -1}
                      onClick={(event) => {
                        event.stopPropagation()
                        setMenuOpen(false)
                        onViewModeChange?.('brief')
                      }}
                    >
                      Brief
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`${styles.themeSlot} ${
                  themeVisible ? styles.themeSlotOpen : ''
                }`}
                aria-hidden={themeVisible ? undefined : true}
              >
                <div className={styles.themeSlotInner}>
                  <ThemeToggle
                    theme={theme}
                    toggleTheme={toggleTheme}
                    tabIndex={themeVisible ? undefined : -1}
                  />
                </div>
              </div>
              <div className={styles.actions}>
                <a
                  href={RESUME_HREF}
                  className={styles.resumeCta}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Resume
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {sheetOpen && (
            <motion.nav
              className={styles.mobileNav}
              aria-label="Mobile navigation"
              initial={prefersReduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -6 }}
              transition={
                prefersReduced ? instant : { duration: 0.28, ease: easeOut }
              }
            >
              <motion.div
                className={styles.mobileList}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      delayChildren: stagger(0.05),
                    },
                  },
                }}
                initial={prefersReduced ? false : 'hidden'}
                animate="show"
              >
                {navLinks.map(({ href, label }) => (
                  <motion.a
                    key={`${href}-${label}`}
                    href={href}
                    className={`${styles.mobileLink} ${isActive(href) ? styles.active : ''}`}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: prefersReduced
                          ? instant
                          : {
                              type: 'spring',
                              visualDuration: 0.34,
                              bounce: 0,
                            },
                      },
                    }}
                    onClick={(e) => handleNavClick(e, href)}
                  >
                    {label}
                  </motion.a>
                ))}
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
