import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { DESK_SKETCH_PATHS, DESK_SKETCH_VIEWBOX } from '../assets/deskSketchPaths'
import { onDeskDrawStart } from '../utils/introChoreography'
import styles from './DeskSketch.module.css'

const DRAW_DURATION = 1.55
const STAGGER = 0.055

export default function DeskSketch() {
  const prefersReduced = useReducedMotion()
  const [shouldDraw, setShouldDraw] = useState(() => !!prefersReduced)

  useEffect(() => {
    if (prefersReduced) {
      setShouldDraw(true)
      return undefined
    }
    return onDeskDrawStart(() => setShouldDraw(true))
  }, [prefersReduced])

  return (
    <div className={styles.frame} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox={DESK_SKETCH_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {DESK_SKETCH_PATHS.map((path, index) => (
          <g key={index} transform={`translate(${path.x} ${path.y})`}>
            <motion.path
              d={path.d}
              fill="none"
              stroke="var(--desk-stroke, #c5d0e0)"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin={path.strokeLinejoin || 'round'}
              initial={
                prefersReduced
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              animate={
                prefersReduced || shouldDraw
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : shouldDraw
                    ? {
                        pathLength: {
                          duration: DRAW_DURATION,
                          delay: index * STAGGER,
                          ease: 'easeInOut',
                        },
                        opacity: {
                          duration: 0.35,
                          delay: index * STAGGER,
                          ease: 'easeOut',
                        },
                      }
                    : { duration: 0 }
              }
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
