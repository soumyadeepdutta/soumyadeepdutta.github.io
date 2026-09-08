import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { skills } from '../data/skills'
import { createSkillsLattice } from '../utils/skillsLatticeScene'
import { skillTransitionName } from '../utils/viewTransitions'
import styles from './SkillsLattice.module.css'

function useMediaQuery(query) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatch(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return match
}

/**
 * Signal Lattice — interactive Three.js skills pipeline.
 * Desktop WebGL; mobile falls back to the chip grid below (no canvas).
 */
const SkillsLattice = forwardRef(function SkillsLattice({ onSkillFocus }, ref) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const apiRef = useRef(null)
  const [hud, setHud] = useState(null)
  const [ready, setReady] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 769px)')
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const handleHover = useCallback(
    (info) => {
      setHud(info)
      onSkillFocus?.(info?.label ?? null)
    },
    [onSkillFocus],
  )

  useImperativeHandle(ref, () => ({
    setActiveLabel(label) {
      apiRef.current?.setActiveLabel(label)
    },
    clear() {
      apiRef.current?.setActiveLabel(null)
    },
  }), [])

  useEffect(() => {
    if (!isDesktop || !canvasRef.current) return undefined

    const api = createSkillsLattice(canvasRef.current, {
      skills,
      onHoverChange: handleHover,
    })
    apiRef.current = api
    api.setReducedMotion(prefersReduced)
    setReady(true)

    const themeObs = new MutationObserver(() => api.setTheme())
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      themeObs.disconnect()
      api.dispose()
      apiRef.current = null
      setReady(false)
    }
  }, [isDesktop, handleHover])

  useEffect(() => {
    apiRef.current?.setReducedMotion(prefersReduced)
  }, [prefersReduced])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || !isDesktop) return undefined

    const obs = new IntersectionObserver(
      ([entry]) => {
        apiRef.current?.setVisible(entry.isIntersecting)
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isDesktop, ready])

  const toNDC = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    return { x, y }
  }

  const onPointerMove = (e) => {
    const { x, y } = toNDC(e)
    apiRef.current?.setPointer(x, y)
  }

  const onPointerUp = (e) => {
    const { x, y } = toNDC(e)
    apiRef.current?.setPointer(x, y, { click: true })
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      apiRef.current?.cycleFocus(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      apiRef.current?.cycleFocus(-1)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      apiRef.current?.setActiveLabel(null)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (hud?.label) apiRef.current?.setActiveLabel(hud.locked ? null : hud.label)
    }
  }

  if (!isDesktop) return null

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} reveal reveal-2`}
    >
      <div className={styles.frame}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          tabIndex={0}
          role="application"
          aria-label="Interactive signal lattice of skills arranged as a six-layer pipeline from backend languages through cloud, data, observability, and tooling. Arrow keys cycle nodes, Enter pins, Escape releases."
          onPointerMove={onPointerMove}
          onPointerLeave={() => {
            apiRef.current?.setPointer(-999, -999)
            if (!hud?.locked) {
              setHud(null)
              onSkillFocus?.(null)
            }
          }}
          onPointerUp={onPointerUp}
          onKeyDown={onKeyDown}
        />

        <div className={styles.chrome} aria-hidden="true">
          <span className={styles.chromeLabel}>ingress</span>
          <span className={styles.chromeFlow} />
          <span className={styles.chromeLabel}>egress</span>
        </div>

        {hud && (
          <div
            className={styles.hud}
            data-locked={hud.locked || undefined}
            aria-live="polite"
            style={{ viewTransitionName: skillTransitionName(hud.label) }}
          >
            <span className={styles.hudCat}>{hud.category}</span>
            <span className={styles.hudLabel}>{hud.label}</span>
            <span className={styles.hudHint}>{hud.locked ? 'click to release' : 'click to pin'}</span>
          </div>
        )}

        {!hud && (
          <p className={styles.hint}>
            Hover a hex to inspect · packets are live work units moving through the stack
          </p>
        )}
      </div>
    </div>
  )
})

export default SkillsLattice
