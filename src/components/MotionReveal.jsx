import { motion, useReducedMotion, stagger } from 'motion/react'

/** Serious-site spring: no overshoot (Motion docs: bounce 0 for trading/engineering UIs). */
export const revealTransition = {
  type: 'spring',
  visualDuration: 0.4,
  bounce: 0,
}

export const revealContainer = {
  hidden: {},
  show: {
    transition: {
      delayChildren: stagger(0.07),
    },
  },
}

export const revealItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
}

/**
 * Scroll-triggered stagger (Motion whileInView + variants).
 * Children that should stagger need variants={revealItem}.
 */
export default function MotionReveal({
  children,
  className,
  amount = 0.28,
  as = 'div',
}) {
  const reduced = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  if (reduced) {
    const Static = as === 'div' ? 'div' : as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Tag
      className={className}
      variants={revealContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Tag>
  )
}

export function MotionItem({ children, className, as = 'div' }) {
  const reduced = useReducedMotion()
  if (reduced) {
    const Static = as === 'div' ? 'div' : as
    return <Static className={className}>{children}</Static>
  }
  const Tag = motion[as] ?? motion.div
  return (
    <Tag className={className} variants={revealItem}>
      {children}
    </Tag>
  )
}
