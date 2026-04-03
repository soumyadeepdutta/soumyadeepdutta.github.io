import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { FaAws } from 'react-icons/fa'
import {
  SiNodedotjs,
  SiPython,
  SiTypescript,
  SiFastapi,
  SiPostgresql,
  SiRedis,
  SiMongodb,
  SiMysql,
  SiGraphql,
  SiNginx,
  SiSocketdotio,
  SiDocker,
  SiTerraform,
  SiGithubactions,
  SiLinux,
} from 'react-icons/si'

const SCENE_COLORS = {
  dark: {
    line: '#5aa9ff',
    accent: '#d9a06f',
    node: '#f4f7fb',
    haze: '#121b2f',
    compute: '#5aa9ff',
    data: '#45c486',
    edge: '#d9a06f',
    core: '#f4f7fb',
  },
  light: {
    line: '#4f87c9',
    accent: '#bf8452',
    node: '#223252',
    haze: '#eaf0f8',
    compute: '#4f87c9',
    data: '#3b9f71',
    edge: '#bf8452',
    core: '#223252',
  },
}

const CLUSTER_ORDER = ['compute', 'data', 'edge', 'core']
const CLUSTER_CENTERS = {
  compute: new THREE.Vector3(-10.8, 0.4, 0.3),
  data: new THREE.Vector3(10.6, -1.2, -0.9),
  edge: new THREE.Vector3(-2.4, 3.4, 1.4),
  core: new THREE.Vector3(2.8, -3.3, -1.3),
}

const SKILL_BADGES = {
  compute: [
    { icon: SiNodedotjs, color: '#5FA04E' },
    { icon: SiPython, color: '#3572A5' },
    { icon: SiTypescript, color: '#3178C6' },
    { icon: SiFastapi, color: '#009688' },
  ],
  data: [
    { icon: SiPostgresql, color: '#4169E1' },
    { icon: SiRedis, color: '#DC382D' },
    { icon: SiMongodb, color: '#47A248' },
    { icon: SiMysql, color: '#4479A1' },
  ],
  edge: [
    { icon: SiGraphql, color: '#E10098' },
    { icon: SiNginx, color: '#269539' },
    { icon: SiSocketdotio, color: '#25C2A0' },
    { icon: FaAws, color: '#FF9900' },
  ],
  core: [
    { icon: SiDocker, color: '#2496ED' },
    { icon: SiTerraform, color: '#844FBA' },
    { icon: SiGithubactions, color: '#2088FF' },
    { icon: SiLinux, color: '#FCC624' },
  ],
}

function getClusterColor(cluster, palette) {
  switch (cluster) {
    case 'compute':
      return palette.compute
    case 'data':
      return palette.data
    case 'edge':
      return palette.edge
    default:
      return palette.core
  }
}

async function createIconTexture(IconComponent, iconColor, clusterColor, theme) {
  try {
    const svgMarkup = renderToStaticMarkup(
      React.createElement(IconComponent, { size: 72, color: iconColor })
    )
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        const ctx = canvas.getContext('2d')
        const plateColor = theme === 'dark' ? 'rgba(10, 16, 28, 0.9)' : 'rgba(246, 249, 253, 0.92)'
        ctx.fillStyle = plateColor
        ctx.beginPath()
        ctx.arc(64, 64, 56, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = clusterColor
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(64, 64, 56, 0, Math.PI * 2)
        ctx.stroke()
        ctx.drawImage(img, 16, 16, 96, 96)
        URL.revokeObjectURL(url)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = false
        resolve(texture)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      img.src = url
    })
  } catch {
    return null
  }
}

