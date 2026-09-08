import { motion, useReducedMotion } from 'motion/react'
import styles from './RollingLabel.module.css'

/**
 * Rolling label hover — two clipped copies (Motion text-animation guide).
 * Accessible name stays on the parent control; visual copies are aria-hidden.
 */
export default function RollingLabel({ children }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <span>{children}</span>
  }

  return (
    <span className={styles.window} aria-hidden="true">
      <motion.span
        className={styles.copy}
        initial={false}
        variants={{
          rest: { y: '0%' },
          hover: { y: '110%' },
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
      <motion.span
        className={`${styles.copy} ${styles.incoming}`}
        initial={false}
        variants={{
          rest: { y: '-110%' },
          hover: { y: '0%' },
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}
