import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import styles from './ExperienceDiagram.module.css'
import { getTechIcon } from './techIcons'
import { FiGlobe, FiDatabase, FiActivity, FiLock, FiTerminal, FiCpu } from 'react-icons/fi'
import { FaAws } from 'react-icons/fa'

const VIEW_W = 800
const VIEW_H = 400
const CX = 400
const CY = 200
const NODE_W = 154
const NODE_H = 36
const HUB_R = 46

const X = {
  leftOuter: 48,
  leftInner: 114,
  rightInner: VIEW_W - 114 - NODE_W,
  rightOuter: VIEW_W - 48 - NODE_W,
}

const Y = {
  topFar: 38,
  topMid: 82,
  topNear: 126,
  botNear: VIEW_H - 126 - NODE_H,
  botMid: VIEW_H - 82 - NODE_H,
  botFar: VIEW_H - 38 - NODE_H,
}

const WING = {
  security: { color: '#38bdf8', label: 'SECURITY & INGRESS', lx: 200, ly: 22 },
  data: { color: '#a78bfa', label: 'DATABASES & CACHE', lx: 600, ly: 22 },
  obs: { color: '#4ade80', label: 'OBSERVABILITY & CI/CD', lx: 200, ly: 388 },
  analytics: { color: '#fbbf24', label: 'EVENT & ANALYTICS', lx: 600, ly: 388 },
}

function box(x, y) {
  return { x, y, w: NODE_W, h: NODE_H, mx: x + NODE_W / 2, my: y + NODE_H / 2 }
}

function spokePath(node) {
  const dx = node.mx - CX
  const dy = node.my - CY
  const dist = Math.hypot(dx, dy) || 1
  const ux = dx / dist
  const uy = dy / dist
  const startX = CX + ux * HUB_R
  const startY = CY + uy * HUB_R
  const t = Math.min(NODE_W / 2 / Math.abs(ux), NODE_H / 2 / Math.abs(uy))
  const endX = node.mx - ux * (t + 2)
  const endY = node.my - uy * (t + 2)
  return `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`
}

const COMPANIES = [
  { id: 'all', label: 'All Systems' },
  { id: 'kfin', label: 'KFin Tech' },
  { id: 'airdit', label: 'Airdit Software' },
  { id: 'techno', label: 'Techno Exponent' },
  { id: '99ideas', label: '99ideas SaaS' },
]

const CORE_HUB = {
  id: 'core',
  title: 'NestJS / AWS Core',
  subtitle: 'Microservices & CDK',
  category: 'CORE HUB',
  iconKey: 'nestjs',
  fallbackIcon: FiCpu,
  badge: '700k+ Req/Day',
  desc: 'Central high-throughput backend core running containerized NestJS microservices & AWS CDK provisioned infrastructure.',
}

