/**
 * Turns a list of sketch strokes into pen timing, so every line drawing on
 * the site is drawn by the same "hand": one stroke after another at an even
 * speed, with a short pen-lift between groups (objects).
 *
 * Each path needs `len` (length in its own viewBox units) and `group`.
 * Options can be overridden per group via `groups[name]`:
 *   speed        viewBox units per second
 *   minDuration  floor for tiny strokes (seconds)
 *   overlap      0–1, how much of a stroke the next one overlaps
 *   pause        seconds added when the pen moves on to this group
 *                (negative starts the group before the previous one ends)
 *
 * Returns { strokes, end } where each stroke gains `delay` and `duration`
 * (seconds) and `end` is when the last stroke finishes.
 */
export function schedulePen(
  paths,
  {
    speed,
    start = 0,
    minDuration = 0.1,
    overlap = 0,
    pause = 0,
    groups = {},
  },
) {
  let pen = start
  let previousGroup
  let end = start

  const strokes = paths.map((path) => {
    const group = groups[path.group] ?? {}
    if (previousGroup !== undefined && path.group !== previousGroup) {
      pen += group.pause ?? pause
    }
    previousGroup = path.group

    const duration = Math.max(
      group.minDuration ?? minDuration,
      path.len / (group.speed ?? speed),
    )
    const stroke = { ...path, delay: pen, duration }
    pen += duration * (1 - (group.overlap ?? overlap))
    end = Math.max(end, stroke.delay + duration)
    return stroke
  })

  return { strokes, end }
}
