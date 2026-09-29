import { useEffect, useState } from 'react'
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { deal, follow } from '../utils/motionTokens'

/** Scroll progress (0..1) of a card group, smoothed by follow.scroll. */
export function useDealProgress(ref, { offset } = {}) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset ?? deal.offset,
  })
  return useSpring(scrollYProgress, follow.scroll)
}

/** Live match for deal.narrowQuery. */
export function useNarrow() {
  const [narrow, setNarrow] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(deal.narrowQuery).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(deal.narrowQuery)
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return narrow
}

const REST = { x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1 }

/**
 * Style for one card of a Deal group. Hooks run unconditionally, so call
 * this from a per-card component. Returns undefined under reduced motion.
 *
 * `from` is the held pose, `to` the rest pose (defaults to REST). `window`
 * overrides the [start, end] progress range derived from index and count.
 */
export function useDealCard(
  progress,
  { index = 0, count = 1, from = {}, to = {}, window: range } = {},
) {
  const reduced = useReducedMotion()
  const narrow = useNarrow()

  const stag =
    count > 1 ? Math.min(deal.maxStagger, (1 - deal.span) / (count - 1)) : 0
  const start = range ? range[0] : index * stag
  const end = range ? range[1] : start + deal.span
  const fadeEnd = start + (end - start) * 0.5

  const held = { ...REST, ...to, ...from }
  const rest = { ...REST, ...to }
  if (narrow) {
    held.x = 0
    rest.x = 0
    held.rotateY = 0
    rest.rotateY = 0
  }

  const span = [start, end]
  const x = useTransform(progress, span, [held.x, rest.x])
  const y = useTransform(progress, span, [held.y, rest.y])
  const rotate = useTransform(progress, span, [held.rotate, rest.rotate])
  const rotateX = useTransform(progress, span, [held.rotateX, rest.rotateX])
  const rotateY = useTransform(progress, span, [held.rotateY, rest.rotateY])
  const scale = useTransform(progress, span, [held.scale, rest.scale])
  const opacity = useTransform(progress, [start, fadeEnd], [deal.opacityFrom, 1])

  if (reduced) return undefined

  const style = { x, y, rotate, scale, opacity }
  if (held.rotateX || rest.rotateX || held.rotateY || rest.rotateY) {
    style.rotateX = rotateX
    style.rotateY = rotateY
    style.transformPerspective = deal.perspective
  }
  return style
}
