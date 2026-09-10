import { motion, useReducedMotion, stagger } from 'motion/react'
import styles from './StubbornProblemContact.module.css'
import HandwrittenText from './HandwrittenText'

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

const TITLE_LINES = [
  'Bring me the backend',
  'problem nobody wants',
  'to touch.',
]

const revealItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', visualDuration: 0.45, bounce: 0 },
  },
}

const titleLineReveal = {
  hidden: { opacity: 0, y: '112%', rotate: 1.2 },
  show: {
    opacity: 1,
    y: '0%',
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 170,
      damping: 22,
      mass: 0.8,
    },
  },
}

const actionReveal = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 240, damping: 22 },
  },
}

const factReveal = {
  hidden: { opacity: 0, x: 18 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 220, damping: 24 },
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
      <motion.div
        className={styles.contactBloom}
        initial={prefersReduced ? false : { opacity: 0, scale: 0.72 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
        }
        aria-hidden="true"
      />
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
          <HandwrittenText className={styles.hand}>
            send the stubborn one
          </HandwrittenText>
          <motion.h2
            id="contact-title"
            className={styles.title}
            variants={{
              hidden: {},
              show: { transition: { delayChildren: stagger(0.09) } },
            }}
          >
            {TITLE_LINES.map((line) => (
              <span className={styles.titleMask} key={line}>
                <motion.span
                  className={styles.titleLine}
                  variants={titleLineReveal}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <motion.p className={styles.body} variants={revealItem}>
            Or just say hello. I am always up for comparing notes on backend
            systems, AI tooling, and the strange bugs that reach production.
          </motion.p>
          <motion.div
            className={styles.actions}
            variants={{
              hidden: {},
              show: {
                transition: {
                  delayChildren: stagger(0.07, { startDelay: 0.08 }),
                },
              },
            }}
          >
            <motion.a
              href={EMAIL}
              className={styles.emailCta}
              variants={actionReveal}
              whileHover={prefersReduced ? undefined : { y: -4 }}
              whileTap={prefersReduced ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <span className={styles.emailLabel}>Email me</span>
              <span className={styles.arrowShell} aria-hidden="true">
                ↗
              </span>
            </motion.a>
            <motion.a
              href={GITHUB}
              className={styles.outlineCta}
              target="_blank"
              rel="noopener noreferrer"
              variants={actionReveal}
              whileHover={prefersReduced ? undefined : { y: -4 }}
              whileTap={prefersReduced ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              GitHub
            </motion.a>
            <motion.a
              href={LINKEDIN}
              className={styles.outlineCta}
              target="_blank"
              rel="noopener noreferrer"
              variants={actionReveal}
              whileHover={prefersReduced ? undefined : { y: -4 }}
              whileTap={prefersReduced ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              LinkedIn
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.aside
          className={styles.credentials}
          aria-label="A few other things"
          initial={
            prefersReduced
              ? false
              : { opacity: 0, x: 64, rotate: 2.5, scale: 0.94 }
          }
          whileInView={{ opacity: 1, x: 0, rotate: -1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 150,
                  damping: 22,
                  mass: 0.9,
                }
          }
        >
          <HandwrittenText className={styles.credHand} delay={0.18}>
            a few other things
          </HandwrittenText>
          <motion.ul
            className={styles.factList}
            variants={{
              hidden: {},
              show: {
                transition: {
                  delayChildren: stagger(0.08, { startDelay: 0.2 }),
                },
              },
            }}
            initial={prefersReduced ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.45 }}
          >
            {FACTS.map((fact) => (
              <motion.li
                key={fact.title}
                className={styles.fact}
                variants={factReveal}
              >
                <p className={styles.factTitle}>{fact.title}</p>
                <p className={styles.factBody}>{fact.body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.aside>
      </div>
    </section>
  )
}
