import { motion, useReducedMotion } from 'motion/react'
import styles from './HandwrittenText.module.css'
import { ease, instant } from '../utils/motionTokens'

const hidden = {
  clipPath: 'inset(-0.2em 100% -0.2em 0)',
  opacity: 0.35,
}

const visible = {
  clipPath: 'inset(-0.2em 0% -0.2em 0)',
  opacity: 1,
}

export default function HandwrittenText({
  children,
  className = '',
  delay = 0,
  active,
  once = true,
}) {
  const prefersReduced = useReducedMotion()
  const controlled = typeof active === 'boolean'
  const length = typeof children === 'string' ? children.length : 24
  const duration = 0.58 + Math.min(length * 0.012, 0.42)

  const motionProps = controlled
    ? { animate: active ? visible : hidden }
    : {
        whileInView: visible,
        viewport: { once, amount: 0.75 },
      }

  return (
    <p className={`${styles.root} ${className}`.trim()}>
      <motion.span
        className={styles.ink}
        initial={prefersReduced ? false : hidden}
        {...(prefersReduced ? { animate: visible } : motionProps)}
        transition={
          prefersReduced ? instant : { duration, delay, ease: ease.inOut }
        }
      >
        {children}
      </motion.span>
    </p>
  )
}