async function createSkillSprites(nodes, palette, theme) {
  const sprites = []

  for (const cluster of CLUSTER_ORDER) {
    const clusterNodes = nodes.filter(node => node.cluster === cluster)
    const badges = SKILL_BADGES[cluster]
    if (!clusterNodes.length || !badges?.length) {
      continue
    }
    const clusterColor = getClusterColor(cluster, palette)

    for (let index = 0; index < badges.length; index += 1) {
      const badge = badges[index]
      const anchor = clusterNodes[(index * 3) % clusterNodes.length]
      const texture = await createIconTexture(badge.icon, badge.color, clusterColor, theme)
      if (!texture) {
        continue
      }

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.56,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(material)
      sprite.scale.set(0.9, 0.9, 1)
      sprite.position.copy(anchor.mesh.position)

      sprites.push({
        sprite,
        material,
        texture,
        anchor,
        cluster,
        floatPhase: Math.random() * Math.PI * 2,
      })
    }
  }

  return sprites
}

function getRouteColor(route, palette) {
  switch (route) {
    case 'compute':
      return palette.compute
    case 'data':
      return palette.data
    case 'edge':
      return palette.edge
    case 'core':
      return palette.core
    default:
      return palette.line
  }
}

function sectionToFocus(sectionId) {
  switch (sectionId) {
    case 'skills':
      return 'compute'
    case 'projects':
      return 'data'
    case 'certifications':
    case 'contact':
      return 'edge'
    case 'experience':
    case 'education':
      return 'core'
    case 'about':
    default:
      return 'cross'
  }
}

function createNodeCloud(palette) {
  const nodes = []
  const positions = []
  const links = []

  const nodeGeometry = new THREE.IcosahedronGeometry(0.085, 0)
  const clusterMaterials = {
    compute: new THREE.MeshBasicMaterial({ color: palette.compute, transparent: true, opacity: 0.82 }),
    data: new THREE.MeshBasicMaterial({ color: palette.data, transparent: true, opacity: 0.8 }),
    edge: new THREE.MeshBasicMaterial({ color: palette.edge, transparent: true, opacity: 0.86 }),
    core: new THREE.MeshBasicMaterial({ color: palette.core, transparent: true, opacity: 0.74 }),
  }

  const group = new THREE.Group()
  const nodeCount = 52

  for (let index = 0; index < nodeCount; index += 1) {
    const cluster = CLUSTER_ORDER[index % CLUSTER_ORDER.length]
    const center = CLUSTER_CENTERS[cluster]
    const xSpread = cluster === 'core' ? 6.2 : 7.6
    const ySpread = cluster === 'core' ? 2.8 : 3.4
    const zSpread = cluster === 'core' ? 2.6 : 3.0
    const x = center.x + (Math.random() - 0.5) * xSpread
    const y = center.y + (Math.random() - 0.5) * ySpread
    const z = center.z + (Math.random() - 0.5) * zSpread

    const mesh = new THREE.Mesh(nodeGeometry, clusterMaterials[cluster])
    mesh.position.set(x, y, z)
    group.add(mesh)

    nodes.push({
      mesh,
      cluster,
      baseX: x,
      baseY: y,
      baseZ: z,
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 0.45,
    })
    positions.push(new THREE.Vector3(x, y, z))
  }

  const maxConnections = 3
  const connected = Array.from({ length: nodeCount }, () => 0)
  const pairSet = new Set()
  const threshold = 4.6

  for (let index = 0; index < nodeCount; index += 1) {
    const candidates = []

    for (let other = 0; other < nodeCount; other += 1) {
      if (index === other) continue
      const distance = positions[index].distanceTo(positions[other])
      if (distance <= threshold) {
        candidates.push({ other, distance })
      }
    }

    candidates.sort((a, b) => a.distance - b.distance)

    for (const candidate of candidates) {
      if (connected[index] >= maxConnections) break
      if (connected[candidate.other] >= maxConnections) continue

      const a = Math.min(index, candidate.other)
      const b = Math.max(index, candidate.other)
      const key = `${a}:${b}`
      if (pairSet.has(key)) continue

      pairSet.add(key)
      connected[index] += 1
      connected[candidate.other] += 1

      const clusterA = nodes[a].cluster
      const clusterB = nodes[b].cluster
      const route = clusterA === clusterB ? clusterA : 'cross'

      links.push({
        start: positions[a].clone(),
        end: positions[b].clone(),
        route,
      })
    }
  }

  return {
    group,
    nodes,
    links,
    nodeGeometry,
    clusterMaterials,
    materials: Object.values(clusterMaterials),
  }
}

