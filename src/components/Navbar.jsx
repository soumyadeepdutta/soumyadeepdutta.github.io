import { useState, useEffect, useCallback, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
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
const CLOUD_PATH =
  'M95.16924 29.17054c-0.27692-15.13846-12.09231-29.16923-28.61539-29.16923-9.78462-0.09231-18.64615 4.70769-24.18462 13.84615l-0.55385 0.83077-0.73846-0.64615c-2.86154-1.66154-6.83077-2.30769-10.24615-1.84616-8.21539 1.10769-15.78462 7.84615-15.41538 18.27692-7.66154 2.58462-15.41539 10.24616-15.41539 21.5077 0 11.81539 9.04615 23.63076 22.52307 23.63076l73.56923 0c12 0.09232 22.24617-9.69231 22.24617-23.26153 0-13.56923-11.35385-23.26154-23.16924-23.16923z'
const INTRO_PHASE_MS = {
  draw: 920,
  emerge: 720,
  dissolve: 480,
  highlight: 740,
}
const NAME_LETTERS = 'Soumyadeep'.split('')
const CLOUD_VIEWBOX_W = 138.3385
const CLOUD_VIEWBOX_H = 75.6013

function readInitialIntroPhase(viewMode) {
  if (typeof window === 'undefined') return 'done'
  if (viewMode === 'brief') return 'done'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'done'
  }
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path !== '/') return 'done'
  return 'draw'
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

function IntroCloud({ phase, prefersReduced, shift }) {
  const drawing = phase === 'draw'
  const visible = drawing || phase === 'emerge'
  const shifted = phase === 'emerge' || phase === 'dissolve'
  const evaporating = phase === 'dissolve'

  return (
    <motion.svg
      className={styles.cloudMark}
      viewBox={`0 0 ${CLOUD_VIEWBOX_W} ${CLOUD_VIEWBOX_H}`}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.94, y: 12 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: evaporating ? 1.08 : 1,
        x: shifted ? shift : 0,
        y: evaporating ? -56 : 0,
      }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : {
              opacity: drawing
                ? { duration: 0.32, ease: easeOut }
                : { duration: 0.46, ease: [0.4, 0, 0.6, 1] },
              scale: { duration: 0.5, ease: easeOut },
              y: drawing
                ? { type: 'spring', visualDuration: 0.6, bounce: 0 }
                : { duration: 0.5, ease: [0.4, 0, 0.7, 1] },
              x: {
                type: 'spring',
                visualDuration: 0.72,
                bounce: 0.04,
              },
            }
      }
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="intro-cloud-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--cloud-top)" />
          <stop offset="100%" stopColor="var(--cloud-bottom)" />
        </linearGradient>
        <clipPath id="intro-cloud-clip">
          <motion.rect
            x="-2"
            width={CLOUD_VIEWBOX_W + 4}
            initial={
              prefersReduced ? false : { attrY: CLOUD_VIEWBOX_H + 2, height: 0 }
            }
            animate={{ attrY: -2, height: CLOUD_VIEWBOX_H + 4 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: 0.54, delay: 0.28, ease: [0.65, 0, 0.35, 1] }
            }
          />
        </clipPath>
      </defs>

      <path
        d={CLOUD_PATH}
        className={styles.cloudGhost}
        fill="none"
        stroke="var(--cloud-stroke)"
        strokeWidth="0.9"
        strokeDasharray="2.2 3.4"
      />

      <motion.path
        d={CLOUD_PATH}
        fill="none"
        stroke="var(--cloud-stroke)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReduced ? false : { pathLength: 0, opacity: 1 }}
        animate={{ pathLength: 1, opacity: drawing ? 1 : 0 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : {
                pathLength: {
                  type: 'spring',
                  duration: 0.78,
                  bounce: 0,
                },
                opacity: { duration: 0.22, ease: easeOut },
              }
        }
      />

      <path
        d={CLOUD_PATH}
        fill="url(#intro-cloud-fill)"
        clipPath="url(#intro-cloud-clip)"
      />
    </motion.svg>
  )
}

