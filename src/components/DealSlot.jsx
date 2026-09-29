import { forwardRef, useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import { useDealCard, useDealProgress, useNarrow } from '../hooks/useDeal'

/**
 * Wrapper that carries a card's Deal style. Hover and tap go on the card
 * inside it, so scroll-linked and gesture transforms never share an element.
 *
 * On narrow screens groups stack into one tall column, so a shared group
 * progress would finish lower cards before they are on screen. There each
 * card deals on its own scroll progress instead — unless it has an explicit
 * `window` (e.g. pipeline tiles that must stay in sync with their group).
 */
const DealSlot = forwardRef(function DealSlot(
  { progress, index, count, from, to, window, style, children, ...rest },
  ref,
) {
  const ownRef = useRef(null)
  const ownProgress = useDealProgress(ownRef)
  const narrow = useNarrow()
  const solo = narrow && count > 1 && !window

  const dealStyle = useDealCard(
    solo ? ownProgress : progress,
    solo ? { from, to } : { index, count, from, to, window },
  )

  const setRef = useCallback(
    (node) => {
      ownRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  return (
    <motion.div ref={setRef} style={{ ...dealStyle, ...style }} {...rest}>
      {children}
    </motion.div>
  )
})

export default DealSlot
