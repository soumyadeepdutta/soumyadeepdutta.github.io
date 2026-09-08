import * as THREE from 'three'
import {
  createRenderer,
  makeResizeHandler,
  observeResize,
  disposeScene,
  cssColorToHex,
} from './threeSetup'

/** Pipeline order (ingress → egress) — narrative, not skills.js order */
const STRATA = [
  { key: 'Backend & Languages', edge: 0xb49a6e, y: 3.6, span: 2.4, radius: 0.38 },
  { key: 'Architecture & Security', edge: 0x5b7fa5, y: 2.2, span: 3.2, radius: 0.34 },
  { key: 'AWS Cloud Infrastructure', edge: 0xb49a6e, y: 0.8, span: 4.0, radius: 0.32 },
  { key: 'Databases', edge: 0x5a9e7a, y: -0.6, span: 1.4, radius: 0.42 },
  { key: 'DevOps & Observability', edge: 0x7a6b9a, y: -2.0, span: 2.8, radius: 0.36 },
  { key: 'Tooling & AI Ecosystem', edge: 0x7a6b9a, y: -3.4, span: 3.6, radius: 0.34 },
]

const FACE_DARK = 0x12161c
const FACE_LIGHT = 0xf2f3f6
const PACKET = 0xd4d0c8
const GLYPH_SIZE = 256

function isLightTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light'
}

function glyphInk() {
  return isLightTheme() ? '#3a342c' : '#e6e1d6'
}

function initials(label) {
  const cleaned = label
    .replace(/\(.*?\)/g, '')
    .replace(/[/\-–—]/g, ' ')
    .trim()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase()
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function paintGlyph(ctx, label, ink) {
  const size = GLYPH_SIZE
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = ink
  ctx.globalAlpha = 0.92
  ctx.font = '600 52px "IBM Plex Mono", ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = isLightTheme() ? 'rgba(255,255,255,0.65)' : 'rgba(9,11,16,0.85)'
  ctx.shadowBlur = 8
  ctx.fillText(initials(label), size / 2, size / 2 + 2)
  ctx.shadowBlur = 0
  ctx.globalAlpha = 1
}

function makeGlyphTexture(label) {
  const canvas = document.createElement('canvas')
  canvas.width = GLYPH_SIZE
  canvas.height = GLYPH_SIZE
  const ctx = canvas.getContext('2d')
  paintGlyph(ctx, label, glyphInk())
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  tex.needsUpdate = true
  tex.userData.canvas = canvas
  tex.userData.label = label
  return tex
}

function layoutRow(count, span, zOffset = 0) {
  if (count === 1) return [{ x: 0, z: zOffset }]
  const positions = []
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1)
    positions.push({ x: -span + t * span * 2, z: zOffset })
  }
  return positions
}

function layoutNodes(items, span) {
  const n = items.length
  if (n <= 6) return layoutRow(n, span, 0).map((p, i) => ({ ...p, item: items[i] }))

  const top = Math.ceil(n / 2)
  const bot = n - top
  const topPos = layoutRow(top, span, 0.55)
  const botPos = layoutRow(bot, span * 0.92, -0.55)
  const shift = (span / Math.max(bot, 1)) * 0.15
  return [
    ...topPos.map((p, i) => ({ ...p, item: items[i] })),
    ...botPos.map((p, i) => ({ x: p.x + shift, z: p.z, item: items[top + i] })),
  ]
}

function nearestLinks(fromNodes, toNodes) {
  const edges = []
  fromNodes.forEach((a) => {
    const scored = toNodes
      .map((b) => ({ b, d: Math.abs(a.x - b.x) + Math.abs(a.z - b.z) * 0.5 }))
      .sort((u, v) => u.d - v.d)
    const take = Math.min(2, scored.length)
    for (let i = 0; i < take; i++) {
      edges.push({ a, b: scored[i].b })
    }
  })
  return edges
}

function faceColor() {
  return isLightTheme() ? FACE_LIGHT : FACE_DARK
}