export default function Navbar({
  theme,
  toggleTheme,
  viewMode = 'portfolio',
  onViewModeChange,
}) {
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > 24 : false
  )
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
  const { scrollY } = useScroll()
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

  // Pencil storyboard: draw → emerge → dissolve → highlight → nav FLIP.
  useEffect(() => {
    if (!(introPhase in INTRO_PHASE_MS)) return undefined
    let cancelled = false
    let phaseTimer

    const advance = () => {
      phaseTimer = window.setTimeout(() => {
        if (cancelled) return

        if (introPhase === 'highlight') {
          const splash = splashWordRef.current
          const brand = brandRef.current
          if (splash && brand) {
            const next = measureBrandFly(splash, brand)
            if (next) setFlyTarget(next)
          }
          setIntroPhase('fly')
          return
        }

        const nextPhase = {
          draw: 'emerge',
          emerge: 'dissolve',
          dissolve: 'highlight',
        }
        setIntroPhase(nextPhase[introPhase])
      }, INTRO_PHASE_MS[introPhase])
    }

    if (introPhase === 'draw') {
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (!cancelled) advance()
        })
      } else {
        advance()
      }
    } else {
      advance()
    }

    return () => {
      cancelled = true
      window.clearTimeout(phaseTimer)
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
    const t = window.setTimeout(() => finishIntro(), 6000)
    return () => window.clearTimeout(t)
  }, [introPhase, finishIntro])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 24
    setScrolled((current) => (current === next ? current : next))
  })

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
  const splashVisible = [
    'draw',
    'emerge',
    'dissolve',
    'highlight',
    'fly',
  ].includes(introPhase)
  const brandRevealed = introPhase === 'expanding' || introPhase === 'done'
  const showExtras = brandRevealed
  // Pill stays mounted invisibly so its brand label can be measured for FLIP.
  const pillOpacity = brandRevealed ? 1 : 0

  const chromeExpanded =
    introPhase === 'expanding' ||
    (introPhase === 'done' && (!scrolled || pillHovered || menuOpen))

  const linksVisible = showExtras && isDesktop && chromeExpanded
  const sheetOpen = !isDesktop && menuOpen && showExtras
  const themeVisible = showExtras && chromeExpanded
  const viewSwitchVisible =
    showExtras && chromeExpanded && location.pathname === '/'

  const instant = prefersReduced ? { duration: 0 } : undefined

  const cloudShift = isDesktop ? 236 : 104
  const nameShift = isDesktop ? -206 : -66
  const lettersHidden = introPhase === 'draw'
  const locked = introPhase === 'highlight'
  const flying = introPhase === 'fly'
  const cloudOnStage = introPhase === 'draw' || introPhase === 'emerge'

  const wordAnimate =
    introPhase === 'draw'
      ? { opacity: 0, x: 48, y: 0, scale: 1 }
      : introPhase === 'emerge'
        ? { opacity: 1, x: nameShift, y: 0, scale: 1 }
        : introPhase === 'dissolve' || introPhase === 'highlight'
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

  const wordTransition = prefersReduced
    ? instant
    : introPhase === 'fly'
      ? brandFlySpring
      : introPhase === 'emerge'
        ? { type: 'spring', visualDuration: 0.72, bounce: 0.04 }
        : introPhase === 'dissolve'
          ? { type: 'spring', visualDuration: 0.5, bounce: 0 }
          : { duration: 0.2, ease: easeOut }

  const letterTransition = (index) =>
    prefersReduced
      ? instant
      : introPhase === 'emerge'
        ? {
            type: 'spring',
            visualDuration: 0.4,
            bounce: 0,
            delay: 0.03 + index * 0.026,
          }
        : { duration: 0.18, ease: easeOut }

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
            <div className={styles.splashStage}>
              <motion.div
                className={styles.splashBloom}
                initial={prefersReduced ? false : { opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: cloudOnStage ? 1 : 0,
                  scale: cloudOnStage ? 1 : 1.25,
                  x: introPhase === 'draw' ? 0 : cloudShift * 0.6,
                }}
                transition={
                  prefersReduced
                    ? instant
                    : {
                        opacity: { duration: 0.7, ease: easeOut },
                        scale: { duration: 0.9, ease: easeOut },
                        x: { type: 'spring', visualDuration: 0.72, bounce: 0 },
                      }
                }
                aria-hidden="true"
              />

              <div className={styles.splashNameGroup}>
                <div className={styles.splashLockup}>
                  <div className={styles.splashWordWrap}>
                    <motion.p
                      ref={splashWordRef}
                      className={styles.splashWord}
                      initial={false}
                      animate={wordAnimate}
                      transition={wordTransition}
                      onAnimationComplete={() => {
                        if (introPhase === 'fly') setIntroPhase('expanding')
                      }}
                    >
                      {NAME_LETTERS.map((letter, index) => (
                        <motion.span
                          key={`${letter}-${index}`}
                          className={styles.splashLetter}
                          initial={false}
                          animate={{
                            opacity: lettersHidden ? 0 : 1,
                            x: lettersHidden ? 26 : 0,
                          }}
                          transition={letterTransition(index)}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </motion.p>
                  </div>
                  <motion.span
                    className={styles.splashRule}
                    initial={false}
                    style={{ originX: flying ? 1 : 0 }}
                    animate={{
                      scaleX: locked ? 1 : 0,
                      opacity: locked ? 1 : 0,
                    }}
                    transition={
                      prefersReduced
                        ? instant
                        : locked
                          ? { duration: 0.46, ease: [0.65, 0, 0.35, 1] }
                          : { duration: 0.24, ease: easeOut }
                    }
                    aria-hidden="true"
                  />
                  <motion.p
                    className={styles.splashRole}
                    initial={false}
                    animate={{
                      opacity: locked ? 1 : 0,
                      y: locked ? 0 : 10,
                    }}
                    transition={
                      prefersReduced
                        ? instant
                        : locked
                          ? { duration: 0.42, delay: 0.22, ease: easeOut }
                          : { duration: 0.2, ease: easeOut }
                    }
                  >
                    Backend <span>&amp;</span> <strong>AWS</strong>
                  </motion.p>
                </div>
              </div>

              <IntroCloud
                phase={introPhase}
                prefersReduced={prefersReduced}
                shift={cloudShift}
              />
            </div>
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
