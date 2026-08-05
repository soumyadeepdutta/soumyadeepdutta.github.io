import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'
import { navigateToSection } from '../utils/navigation'
import { getTechIcon } from './techIcons'
import { FiGlobe, FiHardDrive, FiDatabase, FiActivity, FiZap, FiServer, FiLayers } from 'react-icons/fi'
import { FaAws } from 'react-icons/fa'

const ROLES = [
  'Backend Developer',
  'AWS Solutions Architect',
  'Node.js Engineer',
  'Python Developer',
  'AI Enthusiast',
]

/* ── AWS Architecture Data Model ── */
const ARCH_NODES = [
  {
    id: 'client',
    title: 'Client Apps',
    subtitle: 'Web & Mobile',
    category: 'EDGE',
    iconKey: null,
    fallbackIcon: FiGlobe,
    x: 18,
    y: 45,
    w: 120,
    h: 48,
    flows: ['api'],
    badge: 'HTTPS',
    desc: 'Web apps, mobile clients & 3rd-party integration APIs issuing secure REST/GraphQL requests.',
  },
  {
    id: 'cloudfront',
    title: 'CloudFront',
    subtitle: 'CDN & WAF',
    category: 'EDGE',
    iconKey: 'aws-cloudfront',
    fallbackIcon: FaAws,
    x: 18,
    y: 165,
    w: 120,
    h: 48,
    flows: ['api'],
    badge: 'Sub-50ms',
    desc: 'Global Edge CDN & AWS WAF for DDoS protection, SSL termination, and static asset caching.',
  },
  {
    id: 'apigateway',
    title: 'API Gateway',
    subtitle: 'REST / WS',
    category: 'INGRESS',
    iconKey: 'aws-apigateway',
    fallbackIcon: FaAws,
    x: 18,
    y: 285,
    w: 120,
    h: 48,
    flows: ['api', 'event'],
    badge: 'Auth & Limits',
    desc: 'Managed API Gateway handling endpoint routing, JWT auth validation, throttling, and WebSockets.',
  },
  {
    id: 'ecs',
    title: 'ECS Fargate',
    subtitle: 'Microservices',
    category: 'COMPUTE',
    iconKey: 'aws-ecs',
    fallbackIcon: FaAws,
    x: 173,
    y: 45,
    w: 120,
    h: 48,
    flows: ['api', 'event', 'stream'],
    badge: 'Auto Scaling',
    desc: 'Containerized Node.js microservices running on serverless Fargate tasks behind health checks.',
  },
  {
    id: 'nlb',
    title: 'NLB / ALB',
    subtitle: 'Load Balancer',
    category: 'INGRESS',
    iconKey: 'aws-nlb',
    fallbackIcon: FaAws,
    x: 173,
    y: 165,
    w: 120,
    h: 48,
    flows: ['api'],
    badge: 'High Avail',
    desc: 'Ultra-low latency Network Load Balancer distributing traffic across multi-AZ ECS target groups.',
  },
  {
    id: 'lambda',
    title: 'AWS Lambda',
    subtitle: 'Serverless Jobs',
    category: 'COMPUTE',
    iconKey: 'aws-lambda',
    fallbackIcon: FaAws,
    x: 173,
    y: 285,
    w: 120,
    h: 48,
    flows: ['api', 'event'],
    badge: 'Event Trigger',
    desc: 'On-demand serverless worker functions processing async payloads and micro-tasks.',
  },
  {
    id: 'redis',
    title: 'ElastiCache',
    subtitle: 'Redis Cache',
    category: 'CACHE/DB',
    iconKey: 'redis',
    fallbackIcon: FiDatabase,
    x: 328,
    y: 45,
    w: 122,
    h: 48,
    flows: ['api'],
    badge: 'Sub-ms',
    desc: 'Amazon ElastiCache Redis cluster for session state management, rate limits, and query caching.',
  },
  {
    id: 'dynamodb',
    title: 'DynamoDB / RDS',
    subtitle: 'NoSQL & Postgres',
    category: 'CACHE/DB',
    iconKey: 'aws-dynamodb',
    fallbackIcon: FiDatabase,
    x: 328,
    y: 165,
    w: 122,
    h: 48,
    flows: ['api', 'event'],
    badge: 'ACID Data',
    desc: 'DynamoDB NoSQL tables and Amazon RDS PostgreSQL instances for transactional durability.',
  },
  {
    id: 'sqs',
    title: 'Amazon SQS',
    subtitle: 'Decoupled Queue',
    category: 'MESSAGING',
    iconKey: 'aws-sqs',
    fallbackIcon: FaAws,
    x: 328,
    y: 285,
    w: 122,
    h: 48,
    flows: ['event'],
    badge: 'FIFO Queue',
    desc: 'High-throughput SQS message queue buffering spike loads to prevent downstream bottlenecking.',
  },
  {
    id: 'firehose',
    title: 'Data Firehose',
    subtitle: 'Stream Ingestion',
    category: 'ANALYTICS',
    iconKey: 'aws-firehose',
    fallbackIcon: FaAws,
    x: 488,
    y: 45,
    w: 120,
    h: 48,
    flows: ['stream'],
    badge: 'Real-time',
    desc: 'Near real-time Kinesis Data Firehose streaming application logs and audit events to S3.',
  },
  {
    id: 's3',
    title: 'Amazon S3',
    subtitle: 'Data Lake Store',
    category: 'STORAGE',
    iconKey: 'aws-s3',
    fallbackIcon: FiHardDrive,
    x: 488,
    y: 165,
    w: 120,
    h: 48,
    flows: ['event', 'stream'],
    badge: 'Parquet Lake',
    desc: 'Scalable S3 object store holding encrypted analytical Parquet datasets and media assets.',
  },
  {
    id: 'athena',
    title: 'Glue & Athena',
    subtitle: 'Serverless SQL',
    category: 'ANALYTICS',
    iconKey: 'aws-athena',
    fallbackIcon: FaAws,
    x: 488,
    y: 285,
    w: 120,
    h: 48,
    flows: ['stream'],
    badge: 'Serverless',
    desc: 'AWS Glue Data Catalog and Amazon Athena enabling instant SQL queries over raw S3 data lake.',
  },
]

