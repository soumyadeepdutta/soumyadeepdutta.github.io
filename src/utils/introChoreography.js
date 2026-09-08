/**
 * Shared intro ↔ hero desk-sketch choreography.
 * Pill expand matches Navbar brandFlySpring visualDuration (0.72s).
 * Desk draw starts at ~80% of that expand.
 */

export const PILL_EXPAND_MS = 720
export const DESK_DRAW_AT_PROGRESS = 0.8
export const DESK_DRAW_DELAY_MS = Math.round(PILL_EXPAND_MS * DESK_DRAW_AT_PROGRESS)

let deskDrawStarted = false
const listeners = new Set()

export function startDeskDraw() {
  if (deskDrawStarted) return
  deskDrawStarted = true
  listeners.forEach((cb) => {
    try {
      cb()
    } catch {
      /* ignore subscriber errors */
    }
  })
  listeners.clear()
}

/** Subscribe once; runs immediately if draw already signaled. */
export function onDeskDrawStart(callback) {
  if (deskDrawStarted) {
    callback()
    return () => {}
  }
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}
