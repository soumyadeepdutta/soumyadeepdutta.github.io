import { useState } from 'react'
import styles from './ExperienceDiagram.module.css'
import { getTechIcon } from './techIcons'
import { FiGlobe, FiHardDrive, FiDatabase, FiLayers, FiActivity, FiServer, FiLock, FiTerminal, FiCpu } from 'react-icons/fi'
import { FaAws } from 'react-icons/fa'

/* ── Company Tenure Data ── */
const COMPANIES = [
  { id: 'all', label: '⚡ All Systems' },
  { id: 'kfin', label: 'KFin Tech' },
  { id: 'airdit', label: 'Airdit Software' },
  { id: 'techno', label: 'Techno Exponent' },
  { id: '99ideas', label: '99ideas SaaS' },
]

/* ── Central Core Hub Node ── */
const CORE_HUB = {
  id: 'core',
  title: 'NestJS / AWS Core',
  subtitle: 'Microservices & CDK',
  category: 'CORE HUB',
  iconKey: 'nestjs',
  fallbackIcon: FiCpu,
  cx: 375,
  cy: 190,
  r: 44,
  badge: '700k+ Req/Day',
  desc: 'Central high-throughput backend core running containerized NestJS microservices & AWS CDK provisioned infrastructure.',
}

/* ── 12 Radial Orbital Nodes (4 Wings) ── */
const RADIAL_NODES = [
  /* ── Wing 1: Security & Ingress (Top-Left) ── */
  {
    id: 'mtls',
    title: 'mTLS & JWE/JWS',
    subtitle: 'CERSAI Security',
    category: 'SECURITY & INGRESS',
    iconKey: 'jwe-jws',
    fallbackIcon: FiLock,
    x: 105,
    y: 50,
    w: 135,
    h: 38,
    companies: ['kfin'],
    wing: 'security',
    badge: '30k req/day',
    desc: 'mTLS-secured CERSAI KYC wrapper & JWE/JWS payload encryption for regulatory compliance.',
  },
  {
    id: 'apigw',
    title: 'API Gateway',
    subtitle: 'Ingress & WAF',
    category: 'SECURITY & INGRESS',
    iconKey: 'aws-apigateway',
    fallbackIcon: FaAws,
    x: 215,
    y: 95,
    w: 125,
    h: 38,
    companies: ['kfin', 'techno'],
    wing: 'security',
    badge: 'Auth & Limits',
    desc: 'Managed API Gateway with SSL termination, JWT auth verification, and rate limiting.',
  },
  {
    id: 'rest',
    title: 'RESTful APIs',
    subtitle: 'Swagger & OpenAPI',
    category: 'SECURITY & INGRESS',
    iconKey: 'rest',
    fallbackIcon: FiGlobe,
    x: 80,
    y: 125,
    w: 130,
    h: 38,
    companies: ['kfin', 'airdit', 'techno', '99ideas'],
    wing: 'security',
    badge: 'Production APIs',
    desc: 'Swagger-documented RESTful web and mobile APIs serving enterprise platforms.',
  },

  /* ── Wing 2: Databases & Caching (Top-Right) ── */
  {
    id: 'mongodb',
    title: 'MongoDB',
    subtitle: 'Corporate SIP',
    category: 'DATABASES & CACHE',
    iconKey: 'mongodb',
    fallbackIcon: FiDatabase,
    x: 505,
    y: 50,
    w: 125,
    h: 38,
    companies: ['kfin'],
    wing: 'data',
    badge: 'Document Store',
    desc: 'High-throughput MongoDB document database for Group SIP corporate investment portal.',
  },
  {
    id: 'postgres',
    title: 'PostgreSQL',
    subtitle: 'ACID Transactions',
    category: 'DATABASES & CACHE',
    iconKey: 'postgresql',
    fallbackIcon: FiDatabase,
    x: 625,
    y: 95,
    w: 130,
    h: 38,
    companies: ['airdit', 'techno', '99ideas'],
    wing: 'data',
    badge: 'Relational DB',
    desc: 'Primary transactional PostgreSQL databases supporting indexed schema queries for SaaS platforms.',
  },
  {
    id: 'redis',
    title: 'ElastiCache Redis',
    subtitle: 'Sub-ms Cache',
    category: 'DATABASES & CACHE',
    iconKey: 'redis',
    fallbackIcon: FiDatabase,
    x: 540,
    y: 125,
    w: 135,
    h: 38,
    companies: ['kfin', 'airdit'],
    wing: 'data',
    badge: 'In-Memory',
    desc: 'Sub-millisecond Redis caching layer storing session state, API rate limits, and hot queries.',
  },

  /* ── Wing 3: Observability & CI/CD (Bottom-Left) ── */
  {
    id: 'prometheus',
    title: 'Prometheus / Grafana',
    subtitle: 'Metrics & Alerting',
    category: 'OBSERVABILITY & CI/CD',
    iconKey: 'prometheus',
    fallbackIcon: FiActivity,
    x: 80,
    y: 220,
    w: 145,
    h: 38,
    companies: ['kfin'],
    wing: 'obs',
    badge: 'Real-time Metrics',
    desc: 'Full-stack metric scraping with Prometheus and custom Grafana operational dashboards.',
  },
  {
    id: 'tempo',
    title: 'Tempo Tracing',
    subtitle: 'Distributed Trace',
    category: 'OBSERVABILITY & CI/CD',
    iconKey: 'tempo',
    fallbackIcon: FiActivity,
    x: 215,
    y: 250,
    w: 130,
    h: 38,
    companies: ['kfin'],
    wing: 'obs',
    badge: 'Trace Inspection',
    desc: 'End-to-end distributed tracing across microservices to isolate latency bottlenecks.',
  },
  {
    id: 'cicd',
    title: 'Jenkins & Docker',
    subtitle: 'ECR Layer Caching',
    category: 'OBSERVABILITY & CI/CD',
    iconKey: 'jenkins',
    fallbackIcon: FiTerminal,
    x: 105,
    y: 295,
    w: 135,
    h: 38,
    companies: ['kfin'],
    wing: 'obs',
    badge: '60% Faster Builds',
    desc: 'Automated Jenkins CI/CD pipelines utilizing Docker ECR layer caching to slash build times.',
  },

  /* ── Wing 4: Event & Analytics Lake (Bottom-Right) ── */
  {
    id: 'sqs',
    title: 'Amazon SQS',
    subtitle: 'FIFO Async Queue',
    category: 'EVENT & ANALYTICS',
    iconKey: 'aws-sqs',
    fallbackIcon: FaAws,
    x: 540,
    y: 220,
    w: 125,
    h: 38,
    companies: ['kfin'],
    wing: 'analytics',
    badge: 'DLQ Handling',
    desc: 'Decoupled SQS message queues buffering high-volume async PDF and notification events.',
  },
  {
    id: 'firehose',
    title: 'Kinesis Firehose',
    subtitle: '10M events/day',
    category: 'EVENT & ANALYTICS',
    iconKey: 'aws-firehose',
    fallbackIcon: FaAws,
    x: 625,
    y: 250,
    w: 130,
    h: 38,
    companies: ['kfin'],
    wing: 'analytics',
    badge: 'Stream Pipeline',
    desc: 'Near real-time stream ingestion pipeline transferring application telemetry into S3 Data Lake.',
  },
  {
    id: 'athena',
    title: 'S3 & Athena',
    subtitle: 'Parquet Data Lake',
    category: 'EVENT & ANALYTICS',
    iconKey: 'aws-athena',
    fallbackIcon: FaAws,
    x: 505,
    y: 295,
    w: 135,
    h: 38,
    companies: ['kfin', 'techno'],
    wing: 'analytics',
    badge: '< 3s Queries',
    desc: 'AWS Glue catalog + Athena enabling serverless SQL over encrypted Parquet logs (15s to < 3s speed).',
  },
]

