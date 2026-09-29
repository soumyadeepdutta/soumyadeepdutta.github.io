import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { DESK_SKETCH_PATHS, DESK_SKETCH_VIEWBOX } from '../assets/deskSketchPaths'
import { STORY } from '../utils/introChoreography'
import { schedulePen } from '../utils/penSchedule'
import styles from './DeskSketch.module.css'

const { strokes: DESK_STROKES, end: DESK_DRAW_END } = schedulePen(
  DESK_SKETCH_PATHS,
  STORY.desk.pen,
)

/** Seconds from `play` until the last stroke lands. */
export const DESK_DRAW_DURATION = DESK_DRAW_END

/**
 * The desk, drawn by the same pen as the intro cloud. The parent decides
 * when to `play` (see Hero); `onDrawn` fires once the last stroke lands.
 */
export default function DeskSketch({ play = false, delay = 0, onDrawn }) {
  const prefersReduced = useReducedMotion()
  const drawn = prefersReduced || play
  const [finished, setFinished] = useState(false)
  const onDrawnRef = useRef(onDrawn)
  onDrawnRef.current = onDrawn

  useEffect(() => {
    if (!play) return undefined
    if (prefersReduced) {
      onDrawnRef.current?.()
      return undefined
    }
    const timer = window.setTimeout(() => {
      setFinished(true)
      onDrawnRef.current?.()
    }, (delay + DESK_DRAW_END) * 1000)
    return () => window.clearTimeout(timer)
  }, [play, delay, prefersReduced])

  return (
    <div
      className={styles.frame}
      data-drawing={play && !finished && !prefersReduced ? 'true' : undefined}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        viewBox={DESK_SKETCH_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {DESK_STROKES.map((stroke, index) => (
          <g key={index} transform={`translate(${stroke.x} ${stroke.y})`}>
            <motion.path
              d={stroke.d}
              fill="none"
              stroke="var(--desk-stroke, #c5d0e0)"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin={stroke.strokeLinejoin || 'round'}
              initial={prefersReduced ? false : { pathLength: 0, opacity: 0 }}
              animate={
                drawn
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={
                prefersReduced || !play
                  ? { duration: 0 }
                  : {
                      pathLength: {
                        duration: stroke.duration,
                        delay: delay + stroke.delay,
                        ease: 'easeInOut',
                      },
                      opacity: { duration: 0.08, delay: delay + stroke.delay },
                    }
              }
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
