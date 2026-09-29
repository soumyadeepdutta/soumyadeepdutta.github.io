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
  LANDING_DELAY_MS,
  PILL_EXPAND_MS,
  STORY,
  startLanding,
} from '../utils/introChoreography'
import { schedulePen } from '../utils/penSchedule'
import {
  CLOUD_SKETCH_PATHS,
  CLOUD_SKETCH_VIEWBOX,
} from '../assets/cloudSketchPaths'
import { ease, spring } from '../utils/motionTokens'

const PORTFOLIO_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
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

const NAME_LETTERS = 'Soumyadeep'.split('')

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

// Widths are viewBox units (~4px each at desktop size). Kept in viewBox
// space because non-scaling-stroke breaks Motion's pathLength dash maths.
const CLOUD_STROKE_STYLE = {
  outline: { width: 0.42, opacity: 1 },
  retrace: { width: 0.3, opacity: 0.4 },
  detail: { width: 0.3, opacity: 0.55 },
  wind: { width: 0.3, opacity: 0.5 },
}

// Outline strokes chain end-to-end so the pen reads as one continuous loop;
// accents follow on a short stagger (see STORY.signature.pen).
const { strokes: CLOUD_STROKES, end: CLOUD_DRAW_END } = schedulePen(
  CLOUD_SKETCH_PATHS,
  STORY.signature.pen,
)

const INTRO_PHASE_MS = {
  draw: Math.round(
    (CLOUD_DRAW_END + STORY.signature.holdAfterDraw) * 1000,
  ),
  emerge: STORY.signature.emergeMs,
  dissolve: STORY.signature.dissolveMs,
  highlight: STORY.signature.lockupMs,
  fly: STORY.arrival.flyMs,
}

function IntroCloud({ phase, prefersReduced, shift }) {
  const drawing = phase === 'draw'
  const visible = drawing || phase === 'emerge'
  const shifted = phase === 'emerge' || phase === 'dissolve'
  const evaporating = phase === 'dissolve'

  return (
    <motion.svg
      className={styles.cloudMark}
      viewBox={CLOUD_SKETCH_VIEWBOX}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.97, y: 8 }}
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
                ? { duration: 0.2, ease: ease.out }
                : { duration: 0.46, ease: [0.4, 0, 0.6, 1] },
              scale: { duration: 0.5, ease: ease.out },
              y: drawing
                ? spring.slow
                : { duration: 0.5, ease: [0.4, 0, 0.7, 1] },
              x: spring.fly,
            }
      }
      aria-hidden="true"
    >
      {CLOUD_STROKES.map((stroke, index) => {
        const look = CLOUD_STROKE_STYLE[stroke.kind]
        return (
          <motion.path
            key={index}
            d={stroke.d}
            fill="none"
            stroke="var(--cloud-stroke)"
            strokeWidth={look.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: look.opacity }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    pathLength: {
                      duration: stroke.duration,
                      delay: stroke.delay,
                      ease: stroke.kind === 'outline' ? 'linear' : 'easeInOut',
                    },
                    opacity: { duration: 0.12, delay: stroke.delay },
                  }
            }
          />
        )
      })}
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
          fly: 'expanding',
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

    const landingTimer = window.setTimeout(() => startLanding(), LANDING_DELAY_MS)
    const doneMs = isDesktop ? PILL_EXPAND_MS + 40 : 420
    const doneTimer = window.setTimeout(() => finishIntro(), doneMs)

    return () => {
      window.clearTimeout(landingTimer)
      window.clearTimeout(doneTimer)
    }
  }, [introPhase, isDesktop, finishIntro])

  // intro skipped (reduced motion / non-home / visitor skip) — land promptly
  useEffect(() => {
    if (introPhase === 'done') startLanding()
  }, [introPhase])

  // Visitor control: any click, key or scroll during the splash skips it.
  useEffect(() => {
    if (introPhase === 'done' || introPhase === 'expanding') return undefined
    const skip = () => finishIntro()
    const events = ['pointerdown', 'keydown', 'wheel', 'touchmove']
    events.forEach((type) =>
      window.addEventListener(type, skip, { once: true, passive: true })
    )
    return () =>
      events.forEach((type) => window.removeEventListener(type, skip))
  }, [introPhase, finishIntro])

  // hard safety cap
  useEffect(() => {
    if (introPhase === 'done') return undefined
    const t = window.setTimeout(() => finishIntro(), STORY.safetyCapMs)
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
      ? spring.fly
      : introPhase === 'emerge'
        ? spring.fly
        : introPhase === 'dissolve'
          ? spring.slow
          : { duration: 0.2, ease: ease.out }

  const letterTransition = (index) =>
    prefersReduced
      ? instant
      : introPhase === 'emerge'
        ? { ...spring.base, delay: 0.03 + index * 0.026 }
        : { duration: 0.18, ease: ease.out }

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
            transition={{ duration: prefersReduced ? 0 : 0.4, ease: ease.out }}
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
                        opacity: { duration: 0.7, ease: ease.out },
                        scale: { duration: 0.9, ease: ease.out },
                        x: spring.fly,
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
                          ? { duration: 0.46, ease: ease.inOut }
                          : { duration: 0.24, ease: ease.out }
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
                          ? { duration: 0.42, delay: 0.22, ease: ease.out }
                          : { duration: 0.2, ease: ease.out }
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
                    opacity: { duration: 0.28, ease: ease.out },
                    scale: spring.pop,
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
                prefersReduced ? instant : { duration: 0.28, ease: ease.out }
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
                          : spring.snappy,
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