const ARCH_PATHS = [
  { id: 'p1', from: 'client', to: 'cloudfront', flow: 'api', path: 'M 78 93 L 78 165', dur: '3s' },
  { id: 'p2', from: 'cloudfront', to: 'apigateway', flow: 'api', path: 'M 78 213 L 78 285', dur: '2.8s' },
  { id: 'p3', from: 'apigateway', to: 'nlb', flow: 'api', path: 'M 138 309 C 155 309 158 189 173 189', dur: '3.4s' },
  { id: 'p4', from: 'nlb', to: 'ecs', flow: 'api', path: 'M 233 165 L 233 93', dur: '2.6s' },
  { id: 'p5', from: 'ecs', to: 'redis', flow: 'api', path: 'M 293 69 L 328 69', dur: '2.2s' },
  { id: 'p6', from: 'ecs', to: 'dynamodb', flow: 'api', path: 'M 293 81 C 310 81 313 177 328 177', dur: '3s' },
  { id: 'p7', from: 'apigateway', to: 'lambda', flow: 'api', path: 'M 138 309 L 173 309', dur: '2.5s' },
  { id: 'p8', from: 'ecs', to: 'sqs', flow: 'event', path: 'M 233 93 C 233 150 300 295 328 295', dur: '4s' },
  { id: 'p9', from: 'sqs', to: 'lambda', flow: 'event', path: 'M 328 309 L 293 309', dur: '2.4s' },
  { id: 'p10', from: 'lambda', to: 'dynamodb', flow: 'event', path: 'M 293 295 C 310 295 313 201 328 201', dur: '3.1s' },
  { id: 'p11', from: 'lambda', to: 's3', flow: 'event', path: 'M 293 323 C 375 355 440 250 488 189', dur: '4.2s' },
  { id: 'p12', from: 'ecs', to: 'firehose', flow: 'stream', path: 'M 293 57 C 350 25 430 57 488 57', dur: '3.8s' },
  { id: 'p13', from: 'firehose', to: 's3', flow: 'stream', path: 'M 548 93 L 548 165', dur: '2.8s' },
  { id: 'p14', from: 's3', to: 'athena', flow: 'stream', path: 'M 548 213 L 548 285', dur: '3.2s' },
]

const FLOW_COLORS = {
  api: '#38bdf8',     // Cyan / Blue for sync API requests
  event: '#c084fc',   // Purple / Violet for event-driven async
  stream: '#f59e0b',  // Amber / Gold for data lake ingestion
}

