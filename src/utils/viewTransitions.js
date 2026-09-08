/**
 * Route view-transition helpers.
 * React Router 7 owns document.startViewTransition via { viewTransition: true }.
 * Direction is expressed as data-vt on <html> so CSS ::view-transition-* recipes
 * can key off nav-forward / nav-back (list → detail vs back).
 */

export function routeDepth(pathname) {
  if (!pathname) return 0
  if (pathname.startsWith('/blog/')) return 2
  if (pathname === '/blog') return 1
  return 0
}

export function transitionType(fromPath, toPath) {
  return routeDepth(toPath) >= routeDepth(fromPath) ? 'nav-forward' : 'nav-back'
}

function sanitizeName(id) {
  return String(id).replace(/[^a-zA-Z0-9_-]/g, '-')
}

/** CSS view-transition-name for a blog post title (shared list ↔ detail). */
export function blogTitleTransitionName(slug) {
  return `blog-title-${sanitizeName(slug)}`
}

/** CSS view-transition-name for a focused skill (HUD ↔ chip). */
export function skillTransitionName(label) {
  return `skill-${sanitizeName(label)}`
}

export function setTransitionType(type) {
  document.documentElement.dataset.vt = type
}

export function clearTransitionType() {
  delete document.documentElement.dataset.vt
}

/**
 * Navigate with a typed view transition. Modified-click / new-tab is not
 * intercepted — callers should only use this from primary left-clicks.
 */
export function navigateTyped(navigate, to, fromPath) {
  const type = transitionType(fromPath, typeof to === 'string' ? to : to.pathname)
  setTransitionType(type)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  navigate(to, { viewTransition: !prefersReduced })

  window.setTimeout(clearTransitionType, 480)
}

export function isModifiedClick(event) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  )
}
