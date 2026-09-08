import { useEffect, useRef } from 'react'
import { createHeroAtmosphere } from '../utils/heroAtmosphere'
import styles from './HeroAtmosphere.module.css'

/**
 * Decorative packet fog behind the AWS topology diagram.
 * Hidden from assistive tech; the SVG remains the inspectable craft.
 */
export default function HeroAtmosphere() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return undefined
    const api = createHeroAtmosphere(canvasRef.current)
    api.setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onReduced = () => api.setReducedMotion(reduced.matches)
    reduced.addEventListener('change', onReduced)

    const themeObs = new MutationObserver(() => api.setTheme())
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    const vis = new IntersectionObserver(
      ([entry]) => api.setVisible(entry.isIntersecting),
      { threshold: 0.08 },
    )
    if (wrapRef.current) vis.observe(wrapRef.current)

    return () => {
      reduced.removeEventListener('change', onReduced)
      themeObs.disconnect()
      vis.disconnect()
      api.unobserve?.()
      api.dispose()
    }
  }, [])

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