/* ── Radial Spoke Path Interconnections (From Core Hub cx: 375, cy: 190) ── */
const SPOKE_PATHS = [
  { id: 'sp1', node: 'mtls', companies: ['kfin'], color: '#38bdf8', path: 'M 335 170 L 240 88', dur: '2.5s' },
  { id: 'sp2', node: 'apigw', companies: ['kfin', 'techno'], color: '#38bdf8', path: 'M 335 180 L 277 133', dur: '2.8s' },
  { id: 'sp3', node: 'rest', companies: ['kfin', 'airdit', 'techno', '99ideas'], color: '#38bdf8', path: 'M 331 190 L 210 144', dur: '3.2s' },

  { id: 'sp4', node: 'mongodb', companies: ['kfin'], color: '#a78bfa', path: 'M 415 170 L 510 88', dur: '2.4s' },
  { id: 'sp5', node: 'postgres', companies: ['airdit', 'techno', '99ideas'], color: '#a78bfa', path: 'M 415 180 L 625 114', dur: '2.9s' },
  { id: 'sp6', node: 'redis', companies: ['kfin', 'airdit'], color: '#a78bfa', path: 'M 419 190 L 540 144', dur: '2.6s' },

  { id: 'sp7', node: 'prometheus', companies: ['kfin'], color: '#4ade80', path: 'M 331 190 L 225 239', dur: '3.5s' },
  { id: 'sp8', node: 'tempo', companies: ['kfin'], color: '#4ade80', path: 'M 335 200 L 280 250', dur: '3.8s' },
  { id: 'sp9', node: 'cicd', companies: ['kfin'], color: '#4ade80', path: 'M 335 210 L 240 295', dur: '4s' },

  { id: 'sp10', node: 'sqs', companies: ['kfin'], color: '#fbbf24', path: 'M 419 190 L 540 239', dur: '3.2s' },
  { id: 'sp11', node: 'firehose', companies: ['kfin'], color: '#fbbf24', path: 'M 415 200 L 625 269', dur: '3.4s' },
  { id: 'sp12', node: 'athena', companies: ['kfin', 'techno'], color: '#fbbf24', path: 'M 415 210 L 510 295', dur: '2.8s' },
]

