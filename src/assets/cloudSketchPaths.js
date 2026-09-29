/**
 * Intro cloud signature as pen strokes, in the same line-art language as
 * the desk sketch. Outline strokes run as one continuous loop (top lobe →
 * small lobe → left lobe → base → right lobe); the rest is a looser second
 * pass, volume curls and wind lines drawn afterwards.
 *
 * `group` and `len` (viewBox units) drive the shared pen timing
 * (utils/penSchedule.js); `kind` sets line weight and opacity.
 */
export const CLOUD_SKETCH_VIEWBOX = '0 0 138.3385 75.6013'

export const CLOUD_SKETCH_PATHS = [
  // outline
  { group: 'outline', kind: 'outline', len: 72.4, d: 'M95.3 29.9C93.6 13.1 80.8 0.4 64.6 0.3C56.4 0.3 48.6 5 43.6 12.9' },
  { group: 'outline', kind: 'outline', len: 40.9, d: 'M44.2 13.6C38.4 10.9 30.7 10.7 24.6 13.6C18.9 16.4 15.3 22.4 15.7 30.9' },
  { group: 'outline', kind: 'outline', len: 65.8, d: 'M17.3 30C7.6 32.7 0.4 40.6 0.4 51.6C0.4 64.4 9.6 75.2 22.6 75.4' },
  { group: 'outline', kind: 'outline', len: 84, d: 'M17.5 75.5C40 75 68 76.1 101.5 75.3' },
  { group: 'outline', kind: 'outline', len: 77.6, d: 'M95.8 75.5C108.4 75.5 118.3 65.6 118.3 52.3C118.3 39.2 107.9 29.2 94.4 29.3C92.6 29.3 91.2 29.6 90 30.1' },
  // loose second pass
  { group: 'accent', kind: 'retrace', len: 54.8, d: 'M47.2 10.6C52.6 4.2 59.2 1.7 65.9 1.9C77.4 2.3 87.6 9.9 91.4 20.4' },
  { group: 'accent', kind: 'retrace', len: 19.9, d: 'M3.2 44.8C5.8 38.6 10.9 34.1 17.8 32.4' },
  // volume curls
  { group: 'accent', kind: 'detail', len: 19.3, d: 'M58.4 13.4C63.8 9.6 71.4 9.9 76.2 14.6' },
  { group: 'accent', kind: 'detail', len: 16.9, d: 'M8.6 55.8C8.4 49.8 11.7 44.6 17.2 42.6' },
  { group: 'accent', kind: 'detail', len: 14.5, d: 'M104.6 43.2C109.4 45.2 112.3 49.4 112.6 54.4' },
  // wind
  { group: 'accent', kind: 'wind', len: 14.5, d: 'M122.4 60.2C127 59.4 131.6 59.6 136.8 60.6' },
  { group: 'accent', kind: 'wind', len: 9.4, d: 'M125.6 66.4C129 66 132 66.1 135 66.6' },
]
