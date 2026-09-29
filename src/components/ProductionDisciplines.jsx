import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useRef } from 'react'
import styles from './ProductionDisciplines.module.css'
import DealSlot from './DealSlot'
import { useDealProgress } from '../hooks/useDeal'
import {
  follow,
  respond,
  revealItem,
  spring,
  staggerGroup,
  viewport,
} from '../utils/motionTokens'

const LANES = [
  {
    word: 'SCALE',
    proof: '23 AMCs on one lending platform',
    body: 'Event-driven services, async queues with dead-letter recovery, and storage paths built for sustained load.',
    stack: 'SQS / Lambda / Firehose / ECS',
    featured: true,
  },
  {
    word: 'SECURE',
    proof: 'CERSAI KYC over mTLS',
    body: 'Financial payloads protected with JWE, JWS, mTLS, and strict integration boundaries.',
    stack: 'JWE / JWS / mTLS / OAuth',
  },
  {
    word: 'OBSERVE',
    proof: 'Support asks an AI agent first',
    body: "Logs, metrics, and traces behind an MCP server, so support's AI agent resolves six recurring client queries itself.",
    stack: 'Prometheus / Tempo / Grafana / MCP',
  },
  {
    word: 'SHIP',
    proof: 'CI builds: 12–14 min to 3–5',
    body: 'Infrastructure defined in CDK and pipelines tuned with ECR layer caching, so shipping stays routine.',
    stack: 'CDK / Jenkins / Docker / ECR',
  },
]

const headerGroup = staggerGroup()

// Desktop deck: the lanes start stacked on top of each other. Lane i (i >= 1)
// peels off at deck progress DECK_START + (i - 1) * DECK_STEP, travels for
// DECK_SPAN, and lands DECK_LANE_STEP px below the previous lane. The lead
// lane stays put and only relaxes into its final tilt at DECK_LEAD_SETTLE.
const DECK_LANE_STEP = 124
const DECK_START = 0.05
const DECK_START_MIN = 0.03
const DECK_STEP = 0.19
const DECK_SPAN = 0.23
const DECK_END_MAX = 0.78
const DECK_LEAD_SETTLE = 0.82
const DECK_FADE_SPAN = 0.09
const DECK_OPACITY_FROM = 0.18
const DECK_SCALE_FROM = 0.965
const DECK_LEAD_SCALE_TO = 0.985
const FINAL_X = [0, 26, 10, 38]
const FINAL_ROTATION = [-0.7, 0.65, -0.45, 0.55]

// Mobile lanes deal in vertically, each on its own scroll progress.
const MOBILE_LANE_POSE = { y: 28, scale: 0.96 }

function LaneCard({ lane, index, progress, reduced = false }) {
  const start = Math.max(DECK_START_MIN, DECK_START + (index - 1) * DECK_STEP)
  const end = Math.min(DECK_END_MAX, start + DECK_SPAN)
  const finalY = index * DECK_LANE_STEP

  const y = useTransform(
    progress,
    index === 0 ? [0, 1] : [0, start, end, 1],
    index === 0 ? [0, 0] : [0, 0, finalY, finalY],
  )
  const x = useTransform(
    progress,
    index === 0 ? [0, DECK_LEAD_SETTLE, 1] : [0, start, end, 1],
    index === 0
      ? [0, 0, FINAL_X[index]]
      : [0, 0, FINAL_X[index], FINAL_X[index]],
  )
  const rotate = useTransform(
    progress,
    index === 0 ? [0, DECK_LEAD_SETTLE, 1] : [0, start, end, 1],
    index === 0
      ? [0, 0, FINAL_ROTATION[index]]
      : [0, 0, FINAL_ROTATION[index], FINAL_ROTATION[index]],
  )
  const opacity = useTransform(
    progress,
    index === 0 ? [0, 1] : [0, start, start + DECK_FADE_SPAN, 1],
    index === 0
      ? [1, 1]
      : [DECK_OPACITY_FROM, DECK_OPACITY_FROM, 1, 1],
  )
  const scale = useTransform(
    progress,
    index === 0 ? [0, DECK_LEAD_SETTLE, 1] : [0, start, end, 1],
    index === 0
      ? [1, 1, DECK_LEAD_SCALE_TO]
      : [DECK_SCALE_FROM, DECK_SCALE_FROM, 1, 1],
  )
  return (
    <motion.div
      className={styles.laneShell}
      role="listitem"
      style={
        reduced
          ? undefined
          : {
              x,
              y,
              rotate,
              opacity,
              scale,
              zIndex: LANES.length - index,
            }
      }
    >
      <motion.article
        className={`${styles.lane} ${
          lane.featured ? styles.laneFeatured : ''
        }`}
        aria-label={lane.word}
        whileHover={reduced ? undefined : respond.nudge}
        transition={spring.hover}
      >
        <div className={styles.wordWrap}>
          <p className={styles.word}>{lane.word}</p>
          <span className={styles.wordRule} aria-hidden="true" />
        </div>
        <div className={styles.copy}>
          <p className={styles.proof}>{lane.proof}</p>
          <p className={styles.body}>{lane.body}</p>
        </div>
        <p className={`mono ${styles.stack}`}>{lane.stack}</p>
      </motion.article>
    </motion.div>
  )
}

function DesktopDeck({ reduced }) {
  const deckRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ['start 82%', 'end 52%'],
  })
  const smoothProgress = useSpring(scrollYProgress, follow.scroll)

  return (
    <div
      ref={deckRef}
      className={`${styles.deck} ${reduced ? styles.deckReduced : ''}`}
    >
      <div className={styles.stage}>
        <div className={styles.stageFrame} aria-hidden="true" />
        <div className={styles.lanes} role="list">
          {LANES.map((lane, index) => (
            <LaneCard
              key={lane.word}
              lane={lane}
              index={index}
              progress={smoothProgress}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileLane({ lane }) {
  const laneRef = useRef(null)
  const progress = useDealProgress(laneRef)

  return (
    <DealSlot
      ref={laneRef}
      role="listitem"
      progress={progress}
      from={MOBILE_LANE_POSE}
    >
      <article
        className={`${styles.lane} ${lane.featured ? styles.laneFeatured : ''}`}
        aria-label={lane.word}
      >
        <div className={styles.wordWrap}>
          <p className={styles.word}>{lane.word}</p>
          <span className={styles.wordRule} aria-hidden="true" />
        </div>
        <div className={styles.copy}>
          <p className={styles.proof}>{lane.proof}</p>
          <p className={styles.body}>{lane.body}</p>
        </div>
        <p className={`mono ${styles.stack}`}>{lane.stack}</p>
      </article>
    </DealSlot>
  )
}

function MobileDeck() {
  return (
    <div className={styles.mobileLanes} role="list">
      {LANES.map((lane) => (
        <MobileLane key={lane.word} lane={lane} />
      ))}
    </div>
  )
}

export default function ProductionDisciplines() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className={styles.section}
      id="disciplines"
      aria-labelledby="disciplines-title"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          variants={headerGroup}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={viewport.text}
        >
          <motion.h2
            id="disciplines-title"
            className={styles.title}
            variants={revealItem}
          >
            <span className={styles.titleLine}>The parts I keep</span>
            <span className={styles.titleLine}>coming back to.</span>
          </motion.h2>
          <motion.p className={styles.intro} variants={revealItem}>
            Scale, security, observability, and getting the thing shipped.
          </motion.p>
        </motion.header>

        <DesktopDeck reduced={prefersReduced} />
        <MobileDeck />
      </div>
    </section>
  )
}
