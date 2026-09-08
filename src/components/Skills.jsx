import { useState, useCallback, lazy, Suspense, useRef } from 'react'
import TechTag from './TechTag'
import { skills } from '../data/skills'
import MotionReveal, { MotionItem } from './MotionReveal'
import styles from './Skills.module.css'

const SkillsLattice = lazy(() => import('./SkillsLattice'))

export default function Skills() {
  const [focused, setFocused] = useState(null)
  const latticeRef = useRef(null)

  const onSkillFocus = useCallback((label) => {
    setFocused(label)
  }, [])

  const onTagSelect = useCallback((label) => {
    setFocused(label)
    latticeRef.current?.setActiveLabel(label)
  }, [])

  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <MotionReveal className="section-header">
          <MotionItem as="p" className="section-label">Pipeline · live map</MotionItem>
          <MotionItem as="h2" className="section-title">Signal Lattice</MotionItem>
          <MotionItem className="divider" />
          <MotionItem as="p" className="section-subtitle">
            Live throughput across the stack — hex nodes from ingress languages
            through AWS, data, and observability. Hover a hex; chips below stay
            the accessible source of truth.
          </MotionItem>
        </MotionReveal>

        <Suspense fallback={<div className={styles.latticeFallback} aria-hidden="true" />}>
          <SkillsLattice ref={latticeRef} onSkillFocus={onSkillFocus} />
        </Suspense>

        <MotionReveal className={styles.grid} amount={0.2}>
          {skills.map((cat) => (
            <MotionItem key={cat.category} className={styles.category}>
              <div className={styles.catHeader}>
                <span className={styles.catDot} />
                <h3 className={styles.catTitle}>{cat.category}</h3>
              </div>
              <div className={styles.tags}>
                {cat.items.map((item) => (
                  <TechTag
                    key={item.label}
                    item={item}
                    color={cat.color}
                    onSelect={onTagSelect}
                    active={focused === item.label}
                    className={`${styles.skillTag} ${
                      focused === item.label ? styles.skillTagActive : ''
                    } ${focused && focused !== item.label ? styles.skillTagDim : ''}`}
                  />
                ))}
              </div>
            </MotionItem>
          ))}
        </MotionReveal>
      </div>
    </section>
  )
}
