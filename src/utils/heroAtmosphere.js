import * as THREE from 'three'
import {
  createRenderer,
  makeResizeHandler,
  observeResize,
  disposeScene,
  cssColorToHex,
} from './threeSetup'

const PACKET_COUNT_DESKTOP = 56
const PACKET_COUNT_MOBILE = 22

/**
 * Subtle packet fog for the hero — same world as the Signal Lattice
 * (octahedron work-units, brass rim) without competing with the SVG topology
 * or the interactive hex lattice. No bloom, no orbiting logos.
 */
export function createHeroAtmosphere(canvas) {
  const container = canvas.parentElement
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40)
  camera.position.set(0, 0.2, 7.5)

  const renderer = createRenderer(canvas)
  const resize = makeResizeHandler(renderer, camera, container)

  const hemi = new THREE.HemisphereLight(0x8a96a8, 0x2a241c, 0.35)
  scene.add(hemi)
  const brass = new THREE.DirectionalLight(0xb49a6e, 0.85)
  brass.position.set(3.2, 2.4, 4)
  scene.add(brass)

  const count = window.innerWidth < 768 ? PACKET_COUNT_MOBILE : PACKET_COUNT_DESKTOP
  const geo = new THREE.OctahedronGeometry(0.085, 0)
  const mat = new THREE.MeshStandardMaterial({
    color: 0xc4b89a,
    roughness: 0.35,
    metalness: 0.55,
    transparent: true,
    opacity: 0.72,
    fog: true,
  })
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  scene.add(mesh)

  const dummy = new THREE.Object3D()
  const seeds = new Float32Array(count * 6)
  for (let i = 0; i < count; i++) {
    const o = i * 6
    seeds[o] = (Math.random() - 0.5) * 11
    seeds[o + 1] = (Math.random() - 0.5) * 6.5
    seeds[o + 2] = (Math.random() - 0.5) * 5
    seeds[o + 3] = 0.35 + Math.random() * 0.7
    seeds[o + 4] = 0.08 + Math.random() * 0.14
    seeds[o + 5] = Math.random() * Math.PI * 2
  }

  function applyTheme() {
    const bg = cssColorToHex('--bg', 0x090b10)
    scene.fog = new THREE.FogExp2(bg, 0.055)
    const accent = cssColorToHex('--accent', 0xb49a6e)
    brass.color.setHex(accent)
    const light = document.documentElement.getAttribute('data-theme') === 'light'
    mat.color.setHex(light ? 0x8a7348 : 0xc4b89a)
    mat.opacity = light ? 0.45 : 0.78
    hemi.intensity = light ? 0.7 : 0.5
    brass.intensity = light ? 0.55 : 0.85
  }

  applyTheme()

  let visible = false
  let reduced = false
  let raf = 0
  const clock = new THREE.Clock()

  function writeInstances(elapsed) {
    for (let i = 0; i < count; i++) {
      const o = i * 6
      const x = seeds[o] + Math.sin(elapsed * 0.22 + seeds[o + 5]) * 0.35
      let y = seeds[o + 1] + elapsed * seeds[o + 4]
      const z = seeds[o + 2]
      const span = 3.6
      y = ((y + span) % (span * 2)) - span
      dummy.position.set(x, y, z)
      dummy.rotation.set(elapsed * 0.4 + i, elapsed * 0.55 + seeds[o + 5], 0)
      dummy.scale.setScalar(seeds[o + 3])
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }

  function tick() {
    raf = 0
    if (!visible) return
    const elapsed = clock.elapsedTime
    if (!reduced) writeInstances(elapsed)
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }

  function start() {
    if (raf) return
    clock.start()
    raf = requestAnimationFrame(tick)
  }

  return {
    resize,
    unobserve: observeResize(container, resize),
    setTheme: applyTheme,
    setVisible(v) {
      visible = v
      if (v && !raf) start()
    },
    setReducedMotion(v) {
      reduced = v
      if (v) {
        writeInstances(0)
        renderer.render(scene, camera)
      }
    },
    dispose() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      geo.dispose()
      mat.dispose()
      disposeScene(scene, renderer)
    },
  }
}
