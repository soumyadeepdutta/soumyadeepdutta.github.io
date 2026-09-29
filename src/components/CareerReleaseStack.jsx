import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import styles from './CareerReleaseStack.module.css'
import HandwrittenText from './HandwrittenText'
import { useDealCard, useDealProgress } from '../hooks/useDeal'
import {
  respond,
  revealItem,
  spring,
  staggerGroup,
  viewport,
} from '../utils/motionTokens'

const headerGroup = staggerGroup()

// Cards are released onto the table slightly askew: the held pose leans
// further (capped) and settles into each card's own restRotate.
const MAX_LEAN = 3

function heldPose({ fromX, fromY, restRotate }) {
  const lean = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, restRotate * 2.5))
  return { x: fromX * 0.5, y: fromY * 0.35, rotate: lean, rotateX: -6, scale: 0.94 }
}

const CARDS = [
  {
    id: 'kfin',
    slot: 'slotKfin',
    company: 'KFin Technologies',
    role: 'Software Engineer',
    dates: 'JUL 2024 - NOW',
    year: 'NOW',
    lesson:
      'At KFin, the job grew beyond backend delivery. I led a five-person team on Group SIP, own AWS for LAMF, and now mentor two interns across three projects.',
    stack: 'FINTECH / AWS / 23 AMCS / MCP',
    tone: 'paper',
    card: 'cardKfin',
    motion: { fromX: -72, fromY: 96, restRotate: -1 },
  },
  {
    id: 'airdit',
    slot: 'slotAirdit',
    company: 'Airdit',
    role: 'Senior Software Developer',
    dates: 'OCT 2023 - MAY 2024',
    year: '23',
    lesson:
      'Airdit moved me between a SaaS backend with Azure AI and an enterprise app on SAP BTP. Enterprise constraints differ more than you expect.',
    stack: 'NODE.JS / POSTGRES / SAP BTP',
    tone: 'panel',
    card: 'cardAirdit',
    motion: { fromX: 86, fromY: 120, restRotate: 1.2 },
  },
  {
    id: 'techno',
    slot: 'slotTechno',
    company: 'Techno Exponent',
    role: 'Software Development Engineer',
    dates: 'SEP 2022 - SEP 2023',
    year: '22',
    lesson:
      'A telehealth backend with live video, payments, and time-zone scheduling made real-time APIs concrete. I also prototyped AI-drafted prescriptions.',
    stack: 'HEALTHCARE / STRIPE / WHISPER',
    tone: 'panelAlt',
    card: 'cardTechno',
    motion: { fromX: -78, fromY: 138, restRotate: -1.1 },
  },
  {
    id: 'ideas',
    slot: 'slotIdeas',
    company: '99ideas',
    role: 'Contract developer, then SDE',
    dates: 'JAN 2021 - AUG 2022',
    year: '21',
    lesson: 'National PGDM admissions, with merit lists and fee payments across institutions, made reliability practical very quickly.',
    stack: 'NODE.JS / DJANGO / PANDAS',
    tone: 'deep',
    card: 'cardIdeas',
    motion: { fromX: -96, fromY: 150, restRotate: -1.6 },
  },
  {
    id: 'btech',
    slot: 'slotBtech',
    company: 'B.Tech, Computer Science',
    role: 'Supreme Knowledge Foundation',
    dates: '2017 - 2021',
    year: '17',
    lesson:
      'The foundation was computer science, patient debugging, and the habit of pulling systems apart to understand them.',
    stack: 'CGPA 8.40 / WEST BENGAL',
    tone: 'steel',
    card: 'cardBtech',
    motion: { fromX: 92, fromY: 170, restRotate: 1.4 },
  },
]

function CareerCard({ item, reduced }) {
  return (
    <motion.article
      className={`${styles.card} ${styles[item.card]} ${styles[item.tone]}`}
      aria-label={`${item.company}, ${item.role}`}
      whileHover={reduced ? undefined : respond.lift}
      whileTap={reduced ? undefined : respond.press}
      transition={spring.hover}
    >
      <div className={styles.cardHeader}>
        <div className={styles.identity}>
          <h3 className={styles.company}>{item.company}</h3>
          <p className={styles.role}>{item.role}</p>
        </div>
        <p className={`mono ${styles.dates}`}>{item.dates}</p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.footerCopy}>
          <p className={styles.lesson}>{item.lesson}</p>
          <p className={`mono ${styles.stack}`}>{item.stack}</p>
        </div>
        <p className={styles.year} aria-hidden="true">
          {item.year}
        </p>
      </div>
    </motion.article>
  )
}

function CareerSlot({ item, index, prefersReduced }) {
  const slotRef = useRef(null)
  const entersFirst = index % 2 === 0
  const progress = useDealProgress(slotRef, {
    offset: [
      `start ${entersFirst ? 78 : 74}%`,
      `start ${entersFirst ? 44 : 40}%`,
    ],
  })
  const dealStyle = useDealCard(progress, {
    from: heldPose(item.motion),
    to: { rotate: item.motion.restRotate },
  })

  return (
    <motion.div
      ref={slotRef}
      className={`${styles.slot} ${styles[item.slot]}`}
      style={dealStyle}
    >
      <CareerCard item={item} reduced={prefersReduced} />
    </motion.div>
  )
}

export default function CareerReleaseStack() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className={styles.section}
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          variants={headerGroup}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={viewport.text}
        >
          <HandwrittenText className={styles.hand} delay={0.04}>
            I kept saying yes to the next layer
          </HandwrittenText>
          <motion.h2
            id="experience-title"
            className={styles.title}
            variants={revealItem}
          >
            <span className={styles.titleLine}>I learned by owning</span>
            <span className={styles.titleLine}>more of the problem.</span>
          </motion.h2>
          <motion.p className={styles.intro} variants={revealItem}>
            APIs first. Then deployments, infrastructure, observability, and
            teams.
          </motion.p>
        </motion.header>

        <div className={styles.stage}>
          {CARDS.map((item, index) => (
            <CareerSlot
              key={item.id}
              item={item}
              index={index}
              prefersReduced={prefersReduced}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