/**
 * Create the Signal Lattice scene on a canvas.
 * @returns {{ resize, setPointer, pick, setActiveLabel, setTheme, setVisible, setReducedMotion, cycleFocus, labels, dispose }}
 */
export function createSkillsLattice(canvas, { skills, onHoverChange } = {}) {
  const container = canvas.parentElement

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40)
  camera.position.set(0, 3.8, 10.6)
  camera.lookAt(0, 0, 0)

  const renderer = createRenderer(canvas)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  const resize = makeResizeHandler(renderer, camera, container)

  const ambient = new THREE.AmbientLight(0xffffff, 0.14)
  scene.add(ambient)
  const hemi = new THREE.HemisphereLight(0x9aa8b8, 0x3a3228, 0.42)
  scene.add(hemi)
  const key = new THREE.DirectionalLight(0xe8d5b0, 0.62)
  key.position.set(4.2, 7.2, 5)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x4d6280, 0.22)
  fill.position.set(-5, 1.6, 3.2)
  scene.add(fill)
  const rim = new THREE.DirectionalLight(0xb49a6e, 0.2)
  rim.position.set(0.4, -1.2, -6.5)
  scene.add(rim)

  const root = new THREE.Group()
  scene.add(root)

  const skillByCat = Object.fromEntries(skills.map((c) => [c.category, c.items]))
  const nodeMeshes = []
  const stratumGroups = []
  const edgePairs = []
  const textures = []

  const strataNodes = STRATA.map((def) => {
    const items = skillByCat[def.key] || []
    const color = new THREE.Color(def.edge)
    if (isLightTheme()) color.multiplyScalar(0.78)
    const group = new THREE.Group()
    group.userData.stratumKey = def.key
    group.userData.baseY = def.y
    group.position.y = def.y
    root.add(group)
    stratumGroups.push(group)

    const laid = layoutNodes(items, def.span)
    const nodes = laid.map(({ x, z, item }) => {
      const geo = new THREE.CylinderGeometry(def.radius, def.radius, 0.05, 6)
      geo.rotateY(Math.PI / 6)
      const mat = new THREE.MeshStandardMaterial({
        color: faceColor(),
        roughness: 0.58,
        metalness: 0.32,
        transparent: true,
        opacity: 1,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, 0, z)
      mesh.userData = {
        type: 'skill',
        label: item.label,
        category: def.key,
        baseScale: 1,
        edgeColor: color.clone(),
      }

      const edgeGeo = new THREE.CylinderGeometry(def.radius * 1.03, def.radius * 1.03, 0.052, 6)
      edgeGeo.rotateY(Math.PI / 6)
      const edgeMat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.62,
      })
      const edge = new THREE.Mesh(edgeGeo, edgeMat)
      mesh.add(edge)
      mesh.userData.edge = edge

      const glyphTex = makeGlyphTexture(item.label)
      textures.push(glyphTex)
      const glyphMat = new THREE.MeshBasicMaterial({
        map: glyphTex,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      })
      const glyph = new THREE.Mesh(new THREE.CircleGeometry(def.radius * 0.58, 28), glyphMat)
      glyph.rotation.x = -Math.PI / 2
      glyph.position.y = 0.028
      mesh.add(glyph)
      mesh.userData.glyphTex = glyphTex

      const ringGeo = new THREE.RingGeometry(def.radius * 1.18, def.radius * 1.28, 6)
      ringGeo.rotateZ(Math.PI / 6)
      const ringMat = new THREE.MeshBasicMaterial({
        color: cssColorToHex('--accent', 0xb49a6e),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.032
      mesh.add(ring)
      mesh.userData.ring = ring

      group.add(mesh)
      nodeMeshes.push(mesh)
      return { mesh, x, y: def.y, z, label: item.label, category: def.key }
    })

    return { def, group, nodes }
  })

  const edgePositions = []
  for (let i = 0; i < strataNodes.length - 1; i++) {
    const links = nearestLinks(strataNodes[i].nodes, strataNodes[i + 1].nodes)
    links.forEach(({ a, b }) => {
      edgePairs.push({
        from: a,
        to: b,
        fromCat: a.category,
        toCat: b.category,
      })
      edgePositions.push(a.x, a.y, a.z, b.x, b.y, b.z)
    })
  }

  const aws = strataNodes[2].nodes
  const devops = strataNodes[4].nodes
  aws.forEach((a, idx) => {
    if (idx % 3 !== 0) return
    const b = devops[idx % devops.length]
    edgePairs.push({ from: a, to: b, fromCat: a.category, toCat: b.category, skip: true })
    edgePositions.push(a.x, a.y, a.z, b.x, b.y, b.z)
  })

  const edgeGeo = new THREE.BufferGeometry()
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3))
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x6b7280,
    transparent: true,
    opacity: 0.22,
  })
  const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat)
  root.add(edgeLines)

  const packetGeo = new THREE.OctahedronGeometry(0.07, 0)
  const packets = []
  const maxPackets = () => (window.innerWidth < 1024 ? 6 : 12)

  function spawnPacket() {
    if (packets.length >= maxPackets() || reducedMotion || !visible) return
    const startEdges = edgePairs.filter((e) => e.fromCat === STRATA[0].key)
    if (!startEdges.length) return
    const edge = startEdges[Math.floor(Math.random() * startEdges.length)]
    const pMat = new THREE.MeshStandardMaterial({
      color: PACKET,
      roughness: 0.35,
      metalness: 0.45,
      transparent: true,
      opacity: 0.55,
      emissive: new THREE.Color(PACKET),
      emissiveIntensity: 0.18,
    })
    const pMesh = new THREE.Mesh(packetGeo, pMat)
    pMesh.position.set(edge.from.x, edge.from.y, edge.from.z)
    root.add(pMesh)
    packets.push({
      mesh: pMesh,
      edge,
      t: 0,
      speed: 0.55 + Math.random() * 0.25,
      dwell: 0,
      tintCat: edge.toCat,
    })
  }

  function advancePacket(p, dt) {
    if (p.dwell > 0) {
      p.dwell -= dt
      return
    }
    p.t += p.speed * dt
    if (p.t >= 1) {
      p.dwell = 0.18
      p.t = 0
      const at = p.edge.to
      const nexts = edgePairs.filter((e) => e.from.label === at.label && e.from.category === at.category)
      if (!nexts.length) {
        root.remove(p.mesh)
        p.mesh.material.dispose()
        packets.splice(packets.indexOf(p), 1)
        return
      }
      p.edge = nexts[Math.floor(Math.random() * nexts.length)]
      const stratum = STRATA.find((s) => s.key === p.edge.toCat)
      if (stratum) {
        const c = new THREE.Color(stratum.edge)
        p.mesh.material.color.copy(c).lerp(new THREE.Color(PACKET), 0.55)
        p.mesh.material.emissive.copy(c).multiplyScalar(0.25)
      }
    }
    const { from, to } = p.edge
    const u = p.t * p.t * (3 - 2 * p.t)
    p.mesh.position.set(
      from.x + (to.x - from.x) * u,
      from.y + (to.y - from.y) * u,
      from.z + (to.z - from.z) * u,
    )
    p.mesh.rotation.y += dt * 1.2
  }

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(-999, -999)
  let hovered = null
  let locked = null
  let visible = false
  let reducedMotion = false
  let introT = 0
  let introDone = false
  let spawnAcc = 0
  let raf = 0
  const clock = new THREE.Clock()
  const targetCam = { yaw: 0, pitch: 0 }
  const camOffset = { yaw: 0, pitch: 0 }
  const baseCam = new THREE.Vector3(0, 3.8, 10.6)

  function applyFogAndLights() {
    const bg = cssColorToHex('--bg', 0x090b10)
    scene.fog = new THREE.FogExp2(bg, isLightTheme() ? 0.028 : 0.04)
    const accent = cssColorToHex('--accent', 0xb49a6e)
    key.color.setHex(isLightTheme() ? 0xf3ead4 : 0xe8d5b0)
    rim.color.setHex(accent)
    hemi.intensity = isLightTheme() ? 0.58 : 0.42
    ambient.intensity = isLightTheme() ? 0.28 : 0.14
    renderer.toneMappingExposure = isLightTheme() ? 1.12 : 1.05
  }

  function setNodeFocus(mesh, mode) {
    const edge = mesh.userData.edge
    const ring = mesh.userData.ring
    if (mode === 'idle') {
      edge.material.opacity = 0.62
      mesh.material.opacity = 1
      mesh.material.emissive?.setHex(0x000000)
      mesh.scale.setScalar(1)
      ring.material.opacity = 0
    } else if (mode === 'dim') {
      edge.material.opacity = 0.18
      mesh.material.opacity = 0.32
      mesh.scale.setScalar(1)
      ring.material.opacity = 0
    } else if (mode === 'hot') {
      edge.material.opacity = 1
      mesh.material.color.set(isLightTheme() ? 0xffffff : 0x1a212c)
      mesh.material.opacity = 1
      mesh.scale.setScalar(1.08)
      ring.material.opacity = 0
    } else if (mode === 'selected') {
      edge.material.opacity = 1
      mesh.material.color.set(isLightTheme() ? 0xffffff : 0x1a212c)
      mesh.material.opacity = 1
      mesh.scale.setScalar(1.08)
      ring.material.opacity = 0.92
    }
  }

  function applyFocus() {
    const active = locked || hovered
    if (!active) {
      nodeMeshes.forEach((m) => {
        m.material.color.set(faceColor())
        setNodeFocus(m, 'idle')
      })
      edgeMat.opacity = 0.22
      onHoverChange?.(null)
      return
    }
    const cat = active.userData.category
    nodeMeshes.forEach((m) => {
      m.material.color.set(faceColor())
      if (m === active) setNodeFocus(m, locked === m ? 'selected' : 'hot')
      else if (m.userData.category === cat) setNodeFocus(m, 'idle')
      else setNodeFocus(m, 'dim')
    })
    edgeMat.opacity = 0.12
    onHoverChange?.({
      label: active.userData.label,
      category: active.userData.category,
      locked: !!locked,
    })
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObjects(nodeMeshes, false)
    return hits[0]?.object ?? null
  }

  function setPointer(nx, ny, { click = false, emptyClick = false } = {}) {
    pointer.x = nx
    pointer.y = ny

    if (window.innerWidth > 1024) {
      targetCam.yaw = nx * 0.18
      targetCam.pitch = ny * 0.1
    }

    if (emptyClick) {
      locked = null
      hovered = null
      applyFocus()
      return
    }

    const hit = pick()
    if (click) {
      if (hit) locked = locked === hit ? null : hit
      else locked = null
      hovered = hit
      applyFocus()
      return
    }

    if (hit !== hovered && !locked) {
      hovered = hit
      applyFocus()
    } else if (locked) {
      hovered = hit
    }
  }

  function setActiveLabel(label) {
    const mesh = nodeMeshes.find((m) => m.userData.label === label)
    locked = mesh || null
    hovered = mesh || null
    applyFocus()
  }

  function cycleFocus(dir) {
    if (!nodeMeshes.length) return
    const current = locked || hovered
    const idx = current ? nodeMeshes.indexOf(current) : -1
    const next = nodeMeshes[(idx + dir + nodeMeshes.length) % nodeMeshes.length]
    locked = next
    hovered = next
    applyFocus()
  }

  function setTheme() {
    applyFogAndLights()
    const ink = glyphInk()
    const face = faceColor()
    strataNodes.forEach(({ def, nodes }) => {
      const color = new THREE.Color(def.edge)
      if (isLightTheme()) color.multiplyScalar(0.78)
      nodes.forEach((n) => {
        n.mesh.material.color.set(face)
        n.mesh.userData.edge.material.color.copy(color)
        n.mesh.userData.edgeColor.copy(color)
        n.mesh.userData.ring.material.color.set(cssColorToHex('--accent', 0xb49a6e))
        const tex = n.mesh.userData.glyphTex
        if (tex?.userData?.canvas) {
          paintGlyph(tex.userData.canvas.getContext('2d'), tex.userData.label, ink)
          tex.needsUpdate = true
        }
      })
    })
    applyFocus()
  }

  function setVisible(v) {
    visible = v
    if (v && !raf) start()
  }

  function setReducedMotion(v) {
    reducedMotion = v
    if (v) {
      while (packets.length) {
        const p = packets.pop()
        root.remove(p.mesh)
        p.mesh.material.dispose()
      }
      introDone = true
      introT = 1
      stratumGroups.forEach((g) => {
        g.scale.setScalar(1)
        g.position.y = g.userData.baseY
        g.children.forEach((c) => {
          if (c.material) c.material.opacity = 1
        })
      })
    }
  }

  function tick() {
    raf = 0
    if (!visible) return

    const dt = Math.min(clock.getDelta(), 0.05)
    const elapsed = clock.elapsedTime

    if (!introDone && !reducedMotion) {
      introT = Math.min(1, introT + dt / 0.45)
      stratumGroups.forEach((g, i) => {
        const local = Math.min(1, Math.max(0, (introT * 6 - i * 0.35) / 1))
        const e = 1 - Math.pow(1 - local, 3)
        g.scale.setScalar(0.92 + 0.08 * e)
        g.position.y = g.userData.baseY + (1 - e) * 0.35
        g.traverse((obj) => {
          if (obj.material && obj.material.opacity !== undefined && obj.userData?.type === 'skill') {
            obj.material.opacity = e
          }
        })
      })
      if (introT >= 1) introDone = true
    }

    camOffset.yaw += (targetCam.yaw - camOffset.yaw) * 0.08
    camOffset.pitch += (THREE.MathUtils.clamp(targetCam.pitch, -0.14, 0.38) - camOffset.pitch) * 0.08
    const yaw = camOffset.yaw
    const pitch = camOffset.pitch
    camera.position.set(
      baseCam.x + yaw * 3.2,
      baseCam.y + pitch * 2.4,
      baseCam.z,
    )
    camera.lookAt(yaw * 0.6, pitch * 0.8, 0)

    const active = locked || hovered
    if (active?.userData?.edge) {
      const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(elapsed * ((Math.PI * 2) / 2.4)))
      active.userData.edge.material.opacity = pulse
    }

    if (!reducedMotion && introDone) {
      spawnAcc += dt
      if (spawnAcc >= 0.9) {
        spawnAcc = 0
        spawnPacket()
      }
      const slow = hovered || locked ? 0.6 : 1
      for (let i = packets.length - 1; i >= 0; i--) {
        advancePacket(packets[i], dt * slow)
      }
    }

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }

  function start() {
    if (raf) return
    clock.start()
    raf = requestAnimationFrame(tick)
  }

  applyFogAndLights()
  const unobserve = observeResize(container, resize)

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stratumGroups.forEach((g) => {
      g.scale.setScalar(0.92)
      g.position.y = g.userData.baseY + 0.35
      g.traverse((obj) => {
        if (obj.userData?.type === 'skill' && obj.material) {
          obj.material.opacity = 0
        }
      })
    })
  }

  return {
    resize,
    setPointer,
    pick,
    setActiveLabel,
    setTheme,
    setVisible,
    setReducedMotion,
    cycleFocus,
    labels: nodeMeshes.map((m) => m.userData.label),
    dispose() {
      unobserve()
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      packets.forEach((p) => {
        root.remove(p.mesh)
        p.mesh.material.dispose()
      })
      textures.forEach((t) => t.dispose())
      disposeScene(scene, renderer)
    },
  }
}
