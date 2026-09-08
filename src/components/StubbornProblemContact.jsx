import { motion, useReducedMotion, stagger } from 'motion/react'
import styles from './StubbornProblemContact.module.css'

const EMAIL = 'mailto:imsoumyadeepdutta@gmail.com'
const GITHUB = 'https://github.com/soumyadeepdutta'
const LINKEDIN = 'https://www.linkedin.com/in/soumyadeep-dutta/'

const FACTS = [
  {
    title: 'AWS Solutions Architect',
    body: 'Associate certification in progress',
  },
  {
    title: 'B.Tech, Computer Science',
    body: 'CGPA 8.40',
  },
  {
    title: 'Kolkata, India',
    body: 'Bengali / English / Hindi',
  },
  {
    title: 'Outside the terminal',
    body: 'Bike rides, music, and technology exploration',
  },
]

const revealItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', visualDuration: 0.45, bounce: 0 },
  },
}

export default function StubbornProblemContact() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className={styles.section}
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className={styles.inner}>
        <motion.div
          className={styles.main}
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.08) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p className={styles.hand} variants={revealItem}>
            send the stubborn one
          </motion.p>
          <motion.h2
            id="contact-title"
            className={styles.title}
            variants={revealItem}
          >
            <span className={styles.titleLine}>Bring me the backend</span>
            <span className={styles.titleLine}>problem nobody wants</span>
            <span className={styles.titleLine}>to touch.</span>
          </motion.h2>
          <motion.p className={styles.body} variants={revealItem}>
            Or just say hello. I am always up for comparing notes on backend
            systems, AI tooling, and the strange bugs that reach production.
          </motion.p>
          <motion.div className={styles.actions} variants={revealItem}>
            <a href={EMAIL} className={styles.emailCta}>
              <span className={styles.emailLabel}>Email me</span>
              <span className={styles.arrowShell} aria-hidden="true">
                ↗
              </span>
            </a>
            <a
              href={GITHUB}
              className={styles.outlineCta}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href={LINKEDIN}
              className={styles.outlineCta}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </motion.div>
        </motion.div>

        <motion.aside
          className={styles.credentials}
          aria-label="A few other things"
          variants={revealItem}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <p className={styles.credHand}>a few other things</p>
          <ul className={styles.factList}>
            {FACTS.map((fact) => (
              <li key={fact.title} className={styles.fact}>
                <p className={styles.factTitle}>{fact.title}</p>
                <p className={styles.factBody}>{fact.body}</p>
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  )
}