/* ── Animated Architecture Diagram ── */
function ArchitectureDiagram() {
  const [activeFlow, setActiveFlow] = useState('all')
  const [hoveredNode, setHoveredNode] = useState(null)

  const activeNodeData = ARCH_NODES.find(n => n.id === hoveredNode)

  const isNodeActive = (node) => {
    if (hoveredNode) {
      if (node.id === hoveredNode) return true
      return ARCH_PATHS.some(
        p => (p.from === hoveredNode && p.to === node.id) || (p.to === hoveredNode && p.from === node.id)
      )
    }
    if (activeFlow === 'all') return true
    return node.flows.includes(activeFlow)
  }

  const isPathActive = (path) => {
    if (hoveredNode) {
      return path.from === hoveredNode || path.to === hoveredNode
    }
    if (activeFlow === 'all') return true
    return path.flow === activeFlow
  }

  return (
    <div className={styles.diagramCard}>
      {/* Header bar & Flow selector */}
      <div className={styles.diagramHeader}>
        <div className={styles.diagramTitleRow}>
          <span className={styles.diagramStatusDot} />
          <span className={styles.diagramTitleText}>AWS CLOUD ARCHITECTURE</span>
        </div>

        <div className={styles.flowTabs} role="tablist" aria-label="Architecture flows">
          <button
            type="button"
            className={`${styles.flowTab} ${activeFlow === 'all' ? styles.flowTabActive : ''}`}
            onClick={() => setActiveFlow('all')}
          >
            <span className={styles.flowDot} style={{ background: '#b49a6e' }} />
            All
          </button>
          <button
            type="button"
            className={`${styles.flowTab} ${activeFlow === 'api' ? styles.flowTabActive : ''}`}
            onClick={() => setActiveFlow('api')}
          >
            <span className={styles.flowDot} style={{ background: FLOW_COLORS.api }} />
            Sync API
          </button>
          <button
            type="button"
            className={`${styles.flowTab} ${activeFlow === 'event' ? styles.flowTabActive : ''}`}
            onClick={() => setActiveFlow('event')}
          >
            <span className={styles.flowDot} style={{ background: FLOW_COLORS.event }} />
            Event Bus
          </button>
          <button
            type="button"
            className={`${styles.flowTab} ${activeFlow === 'stream' ? styles.flowTabActive : ''}`}
            onClick={() => setActiveFlow('stream')}
          >
            <span className={styles.flowDot} style={{ background: FLOW_COLORS.stream }} />
            Analytics
          </button>
        </div>
      </div>

      {/* Main SVG diagram viewport */}
      <div className={styles.svgWrapper}>
        <svg viewBox="0 0 635 355" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg}>
          <defs>
            {/* Background dot pattern */}
            <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--border)" opacity="0.4" />
            </pattern>
          </defs>

          {/* Grid background overlay */}
          <rect width="635" height="355" fill="url(#archGrid)" />

          {/* Swimlane Column Labels */}
          <text x="77" y="22" className={styles.swimlaneLabel}>EDGE & INGRESS</text>
          <text x="237" y="22" className={styles.swimlaneLabel}>COMPUTE & LOAD</text>
          <text x="397" y="22" className={styles.swimlaneLabel}>CACHE & MESSAGING</text>
          <text x="557" y="22" className={styles.swimlaneLabel}>ANALYTICS & LAKE</text>

          {/* Swimlane separators */}
          <line x1="157" y1="12" x2="157" y2="345" className={styles.swimlaneDivider} />
          <line x1="317" y1="12" x2="317" y2="345" className={styles.swimlaneDivider} />
          <line x1="477" y1="12" x2="477" y2="345" className={styles.swimlaneDivider} />

          {/* Render Path Connection Lines & Animated Particles */}
          <g className={styles.pathsGroup}>
            {ARCH_PATHS.map((p) => {
              const active = isPathActive(p)
              const pathColor = FLOW_COLORS[p.flow]
              return (
                <g key={p.id} opacity={active ? 1 : 0.15} style={{ transition: 'opacity 0.3s ease' }}>
                  {/* Path base stroke */}
                  <path
                    d={p.path}
                    className={styles.connPath}
                    stroke={active ? pathColor : 'var(--border-hover)'}
                    strokeWidth={active ? 1.5 : 1}
                  />

                  {/* Flow animated particle */}
                  {active && (
                    <circle r={activeFlow !== 'all' || hoveredNode ? "3" : "2.5"} fill={pathColor}>
                      <animateMotion dur={p.dur} repeatCount="indefinite" path={p.path} />
                    </circle>
                  )}
                </g>
              )
            })}
          </g>

          {/* Render AWS Nodes */}
          <g className={styles.nodesGroup}>
            {ARCH_NODES.map((node) => {
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
                  opacity={active ? 1 : 0.25}
                  style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                >
                  {/* Node outer box */}
                  <rect
                    width={node.w}
                    height={node.h}
                    rx="8"
                    className={`${styles.nodeBox} ${isHovered ? styles.nodeBoxHovered : ''} ${active ? styles.nodeBoxActive : ''}`}
                  />

                  {/* Tech Icon inside node */}
                  <foreignObject x="8" y="12" width="24" height="24">
                    <div className={styles.iconBox}>
                      {IconComp && <IconComp className={styles.serviceIcon} />}
                    </div>
                  </foreignObject>

                  {/* Node Titles */}
                  <text x="38" y="22" className={styles.nodeTitle}>{node.title}</text>
                  <text x="38" y="35" className={styles.nodeSubtitle}>{node.subtitle}</text>

                  {/* Badge or pulse dot for active services */}
                  {['apigateway', 'ecs', 'sqs', 'firehose'].includes(node.id) && (
                    <circle cx={node.w - 8} cy="10" r="3" fill="var(--green)" className={styles.nodeStatusDot} />
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Interactive Bottom Banner / Inspector */}
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
            <span>Hover over any AWS component or select a flow above to inspect architectural patterns.</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Metric Card ── */
function MetricCard({ value, label, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState('0')
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          animateCount(value, setDisplayValue)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div
      className={styles.metric}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className={`mono ${styles.metricValue}`}>{displayValue}</span>
      <span className={styles.metricLabel}>{label}</span>
    </div>
  )
}

function animateCount(target, setter) {
  // Parse numeric part and suffix
  const match = target.match(/^([\d.]+)(.*)$/)
  if (!match) { setter(target); return }

  const numTarget = parseFloat(match[1])
  const suffix = match[2]
  const duration = 1200
  const steps = 40
  const stepTime = duration / steps
  let step = 0

  const timer = setInterval(() => {
    step++
    const progress = step / steps
    // Ease-out
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = numTarget * eased

    if (numTarget >= 100) {
      setter(Math.round(current).toLocaleString() + suffix)
    } else {
      setter(current.toFixed(numTarget % 1 !== 0 ? 1 : 0) + suffix)
    }

    if (step >= steps) {
      clearInterval(timer)
      setter(target)
    }
  }, stepTime)
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex(i => (i + 1) % ROLES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className={styles.hero} id="about">
      <div className={`container ${styles.inner}`}>
        {/* Left: text content */}
        <div className={styles.content}>
          <div className={styles.statusRow}>
            <span className={styles.statusDot} />
            <span className={`mono ${styles.statusText}`}>All systems operational</span>
          </div>

          <h1 className={styles.name}>
            Soumyadeep<br />
            Dutta
          </h1>

          <div className={styles.roleRow}>
            <span className={styles.roleFade} key={roleIndex}>
              {ROLES[roleIndex]}
            </span>
          </div>

          <p className={styles.bio}>
            Backend engineer with 4+ years building scalable Node.js and
            AWS-based systems across fintech, healthcare, and SaaS.
            Event-driven architecture, serverless pipelines, and
            high-throughput data infrastructure.
          </p>

          <div className={styles.ctaRow}>
            <a
              href="#experience"
              className="btn btn-primary"
              onClick={e => {
                e.preventDefault()
                navigateToSection('#experience')
              }}
            >
              View experience
            </a>
            <a
              href="#contact"
              className="btn btn-outline"
              onClick={e => {
                e.preventDefault()
                navigateToSection('#contact')
              }}
            >
              Get in touch
            </a>
          </div>

          {/* Metric cards */}
          <div className={styles.metrics}>
            <MetricCard value="4+" label="Years exp." delay={0} />
            <div className={styles.metricDivider} />
            <MetricCard value="700k+" label="Req / day" delay={80} />
            <div className={styles.metricDivider} />
            <MetricCard value="10M+" label="Daily events" delay={160} />
          </div>
        </div>

        {/* Right: architecture diagram */}
        <ArchitectureDiagram />
      </div>

      {/* Scroll indicator */}
      <a
        href="#skills"
        className={styles.scrollIndicator}
        onClick={e => {
          e.preventDefault()
          navigateToSection('#skills')
        }}
        aria-label="Scroll down"
      >
        <span className={styles.scrollArrow}>↓</span>
      </a>
    </section>
  )
}
