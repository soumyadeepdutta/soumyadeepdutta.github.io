import {
  motion,
  stagger,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useRef } from 'react'
import styles from './ProductionDisciplines.module.css'

const LANES = [
  {
    word: 'SCALE',
    proof: '700K+ requests every day',
    body: 'Event-driven services, async work queues, and storage paths built for sustained load.',
    stack: 'SQS / Lambda / Firehose / ECS',
    featured: true,
  },
  {
    word: 'SECURE',
    proof: '30K+ regulated calls / day',
    body: 'Financial payloads protected with JWE, JWS, mTLS, and strict integration boundaries.',
    stack: 'JWE / JWS / mTLS / OAuth',
  },
  {
    word: 'OBSERVE',
    proof: 'One trace across the path',
    body: 'Logs, metrics, and distributed traces designed into the system before incidents arrive.',
    stack: 'Prometheus / Tempo / Grafana',
  },
  {
    word: 'SHIP',
    proof: '60% faster CI builds',
    body: 'Infrastructure and delivery treated as product code, not an afterthought.',
    stack: 'CDK / Jenkins / Docker / ECR',
  },
]

const revealItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', visualDuration: 0.42, bounce: 0 },
  },
}

const FINAL_X = [0, 26, 10, 38]
const FINAL_ROTATION = [-0.7, 0.65, -0.45, 0.55]

function LaneCard({ lane, index, progress, reduced = false }) {
  const start = Math.max(0.03, 0.05 + (index - 1) * 0.19)
  const end = Math.min(0.78, start + 0.23)
  const finalY = index * 124

  const y = useTransform(
    progress,
    index === 0 ? [0, 1] : [0, start, end, 1],
    index === 0 ? [0, 0] : [0, 0, finalY, finalY],
  )
  const x = useTransform(
    progress,
    index === 0 ? [0, 0.82, 1] : [0, start, end, 1],
    index === 0
      ? [0, 0, FINAL_X[index]]
      : [0, 0, FINAL_X[index], FINAL_X[index]],
  )
  const rotate = useTransform(
    progress,
    index === 0 ? [0, 0.82, 1] : [0, start, end, 1],
    index === 0
      ? [0, 0, FINAL_ROTATION[index]]
      : [0, 0, FINAL_ROTATION[index], FINAL_ROTATION[index]],
  )
  const opacity = useTransform(
    progress,
    index === 0 ? [0, 1] : [0, start, start + 0.09, 1],
    index === 0 ? [1, 1] : [0.18, 0.18, 1, 1],
  )
  const scale = useTransform(
    progress,
    index === 0 ? [0, 0.82, 1] : [0, start, end, 1],
    index === 0 ? [1, 1, 0.985] : [0.965, 0.965, 1, 1],
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
        whileHover={reduced ? undefined : { x: 7, scale: 1.008 }}
        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
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
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

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

function MobileDeck({ reduced }) {
  return (
    <motion.div
      className={styles.mobileLanes}
      role="list"
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: stagger(0.08) } },
      }}
    >
      {LANES.map((lane) => (
        <motion.div
          key={lane.word}
          role="listitem"
          variants={{
            hidden: { opacity: 0, y: 28 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                type: 'spring',
                visualDuration: 0.55,
                bounce: 0.08,
              },
            },
          }}
        >
          <article
            className={`${styles.lane} ${
              lane.featured ? styles.laneFeatured : ''
            }`}
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
        </motion.div>
      ))}
    </motion.div>
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
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.08) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
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
        <MobileDeck reduced={prefersReduced} />
      </div>
    </section>
  )
}
