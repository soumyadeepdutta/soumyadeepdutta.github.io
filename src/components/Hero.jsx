import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'
import { navigateToSection } from '../utils/navigation'

const ROLES = [
  'Backend Developer',
  'AWS Solutions Architect',
  'Node.js Engineer',
  'Python Developer',
  'AI Enthusiast',
]

export default function Hero() {
  const typingRef = useRef(null)

  useEffect(() => {
    let roleIdx = 0
    let charIdx = 0
    let deleting = false
    let timer

    const type = () => {
      const current = ROLES[roleIdx]
      const el = typingRef.current
      if (!el) return

      if (!deleting) {
        el.textContent = current.slice(0, charIdx + 1)
        charIdx++
        if (charIdx === current.length) {
          deleting = true
          timer = setTimeout(type, 1800)
          return
        }
      } else {
        el.textContent = current.slice(0, charIdx - 1)
        charIdx--
        if (charIdx === 0) {
          deleting = false
          roleIdx = (roleIdx + 1) % ROLES.length
        }
      }
      timer = setTimeout(type, deleting ? 55 : 90)
    }

    timer = setTimeout(type, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className={styles.hero} id="about">
      <div className={`container ${styles.inner}`}>
        {/* Text content */}
        <div className={styles.content}>
          <p className={`mono ${styles.greeting} reveal reveal-1`}>
            <span className={styles.prompt}>~$</span> hello world
          </p>

          <h1 className={`${styles.name} reveal reveal-2`}>
            Soumyadeep<br />
            <span className={styles.nameHighlight}>Dutta</span>
          </h1>

          <div className={`${styles.roleRow} reveal reveal-3`}>
            <span className={`mono ${styles.arrow}`}>&gt;&gt;</span>
            <span className={`${styles.typingText}`} ref={typingRef} />
            <span className={styles.cursor} aria-hidden="true">|</span>
          </div>

          <p className={`${styles.bio} reveal reveal-4`}>
            5+ years building scalable backend systems and cloud infrastructure.
            Passionate about distributed architectures, serverless patterns, and
            applying AI to real-world engineering challenges.
          </p>

          <div className={`${styles.ctaRow} reveal reveal-5`}>
            <a
              href="#experience"
              className="btn btn-primary"
              onClick={e => {
                e.preventDefault()
                navigateToSection('#experience')
              }}
            >
              View Experience
            </a>
            <a
              href="#contact"
              className="btn btn-outline"
              onClick={e => {
                e.preventDefault()
                navigateToSection('#contact')
              }}
            >
              Get in Touch
            </a>
          </div>

          {/* Quick stats */}
          <div className={`${styles.stats} reveal reveal-5`}>
            <div className={styles.stat}>
              <span className={styles.statNum}>5+</span>
              <span className={styles.statLabel}>Years Exp.</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>AWS</span>
              <span className={styles.statLabel}>SAA Certified</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>10+</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
          </div>
        </div>

        {/* Profile photo */}
        <div className={`${styles.photoWrap} reveal reveal-3`}>
          <div className={styles.photoRing}>
            <img
              src="/profile.jpg"
              alt="Soumyadeep Dutta"
              className={styles.photo}
              width="320"
              height="320"
            />
          </div>
          <div className={styles.photoBadge}>
            <span>☁️</span>
            <span className="mono" style={{ fontSize: '0.7rem' }}>AWS SAA</span>
          </div>
        </div>
      </div>

      {/* Background grid */}
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />

      {/* Scroll indicator */}
      <a
        href="#skills"
        className={styles.scrollIndicator}
        onClick={e => {
          e.preventDefault()
          navigateToSection('#skills')
        }}
        aria-label="Scroll down"
      >
        <span className={`mono ${styles.scrollText}`}>scroll</span>
        <span className={styles.scrollArrow}>↓</span>
      </a>
    </section>
  )
}
