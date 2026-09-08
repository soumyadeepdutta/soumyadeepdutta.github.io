import { motion, useReducedMotion, stagger } from 'motion/react'
import styles from './CareerReleaseStack.module.css'

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
          <motion.p className={styles.hand} variants={revealItem}>
            I kept saying yes to the next layer
          </motion.p>
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

        <motion.div
          className={styles.stage}
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.09) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          {CARDS.map((item) => (
            <motion.div
              key={item.id}
              className={`${styles.slot} ${styles[item.slot]}`}
              variants={revealItem}
            >
              <CareerCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
