/**
 * The landing storyboard: every beat from first paint to a settled hero.
 * Tune the story here; components only read these values.
 *
 * Act 1  Signature   the pen sketches the cloud; the name writes in beside it
 * Act 2  Arrival     the name flies into the nav and the pill opens
 * Act 3  Headline    hero copy settles quickly and then holds still
 * Act 4  The desk    the note card rises and the same pen draws the desk,
 *                    object by object, while nothing else on screen moves.
 *                    The note text, proof chips and idle float only arrive
 *                    once the drawing is finished.
 *
 * Seconds unless the name says ms.
 */

import { spring } from './motionTokens'

export const STORY = {
  signature: {
    /** Cloud pen, in cloud viewBox units per second. */
    pen: {
      speed: 360,
      start: 0.12,
      groups: {
        // Accents begin just before the outline closes, looser and quicker.
        accent: { pause: -0.2, overlap: 0.8, speed: 150, minDuration: 0.26 },
      },
    },
    /** Hold on the finished drawing before the name arrives. */
    holdAfterDraw: 0.12,
    emergeMs: 680,
    dissolveMs: 460,
    lockupMs: 700,
  },

  arrival: {
    /** Name flight into the nav; advance on the visual end, not spring rest. */
    flyMs: Math.round(spring.fly.visualDuration * 1000),
    pillExpandMs: Math.round(spring.fly.visualDuration * 1000),
    /** Hero starts once the pill is this far through its expand. */
    landingAtProgress: 0.8,
  },

  headline: {
    stagger: 0.08,
  },

  desk: {
    /** Card rise after landing, when the card is already on screen. */
    cardAt: 0.35,
    /** The pen writes the caption as the card settles... */
    captionAfterCard: 0.1,
    /** ...then moves on to the desk as the caption finishes. */
    drawAfterCard: 0.62,
    /** Desk pen, in desk viewBox units per second (the desk renders smaller). */
    pen: {
      speed: 1000,
      minDuration: 0.1,
      overlap: 0.15,
      /** Pen-lift between objects: desk → laptop → mug → books. */
      pause: 0.12,
    },
    /** Note text and chips start this long before the last stroke ends. */
    textLeadIn: 0.2,
  },

  /** Hard cap: never keep the splash up longer than this. */
  safetyCapMs: 7000,
}

export const PILL_EXPAND_MS = STORY.arrival.pillExpandMs
export const LANDING_DELAY_MS = Math.round(
  PILL_EXPAND_MS * STORY.arrival.landingAtProgress,
)

let landingStarted = false
const listeners = new Set()

/** Fired by the nav when the intro hands over to the page. */
export function startLanding() {
  if (landingStarted) return
  landingStarted = true
  listeners.forEach((cb) => {
    try {
      cb()
    } catch {
      /* ignore subscriber errors */
    }
  })
  listeners.clear()
}

/** Subscribe once; runs immediately if the landing already started. */
export function onLandingStart(callback) {
  if (landingStarted) {
    callback()
    return () => {}
  }
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}
