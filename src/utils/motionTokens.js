/**
 * Shared motion tokens. Every transition on the site should come from here.
 *
 * House style: springs settle without overshoot (bounce 0). The only
 * exceptions are the intro fly (a hint of life on long travel) and the nav
 * pill pop.
 *
 * Duration-based springs (`visualDuration`) are for choreographed entrances,
 * where timing needs to line up with other steps. Physics springs
 * (`stiffness` / `damping`) are for weighty cards and interactive feedback,
 * where the feel matters more than an exact end time.
 */

import { stagger } from 'motion/react'

export const ease = {
  /** Quick settle — chrome, labels, small fades. */
  out: [0.22, 1, 0.36, 1],
  /** Long tail — opacity fades and view swaps. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Symmetric — wipes, line draws, handwriting. */
  inOut: [0.65, 0, 0.35, 1],
}

export const spring = {
  /** Small UI items: menu links. */
  snappy: { type: 'spring', visualDuration: 0.34, bounce: 0 },
  /** Global default (MotionConfig), letters, small sub-items. */
  base: { type: 'spring', visualDuration: 0.4, bounce: 0 },
  /** Section headings and copy entering on scroll. */
  reveal: { type: 'spring', visualDuration: 0.45, bounce: 0 },
  /** Larger blocks: hero name lines, note card, mobile lanes. */
  slow: { type: 'spring', visualDuration: 0.5, bounce: 0 },
  /** Long-distance travel: intro brand FLIP into the nav. */
  fly: { type: 'spring', visualDuration: 0.72, bounce: 0.04 },
  /** Nav pill scale-in. */
  pop: { type: 'spring', visualDuration: 0.4, bounce: 0.1 },

  /** Heavy cards that arrive with rotation or perspective. */
  entrance: { type: 'spring', stiffness: 150, damping: 22, mass: 0.8 },
  /** Mid-size items settling into place: pipeline stages, facts, actions. */
  settle: { type: 'spring', stiffness: 220, damping: 24, mass: 0.75 },
  /** whileHover / whileTap lifts. */
  hover: { type: 'spring', stiffness: 280, damping: 24 },
  /** Shared layoutId highlight backdrops sliding between items. */
  highlight: { type: 'spring', stiffness: 310, damping: 30, mass: 0.7 },
}

/** Options for useSpring() when smoothing a live motion value. */
export const follow = {
  /** Cursor-tracking magnetic buttons. */
  magnetic: { stiffness: 220, damping: 18, mass: 0.4 },
  /** The one scroll smoothing spring: every scroll-linked sequence. */
  scroll: { stiffness: 120, damping: 30, restDelta: 0.001 },
}

/** Use when reduced motion is on. */
export const instant = { duration: 0 }

/** View swap between portfolio and brief. */
export const viewSwap = { duration: 0.32, ease: ease.outExpo }

/** Hero note card idle float; only starts once the desk sketch is drawn. */
export const idleFloat = {
  y: [0, -8, 0],
  transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
}

/** Stagger rhythm (seconds between siblings). */
export const rhythm = { text: 0.08, cards: 0.1 }

/** Viewport triggers for once-only Rise. */
export const viewport = {
  text: { once: true, amount: 0.35 },
  group: { once: true, amount: 0.2 },
}

/** Respond: the single hover/tap language. Pair with spring.hover. */
export const respond = {
  lift: { y: -4 }, // cards
  nudge: { x: 6 }, // horizontal rows and lanes
  press: { scale: 0.985 }, // whileTap
}

/**
 * Deal: scroll-linked, reversible card choreography. Cards move from a
 * small held pose to rest as their group scrolls in, and gather back when
 * it scrolls out. Limits: |x|, |y| <= 72px, |rotate| <= 3deg, rotateX/Y <= 6deg,
 * scale >= 0.92.
 */
export const deal = {
  /** Starts when the group's top hits 90% of the viewport, completes at 40%. */
  offset: ['start 90%', 'start 40%'],
  /** Share of the window each card's own move occupies. */
  span: 0.6,
  /** Upper bound on per-card stagger inside the window. */
  maxStagger: 0.12,
  opacityFrom: 0.35,
  /** Perspective for cards that tilt. */
  perspective: 1100,
  /** Below this width Deal drops x offsets and rotateY (vertical only). */
  narrowQuery: '(max-width: 899px)',
}

/** Parent variants for a staggered Rise group (children use revealItem). */
export const staggerGroup = (step = rhythm.text, startDelay = 0) => ({
  hidden: {},
  show: { transition: { delayChildren: stagger(step, { startDelay }) } },
})

/** Standard fade-up for headings and copy; pair with a stagger parent. */
export const revealItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: spring.reveal },
}
