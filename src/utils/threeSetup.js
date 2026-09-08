import * as THREE from 'three'

/**
 * Create a WebGLRenderer configured for portfolio canvases:
 * - alpha background so CSS colours show through
 * - antialias on desktop, off on mobile for performance
 * - DPR capped at 1.5 to stay GPU-budget-safe
 */
export function createRenderer(canvas) {
  const dpr = Math.min(window.devicePixelRatio, 1.5)
  const isMobile = window.innerWidth < 768

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'low-power',
  })

  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  return renderer
}

/**
 * Returns an updater function. Call it on resize to keep renderer +
 * camera in sync. Supports both Perspective and Orthographic cameras.
 * Sizes against the canvas container, never the window.
 */
export function makeResizeHandler(renderer, camera, container) {
  return () => {
    const w = container.clientWidth
    const h = container.clientHeight
    if (w === 0 || h === 0) return
    renderer.setSize(w, h, false)

    if (camera.isPerspectiveCamera) {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
  }
}

/**
 * Observe the canvas container (not the window) so flex/grid layouts
 * keep the renderer in aspect. Returns an unsubscribe function.
 */
export function observeResize(container, onResize) {
  const ro = new ResizeObserver(() => onResize())
  ro.observe(container)
  onResize()
  return () => ro.disconnect()
}

/**
 * Recursively dispose a Three.js scene (geometries, materials, textures)
 * and the renderer itself. Call on component unmount to prevent leaks.
 */
export function disposeScene(scene, renderer) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach((m) => {
        Object.values(m).forEach((val) => {
          if (val && typeof val.dispose === 'function') val.dispose()
        })
        m.dispose()
      })
    }
  })
  renderer.dispose()
}

/**
 * Read a CSS custom property from :root as a hex integer.
 * Falls back to `fallback` if the property is missing.
 */
export function cssColorToHex(prop, fallback = 0xffffff) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(prop)
    .trim()
  if (!raw) return fallback
  // Handle both '#rrggbb' and 'rgb(r, g, b)'
  const hex = raw.startsWith('#') ? raw : null
  return hex ? parseInt(hex.replace('#', ''), 16) : fallback
}