const RADIAL_NODES = [
  {
    id: 'mtls',
    title: 'mTLS & JWE/JWS',
    subtitle: 'CERSAI Security',
    category: 'SECURITY & INGRESS',
    iconKey: 'jwe-jws',
    fallbackIcon: FiLock,
    companies: ['kfin'],
    wing: 'security',
    side: 'left',
    badge: '30k req/day',
    desc: 'mTLS-secured CERSAI KYC wrapper & JWE/JWS payload encryption for regulatory compliance.',
    ...box(X.leftOuter, Y.topFar),
  },
  {
    id: 'apigw',
    title: 'API Gateway',
    subtitle: 'Ingress & WAF',
    category: 'SECURITY & INGRESS',
    iconKey: 'aws-apigateway',
    fallbackIcon: FaAws,
    companies: ['kfin', 'techno'],
    wing: 'security',
    side: 'left',
    badge: 'Auth & Limits',
    desc: 'Managed API Gateway with SSL termination, JWT auth verification, and rate limiting.',
    ...box(X.leftInner, Y.topMid),
  },
  {
    id: 'rest',
    title: 'RESTful APIs',
    subtitle: 'Swagger & OpenAPI',
    category: 'SECURITY & INGRESS',
    iconKey: 'rest',
    fallbackIcon: FiGlobe,
    companies: ['kfin', 'airdit', 'techno', '99ideas'],
    wing: 'security',
    side: 'left',
    badge: 'Production APIs',
    desc: 'Swagger-documented RESTful web and mobile APIs serving enterprise platforms.',
    ...box(X.leftOuter, Y.topNear),
  },
  {
    id: 'mongodb',
    title: 'MongoDB',
    subtitle: 'Corporate SIP',
    category: 'DATABASES & CACHE',
    iconKey: 'mongodb',
    fallbackIcon: FiDatabase,
    companies: ['kfin'],
    wing: 'data',
    side: 'right',
    badge: 'Document Store',
    desc: 'High-throughput MongoDB document database for Group SIP corporate investment portal.',
    ...box(X.rightOuter, Y.topFar),
  },
  {
    id: 'redis',
    title: 'ElastiCache Redis',
    subtitle: 'Sub-ms Cache',
    category: 'DATABASES & CACHE',
    iconKey: 'redis',
    fallbackIcon: FiDatabase,
    companies: ['kfin', 'airdit'],
    wing: 'data',
    side: 'right',
    badge: 'In-Memory',
    desc: 'Sub-millisecond Redis caching layer storing session state, API rate limits, and hot queries.',
    ...box(X.rightInner, Y.topMid),
  },
  {
    id: 'postgres',
    title: 'PostgreSQL',
    subtitle: 'ACID Transactions',
    category: 'DATABASES & CACHE',
    iconKey: 'postgresql',
    fallbackIcon: FiDatabase,
    companies: ['airdit', 'techno', '99ideas'],
    wing: 'data',
    side: 'right',
    badge: 'Relational DB',
    desc: 'Primary transactional PostgreSQL databases supporting indexed schema queries for SaaS platforms.',
    ...box(X.rightOuter, Y.topNear),
  },
  {
    id: 'prometheus',
    title: 'Prometheus / Grafana',
    subtitle: 'Metrics & Alerting',
    category: 'OBSERVABILITY & CI/CD',
    iconKey: 'prometheus',
    fallbackIcon: FiActivity,
    companies: ['kfin'],
    wing: 'obs',
    side: 'left',
    badge: 'Real-time Metrics',
    desc: 'Full-stack metric scraping with Prometheus and custom Grafana operational dashboards.',
    ...box(X.leftOuter, Y.botNear),
  },
  {
    id: 'tempo',
    title: 'Tempo Tracing',
    subtitle: 'Distributed Trace',
    category: 'OBSERVABILITY & CI/CD',
    iconKey: 'tempo',
    fallbackIcon: FiActivity,
    companies: ['kfin'],
    wing: 'obs',
    side: 'left',
    badge: 'Trace Inspection',
    desc: 'End-to-end distributed tracing across microservices to isolate latency bottlenecks.',
    ...box(X.leftInner, Y.botMid),
  },
  {
    id: 'cicd',
    title: 'Jenkins & Docker',
    subtitle: 'ECR Layer Caching',
    category: 'OBSERVABILITY & CI/CD',
    iconKey: 'jenkins',
    fallbackIcon: FiTerminal,
    companies: ['kfin'],
    wing: 'obs',
    side: 'left',
    badge: '60% Faster Builds',
    desc: 'Automated Jenkins CI/CD pipelines utilizing Docker ECR layer caching to slash build times.',
    ...box(X.leftOuter, Y.botFar),
  },
  {
    id: 'sqs',
    title: 'Amazon SQS',
    subtitle: 'FIFO Async Queue',
    category: 'EVENT & ANALYTICS',
    iconKey: 'aws-sqs',
    fallbackIcon: FaAws,
    companies: ['kfin'],
    wing: 'analytics',
    side: 'right',
    badge: 'DLQ Handling',
    desc: 'Decoupled SQS message queues buffering high-volume async PDF and notification events.',
    ...box(X.rightOuter, Y.botNear),
  },
  {
    id: 'athena',
    title: 'S3 & Athena',
    subtitle: 'Parquet Data Lake',
    category: 'EVENT & ANALYTICS',
    iconKey: 'aws-athena',
    fallbackIcon: FaAws,
    companies: ['kfin', 'techno'],
    wing: 'analytics',
    side: 'right',
    badge: '< 3s Queries',
    desc: 'AWS Glue catalog + Athena enabling serverless SQL over encrypted Parquet logs (15s to < 3s speed).',
    ...box(X.rightInner, Y.botMid),
  },
  {
    id: 'firehose',
    title: 'Kinesis Firehose',
    subtitle: '10M events/day',
    category: 'EVENT & ANALYTICS',
    iconKey: 'aws-firehose',
    fallbackIcon: FaAws,
    companies: ['kfin'],
    wing: 'analytics',
    side: 'right',
    badge: 'Stream Pipeline',
    desc: 'Near real-time stream ingestion pipeline transferring application telemetry into S3 Data Lake.',
    ...box(X.rightOuter, Y.botFar),
  },
]

