const NAV_START_EVENT = 'app:navigate-start'
const NAV_END_EVENT = 'app:navigate-end'

export function navigateToSection(selector) {
  const target = document.querySelector(selector)
  if (!target) return

  window.dispatchEvent(new CustomEvent(NAV_START_EVENT))
  target.scrollIntoView({ behavior: 'smooth' })

  // Approximate completion of smooth scroll for in-page transitions.
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent(NAV_END_EVENT))
  }, 650)
}

export function navigateToTop() {
  window.dispatchEvent(new CustomEvent(NAV_START_EVENT))
  window.scrollTo({ top: 0, behavior: 'smooth' })

  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent(NAV_END_EVENT))
  }, 650)
}

export const appNavigationEvents = {
  start: NAV_START_EVENT,
  end: NAV_END_EVENT,
}
