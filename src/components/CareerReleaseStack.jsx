import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  stagger,
} from 'motion/react'
import styles from './CareerReleaseStack.module.css'
import HandwrittenText from './HandwrittenText'

const CARDS = [
  {
    id: 'kfin',
    slot: 'slotKfin',
    company: 'KFin Technologies',
    role: 'Software Engineer',
    dates: 'JUL 2024 - NOW',
    year: 'NOW',
    lesson:
      'At KFin, the job grew beyond backend delivery. I now lead a five-person team and own AWS infrastructure, CI/CD, observability, and support tooling.',
    stack: 'FINTECH / AWS / TEAM OF 5 / MCP',
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
      'Airdit moved me between SaaS, Azure AI, and SAP BTP. It taught me how different enterprise constraints can be.',
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
      'Healthcare work made API design and real-time integrations less abstract. It also gave me my first chance to prototype AI-assisted prescriptions.',
    stack: 'HEALTHCARE / STRIPE / WHISPER',
    tone: 'panelAlt',
    card: 'cardTechno',
    motion: { fromX: -78, fromY: 138, restRotate: -1.1 },
  },
  {
    id: 'ideas',
    slot: 'slotIdeas',
    company: '99ideas',
    role: 'Software Development Engineer',
    dates: 'JAN 2021 - AUG 2022',
    year: '21',
    lesson: 'Admissions traffic made reliability practical very quickly.',
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
    stack: 'CGPA 8.40 / KOLKATA',
    tone: 'steel',
    card: 'cardBtech',
    motion: { fromX: 92, fromY: 170, restRotate: 1.4 },
  },
]

const revealItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', visualDuration: 0.48, bounce: 0 },
  },
}

function CareerCard({ item }) {
  return (
    <article
      className={`${styles.card} ${styles[item.card]} ${styles[item.tone]}`}
      aria-label={`${item.company}, ${item.role}`}
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
    </article>
  )
}

function CareerSlot({ item, index, prefersReduced }) {
  const slotRef = useRef(null)
  const entersFirst = index % 2 === 0
  const { scrollYProgress } = useScroll({
    target: slotRef,
    offset: [
      `start ${entersFirst ? 78 : 74}%`,
      `start ${entersFirst ? 44 : 40}%`,
    ],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 28,
    mass: 0.38,
    restDelta: 0.001,
  })
  const range = [0, 0.16, 1]
  const x = useTransform(
    progress,
    range,
    [item.motion.fromX * 0.58, item.motion.fromX * 0.4, 0]
  )
  const y = useTransform(
    progress,
    range,
    [item.motion.fromY * 0.3, item.motion.fromY * 0.2, 0]
  )
  const rotate = useTransform(
    progress,
    range,
    [
      item.motion.restRotate * 3.8,
      item.motion.restRotate * 2.8,
      item.motion.restRotate,
    ]
  )
  const rotateX = useTransform(progress, range, [-15, -10, 0])
  const scale = useTransform(progress, range, [0.92, 0.95, 1])
  const opacity = useTransform(progress, range, [0.28, 0.55, 1])

  return (
    <motion.div
      ref={slotRef}
      className={`${styles.slot} ${styles[item.slot]}`}
      style={
        prefersReduced
          ? undefined
          : {
              x,
              y,
              rotate,
              rotateX,
              scale,
              opacity,
            }
      }
    >
      <CareerCard item={item} />
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
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.08) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
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