export default function ExperienceDiagram() {
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [hoveredNode, setHoveredNode] = useState(null)

  const activeNodeData =
    hoveredNode === 'core'
      ? CORE_HUB
      : RADIAL_NODES.find(n => n.id === hoveredNode)

  const isNodeActive = (node) => {
    if (hoveredNode) {
      if (node.id === hoveredNode) return true
      if (hoveredNode === 'core') return true
      return false
    }
    if (selectedCompany === 'all') return true
    return node.companies.includes(selectedCompany)
  }

  const isSpokeActive = (spoke) => {
    if (hoveredNode) {
      if (hoveredNode === 'core') return true
      return spoke.node === hoveredNode
    }
    if (selectedCompany === 'all') return true
    return spoke.companies.includes(selectedCompany)
  }

  return (
    <div className={styles.diagramCard}>
      {/* Header bar & Tenure selector */}
      <div className={styles.diagramHeader}>
        <div className={styles.titleRow}>
          <span className={styles.statusDot} />
          <span className={styles.titleText}>RADIAL SYSTEM ARCHITECTURE MAP</span>
        </div>

        {/* Company filter tabs */}
        <div className={styles.companyTabs} role="tablist" aria-label="Experience tenure filter">
          {COMPANIES.map(comp => (
            <button
              key={comp.id}
              type="button"
              className={`${styles.companyTab} ${selectedCompany === comp.id ? styles.companyTabActive : ''}`}
              onClick={() => setSelectedCompany(comp.id)}
            >
              {comp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Radial SVG Canvas */}
      <div className={styles.svgWrapper}>
        <svg viewBox="0 0 776 380" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
          <defs>
            <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--border)" opacity="0.35" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="776" height="380" fill="url(#radarGrid)" />

          {/* Concentric Radar Orbit Rings */}
          <circle cx="375" cy="190" r="85" className={styles.radarRingInner} />
          <circle cx="375" cy="190" r="165" className={styles.radarRingOuter} />

          {/* Wing Category Titles */}
          <text x="140" y="28" className={styles.wingLabel}>SECURITY & INGRESS</text>
          <text x="610" y="28" className={styles.wingLabel}>DATABASES & CACHE</text>
          <text x="140" y="365" className={styles.wingLabel}>OBSERVABILITY & CI/CD</text>
          <text x="610" y="365" className={styles.wingLabel}>EVENT & ANALYTICS LAKE</text>

          {/* Radial Spoke Connection Lines & Flow Particles */}
          <g className={styles.spokesGroup}>
            {SPOKE_PATHS.map((sp) => {
              const active = isSpokeActive(sp)
              return (
                <g key={sp.id} opacity={active ? 1 : 0.12} style={{ transition: 'opacity 0.3s ease' }}>
                  <path
                    d={sp.path}
                    className={styles.spokeLine}
                    stroke={active ? sp.color : 'var(--border-hover)'}
                    strokeWidth={active ? 1.5 : 1}
                  />
                  {active && (
                    <circle r="2.5" fill={sp.color}>
                      <animateMotion dur={sp.dur} repeatCount="indefinite" path={sp.path} />
                    </circle>
                  )}
                </g>
              )
            })}
          </g>

          {/* CENTRAL CORE HUB NODE */}
          <g
            className={styles.coreGroup}
            transform="translate(375, 190)"
            onMouseEnter={() => setHoveredNode('core')}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Outer glowing ring */}
            <circle r="52" className={styles.corePulseRing} />
            <circle r="44" className={styles.coreCircle} />
            <foreignObject x="-14" y="-24" width="28" height="28">
              <div className={styles.coreIconBox}>
                {getTechIcon('nestjs') && <span className={styles.coreIcon}>⚡</span>}
              </div>
            </foreignObject>
            <text x="0" y="12" className={styles.coreTitle}>NestJS / AWS</text>
            <text x="0" y="23" className={styles.coreSubtitle}>Core Engine</text>
          </g>

          {/* 12 RADIAL POD NODES */}
          <g className={styles.nodesGroup}>
            {RADIAL_NODES.map((node) => {
              const active = isNodeActive(node)
              const isHovered = hoveredNode === node.id
              const IconComp = node.iconKey ? getTechIcon(node.iconKey) : node.fallbackIcon

              return (
                <g
                  key={node.id}
                  className={styles.nodeGroup}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  opacity={active ? 1 : 0.22}
                  style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                >
                  {/* Pod outer rectangle */}
                  <rect
                    width={node.w}
                    height={node.h}
                    rx="19"
                    className={`${styles.nodePod} ${isHovered ? styles.nodePodHovered : ''} ${active ? styles.nodePodActive : ''}`}
                  />

                  {/* Icon */}
                  <foreignObject x="7" y="7" width="24" height="24">
                    <div className={styles.iconBox}>
                      {IconComp && <IconComp className={styles.serviceIcon} />}
                    </div>
                  </foreignObject>

                  {/* Labels */}
                  <text x="34" y="17" className={styles.nodeTitle}>{node.title}</text>
                  <text x="34" y="29" className={styles.nodeSubtitle}>{node.subtitle}</text>

                  {/* Status dot */}
                  {['mtls', 'apigw', 'mongodb', 'prometheus'].includes(node.id) && (
                    <circle cx={node.w - 9} cy="8" r="3" fill="var(--green)" className={styles.nodeStatusDot} />
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Inspector Banner */}
      <div className={styles.infoBanner}>
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
            <span className={styles.infoHintIcon}>💡</span>
            <span>Hover over the Central Core Engine or any orbital pod to inspect system architecture.</span>
          </div>
        )}
      </div>
    </div>
  )
}