function createRouteLines(links, palette, theme) {
  const routeBuckets = { compute: [], data: [], edge: [], core: [], cross: [] }
  links.forEach(link => routeBuckets[link.route].push(link))

  const baseOpacity = theme === 'dark' ? 0.18 : 0.14
  const lines = []

  Object.entries(routeBuckets).forEach(([route, routeLinks]) => {
    if (routeLinks.length === 0) return

    const linePositions = new Float32Array(routeLinks.length * 6)
    routeLinks.forEach((link, index) => {
      const offset = index * 6
      linePositions[offset] = link.start.x
      linePositions[offset + 1] = link.start.y
      linePositions[offset + 2] = link.start.z
      linePositions[offset + 3] = link.end.x
      linePositions[offset + 4] = link.end.y
      linePositions[offset + 5] = link.end.z
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const material = new THREE.LineBasicMaterial({
      color: getRouteColor(route, palette),
      transparent: true,
      opacity: route === 'cross' ? baseOpacity * 0.85 : baseOpacity,
    })

    lines.push({ route, mesh: new THREE.LineSegments(geometry, material), geometry, material })
  })

  return lines
}

export default function NetworkScene({ theme, className }) {
  const mountRef = useRef(null)
  const [isEnabled, setIsEnabled] = useState(false)

  // Deterministic enable/disable for desktop + motion preference changes.
  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 901px)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateEnabled = () => {
      setIsEnabled(desktopQuery.matches && !reducedMotionQuery.matches)
    }

    updateEnabled()
    desktopQuery.addEventListener('change', updateEnabled)
    reducedMotionQuery.addEventListener('change', updateEnabled)

    return () => {
      desktopQuery.removeEventListener('change', updateEnabled)
      reducedMotionQuery.removeEventListener('change', updateEnabled)
    }
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !isEnabled) {
      return undefined
    }

    const palette = SCENE_COLORS[theme] ?? SCENE_COLORS.dark
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120)
    camera.position.set(0, 0.3, 22)

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const networkGroup = new THREE.Group()
    scene.add(networkGroup)

    const hazeGeometry = new THREE.PlaneGeometry(64, 44)
    const hazeMaterial = new THREE.MeshBasicMaterial({
      color: palette.haze,
      transparent: true,
      opacity: theme === 'dark' ? 0.06 : 0.07,
      depthWrite: false,
    })
    const haze = new THREE.Mesh(hazeGeometry, hazeMaterial)
    haze.position.set(0, -0.4, -16)
    networkGroup.add(haze)

    const { group: nodeGroup, nodes, links, nodeGeometry, materials, clusterMaterials } = createNodeCloud(palette)
    networkGroup.add(nodeGroup)

    let skillSprites = []
    let sceneAlive = true
    createSkillSprites(nodes, palette, theme).then(sprites => {
      if (!sceneAlive) {
        sprites.forEach(s => { s.material.dispose(); s.texture.dispose() })
        return
      }
      skillSprites = sprites
      sprites.forEach(({ sprite }) => networkGroup.add(sprite))
    })

    const lines = createRouteLines(links, palette, theme)
    lines.forEach(line => networkGroup.add(line.mesh))

    const ambientGeometry = new THREE.BufferGeometry()
    const ambientCount = 90
    const ambientPositions = new Float32Array(ambientCount * 3)
    const ambientBase = new Float32Array(ambientCount * 3)
    for (let index = 0; index < ambientCount; index += 1) {
      const x = (Math.random() - 0.5) * 26
      const y = (Math.random() - 0.5) * 16
      const z = -8 + Math.random() * 10
      const offset = index * 3
      ambientPositions[offset] = x
      ambientPositions[offset + 1] = y
      ambientPositions[offset + 2] = z
      ambientBase[offset] = x
      ambientBase[offset + 1] = y
      ambientBase[offset + 2] = z
    }
    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3))
    const ambientMaterial = new THREE.PointsMaterial({
      color: palette.node,
      transparent: true,
      opacity: theme === 'dark' ? 0.26 : 0.18,
      size: 0.045,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const ambientParticles = new THREE.Points(ambientGeometry, ambientMaterial)
    networkGroup.add(ambientParticles)

    const packetGeometry = new THREE.SphereGeometry(0.07, 6, 6)
    const packets = []
    const packetEdgeCount = Math.min(26, links.length)
    for (let index = 0; index < packetEdgeCount; index += 1) {
      const edge = links[(index * 5) % links.length]
      const packetMaterial = new THREE.MeshBasicMaterial({
        color: getRouteColor(edge.route, palette),
        transparent: true,
        opacity: theme === 'dark' ? 0.9 : 0.72,
      })
      const packet = new THREE.Mesh(packetGeometry, packetMaterial)
      packets.push({
        mesh: packet,
        material: packetMaterial,
        edge,
        route: edge.route,
        progress: Math.random(),
        speed: 0.12 + Math.random() * 0.22,
      })
      networkGroup.add(packet)
    }

    const accentLight = new THREE.PointLight(palette.accent, theme === 'dark' ? 1.2 : 0.9, 40)
    accentLight.position.set(6, 4, 10)
    scene.add(accentLight)

    const coolLight = new THREE.PointLight(palette.line, theme === 'dark' ? 1.0 : 0.65, 44)
    coolLight.position.set(-8, -2, 12)
    scene.add(coolLight)

    const pointer = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 }
    const scroll = { current: 0, target: 0 }
    const focus = { compute: 0.45, data: 0.45, edge: 0.45, core: 0.45, cross: 0.45 }
    let activeFocus = 'cross'
    let sectionAnchors = []
    let isVisible = !document.hidden
    let frameId = 0
    const startTime = performance.now()

    const setSize = () => {
      const { clientWidth, clientHeight } = mount
      if (!clientWidth || !clientHeight) {
        return
      }
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }

    const rebuildSectionAnchors = () => {
      const sections = Array.from(document.querySelectorAll('main section[id]'))
      sectionAnchors = sections.map(section => ({ id: section.id, top: section.offsetTop }))
    }

    const resolveActiveSection = () => {
      const probe = window.scrollY + window.innerHeight * 0.45
      let currentId = 'about'
      for (const anchor of sectionAnchors) {
        if (probe >= anchor.top) {
          currentId = anchor.id
        }
      }
      return currentId
    }

    const handlePointerMove = event => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      pointer.targetX = x * 0.65
      pointer.targetY = y * 0.28
    }

    const handlePointerLeave = () => {
      pointer.targetX = 0
      pointer.targetY = 0
    }

    const handleScroll = () => {
      const doc = document.documentElement
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1)
      scroll.target = window.scrollY / maxScroll
      activeFocus = sectionToFocus(resolveActiveSection())
    }

    const handleResize = () => {
      setSize()
      rebuildSectionAnchors()
      handleScroll()
    }

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
    }

    const animate = now => {
      frameId = window.requestAnimationFrame(animate)
      if (!isVisible) {
        return
      }

      // Use performance time directly instead of THREE.Clock (deprecated warning avoidance).
      const elapsed = (now - startTime) / 1000
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.025
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.025
      scroll.current += (scroll.target - scroll.current) * 0.03

      ;['compute', 'data', 'edge', 'core', 'cross'].forEach(route => {
        const target = route === activeFocus ? 1 : 0.35
        focus[route] += (target - focus[route]) * 0.06
      })

      networkGroup.rotation.y = elapsed * 0.03 + pointer.currentX * 0.32
      networkGroup.rotation.x = -0.08 + pointer.currentY * 0.18
      networkGroup.position.y = -scroll.current * 2.6
      networkGroup.position.x = pointer.currentX * 0.9

      camera.position.x = pointer.currentX * 1.5
      camera.position.y = 0.3 - scroll.current * 1.4 + pointer.currentY * 0.8
      camera.lookAt(pointer.currentX * 0.9, -scroll.current * 1.8, 0)

      nodes.forEach(node => {
        const clusterWeight = focus[node.cluster]
        const pulse = 1 + Math.sin(elapsed * node.speed + node.phase) * (0.18 + clusterWeight * 0.18)
        node.mesh.scale.setScalar(pulse)
        node.mesh.position.y = node.baseY + Math.sin(elapsed * node.speed * 0.6 + node.phase) * (0.1 + clusterWeight * 0.1)
        node.mesh.position.x = node.baseX + Math.cos(elapsed * node.speed * 0.35 + node.phase) * 0.08
        node.mesh.position.z = node.baseZ + Math.sin(elapsed * node.speed * 0.4 + node.phase) * 0.12
      })

      Object.entries(clusterMaterials).forEach(([cluster, material]) => {
        material.opacity = 0.42 + focus[cluster] * 0.46
      })

      skillSprites.forEach(skillSprite => {
        const clusterWeight = focus[skillSprite.cluster]
        const anchorPos = skillSprite.anchor.mesh.position
        skillSprite.sprite.position.set(
          anchorPos.x,
          anchorPos.y + 0.38 + Math.sin(elapsed * 0.9 + skillSprite.floatPhase) * 0.08,
          anchorPos.z + 0.08
        )
        const scale = 0.84 + clusterWeight * 0.34
        skillSprite.sprite.scale.set(scale, scale, 1)
        skillSprite.material.opacity = 0.24 + clusterWeight * 0.72
      })

      lines.forEach(line => {
        line.material.opacity = (line.route === 'cross' ? 0.08 : 0.12) + focus[line.route] * 0.15
      })

      const ambientArray = ambientGeometry.attributes.position.array
      for (let index = 0; index < ambientCount; index += 1) {
        const offset = index * 3
        ambientArray[offset + 1] = ambientBase[offset + 1] + Math.sin(elapsed * 0.38 + index * 0.75) * 0.14
      }
      ambientGeometry.attributes.position.needsUpdate = true

      packets.forEach(packet => {
        const routeWeight = focus[packet.route]
        packet.progress += packet.speed * (0.0018 + routeWeight * 0.0024)
        if (packet.progress > 1) {
          packet.progress -= 1
        }

        packet.material.opacity = 0.2 + routeWeight * 0.72
        packet.mesh.position.lerpVectors(packet.edge.start, packet.edge.end, packet.progress)
      })

      // Keep badge sprites facing the camera for readability.
      skillSprites.forEach(skillSprite => {
        skillSprite.sprite.quaternion.copy(camera.quaternion)
      })

      renderer.render(scene, camera)
    }

    setSize()
    rebuildSectionAnchors()
    handleScroll()
    frameId = window.requestAnimationFrame(animate)

    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      sceneAlive = false
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      nodeGeometry.dispose()
      materials.forEach(material => material.dispose())
      lines.forEach(line => {
        line.geometry.dispose()
        line.material.dispose()
      })
      hazeGeometry.dispose()
      hazeMaterial.dispose()
      ambientGeometry.dispose()
      ambientMaterial.dispose()
      packetGeometry.dispose()
      packets.forEach(packet => packet.material.dispose())
      skillSprites.forEach(skillSprite => {
        skillSprite.material.dispose()
        skillSprite.texture.dispose()
      })
      renderer.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [theme, isEnabled])

  return <div ref={mountRef} className={className} aria-hidden="true" />
}