const SPOKE_PATHS = RADIAL_NODES.map((node, i) => ({
  id: `sp-${node.id}`,
  node: node.id,
  companies: node.companies,
  color: WING[node.wing].color,
  path: spokePath(node),
  dur: `${(2.4 + (i % 4) * 0.2).toFixed(1)}s`,
}))

function inspectNode(event, id, setActiveNode) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    setActiveNode(id)
  }
}

export default function ExperienceDiagram() {
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [activeNode, setActiveNode] = useState(null)
  const prefersReducedMotion = useReducedMotion()
  const CoreIcon = getTechIcon('nestjs') || FiCpu

  const activeNodeData =
    activeNode === 'core'
      ? CORE_HUB
      : RADIAL_NODES.find(n => n.id === activeNode)

  const isNodeActive = (node) => {
    if (activeNode) {
      if (node.id === activeNode) return true
      if (activeNode === 'core') return true
      return false
    }
    if (selectedCompany === 'all') return true
    return node.companies.includes(selectedCompany)
  }

  const isSpokeActive = (spoke) => {
    if (activeNode) {
      if (activeNode === 'core') return true
      return spoke.node === activeNode
    }
    if (selectedCompany === 'all') return true
    return spoke.companies.includes(selectedCompany)
  }

  return (
    <div className={styles.diagramCard}>
      <div className={styles.diagramHeader}>
        <div className={styles.titleRow}>
          <span className={styles.statusDot} />
          <span className={styles.titleText}>SYSTEM ARCHITECTURE MAP</span>
        </div>

        <div className={styles.companyTabs} role="group" aria-label="Filter by company">
          {COMPANIES.map(comp => (
            <button
              key={comp.id}
              type="button"
              className={`${styles.companyTab} ${selectedCompany === comp.id ? styles.companyTabActive : ''}`}
              aria-pressed={selectedCompany === comp.id}
              onClick={() => setSelectedCompany(comp.id)}
            >
              {comp.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.svgWrapper}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.diagramSvg}
          role="group"
          aria-label="System architecture map with four wings around a NestJS AWS core"
        >
          <defs>
            <pattern id="radarGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="0.8" cy="0.8" r="0.9" fill="var(--border)" opacity="0.4" />
            </pattern>
          </defs>

          <rect width={VIEW_W} height={VIEW_H} fill="url(#radarGrid)" className={styles.gridFill} />

          <circle cx={CX} cy={CY} r="88" className={styles.radarRingInner} />
          <circle cx={CX} cy={CY} r="168" className={styles.radarRingOuter} />

          {Object.entries(WING).map(([key, wing]) => (
            <text
              key={key}
              x={wing.lx}
              y={wing.ly}
              className={styles.wingLabel}
              fill={wing.color}
            >
              {wing.label}
            </text>
          ))}

          <g className={styles.spokesGroup}>
            {SPOKE_PATHS.map((sp) => {
              const active = isSpokeActive(sp)
              const showParticle = !prefersReducedMotion && active && activeNode === sp.node
              return (
                <g key={sp.id} opacity={active ? 1 : 0.12}>
                  <path
                    d={sp.path}
                    className={styles.spokeLine}
                    stroke={active ? sp.color : 'var(--border-hover)'}
                    strokeWidth={active && activeNode === sp.node ? 1.75 : 1.25}
                  />
                  {showParticle && (
                    <circle r="2.5" fill={sp.color}>
                      <animateMotion dur={sp.dur} repeatCount="indefinite" path={sp.path} />
                    </circle>
                  )}
                </g>
              )
            })}
          </g>

          <g
            className={styles.coreGroup}
            transform={`translate(${CX}, ${CY})`}
            role="button"
            tabIndex={0}
            aria-label={`${CORE_HUB.title}. ${CORE_HUB.subtitle}`}
            onMouseEnter={() => setActiveNode('core')}
            onMouseLeave={() => setActiveNode(null)}
            onFocus={() => setActiveNode('core')}
            onBlur={() => setActiveNode(null)}
            onKeyDown={event => inspectNode(event, 'core', setActiveNode)}
          >
            <circle r="54" className={styles.corePulseRing} />
            <circle r={HUB_R} className={styles.coreCircle} />
            <foreignObject x="-12" y="-22" width="24" height="24">
              <div className={styles.coreIconBox} aria-hidden="true">
                <CoreIcon className={styles.coreGlyph} />
              </div>
            </foreignObject>
            <text x="0" y="14" className={styles.coreTitle}>NestJS / AWS</text>
            <text x="0" y="25" className={styles.coreSubtitle}>Core Engine</text>
          </g>

          <g className={styles.nodesGroup}>
            {RADIAL_NODES.map((node) => {
              const active = isNodeActive(node)
              const isHovered = activeNode === node.id
              const IconComp = node.iconKey ? getTechIcon(node.iconKey) : node.fallbackIcon
              const accentX = node.side === 'left' ? node.w - 5 : 2

              return (
                <g
                  key={node.id}
                  className={styles.nodeGroup}
                  transform={`translate(${node.x}, ${node.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.title}. ${node.subtitle}`}
                  opacity={active ? 1 : 0.22}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onFocus={() => setActiveNode(node.id)}
                  onBlur={() => setActiveNode(null)}
                  onKeyDown={event => inspectNode(event, node.id, setActiveNode)}
                >
                  <rect
                    width={node.w}
                    height={node.h}
                    rx="18"
                    className={`${styles.nodePod} ${isHovered ? styles.nodePodHovered : ''} ${active ? styles.nodePodActive : ''}`}
                  />
                  <rect
                    x={accentX}
                    y="8"
                    width="3"
                    height="20"
                    rx="1.5"
                    fill={WING[node.wing].color}
                    opacity={active ? 0.9 : 0.35}
                  />
                  <foreignObject x="8" y="6" width="24" height="24">
                    <div className={styles.iconBox} aria-hidden="true">
                      {IconComp && <IconComp className={styles.serviceIcon} />}
                    </div>
                  </foreignObject>
                  <text x="36" y="16" className={styles.nodeTitle}>{node.title}</text>
                  <text x="36" y="28" className={styles.nodeSubtitle}>{node.subtitle}</text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <div className={styles.infoBanner} aria-live="polite">
        {activeNodeData ? (
          <div className={styles.infoContentActive}>
            <div className={styles.infoMeta}>
              <span className={styles.infoBadge}>{activeNodeData.category}</span>
              <strong className={styles.infoTitle}>{activeNodeData.title}</strong>
              <span className={styles.infoPill}>{activeNodeData.badge}</span>
            </div>
            <p className={styles.infoDesc}>{activeNodeData.desc}</p>
          </div>
        ) : (
          <div className={styles.infoContentDefault}>
            <span>Select the core or a pod to inspect the architecture.</span>
          </div>
        )}
      </div>
    </div>
  )
}
