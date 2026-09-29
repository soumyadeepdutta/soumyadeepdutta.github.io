import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import styles from './StubbornProblemContact.module.css'
import HandwrittenText from './HandwrittenText'
import { useDealCard, useDealProgress } from '../hooks/useDeal'
import {
  ease,
  instant,
  respond,
  revealItem,
  rhythm,
  spring,
  staggerGroup,
  viewport,
} from '../utils/motionTokens'

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

const titleLineReveal = {
  hidden: { opacity: 0, y: '112%', rotate: 1.2 },
  show: {
    opacity: 1,
    y: '0%',
    rotate: 0,
    transition: spring.entrance,
  },
}

const mainGroup = staggerGroup()
const titleGroup = staggerGroup(rhythm.text)
const actionGroup = staggerGroup(rhythm.text, 0.08)
const factGroup = staggerGroup(rhythm.text, 0.2)

// Atmosphere, not a card: the bloom keeps its own slow tween.
const bloomTransition = { duration: 1.1, ease: ease.outExpo }

// Credentials slide in from the right and rest slightly askew.
const CREDENTIALS_POSE = { x: 48, y: 24, rotate: 2, scale: 0.95 }
const CREDENTIALS_REST = { rotate: -1 }

export default function StubbornProblemContact() {
  const prefersReduced = useReducedMotion()
  const credentialsRef = useRef(null)
  const credentialsProgress = useDealProgress(credentialsRef)
  const credentialsStyle = useDealCard(credentialsProgress, {
    from: CREDENTIALS_POSE,
    to: CREDENTIALS_REST,
  })

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
        transition={prefersReduced ? instant : bloomTransition}
        aria-hidden="true"
      />
      <div className={styles.inner}>
        <motion.div
          className={styles.main}
          variants={mainGroup}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={viewport.text}
        >
          <HandwrittenText className={styles.hand}>
            send the stubborn one
          </HandwrittenText>
          <motion.h2
            id="contact-title"
            className={styles.title}
            variants={titleGroup}
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
            variants={actionGroup}
          >
            <motion.a
              href={EMAIL}
              className={styles.emailCta}
              variants={revealItem}
              whileHover={prefersReduced ? undefined : respond.lift}
              whileTap={prefersReduced ? undefined : respond.press}
              transition={spring.hover}
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
              variants={revealItem}
              whileHover={prefersReduced ? undefined : respond.lift}
              whileTap={prefersReduced ? undefined : respond.press}
              transition={spring.hover}
            >
              GitHub
            </motion.a>
            <motion.a
              href={LINKEDIN}
              className={styles.outlineCta}
              target="_blank"
              rel="noopener noreferrer"
              variants={revealItem}
              whileHover={prefersReduced ? undefined : respond.lift}
              whileTap={prefersReduced ? undefined : respond.press}
              transition={spring.hover}
            >
              LinkedIn
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.aside
          ref={credentialsRef}
          className={styles.credentials}
          aria-label="A few other things"
          style={credentialsStyle ?? CREDENTIALS_REST}
        >
          <HandwrittenText className={styles.credHand} delay={0.18}>
            a few other things
          </HandwrittenText>
          <motion.ul
            className={styles.factList}
            variants={factGroup}
            initial={prefersReduced ? false : 'hidden'}
            whileInView="show"
            viewport={viewport.text}
          >
            {FACTS.map((fact) => (
              <motion.li
                key={fact.title}
                className={styles.fact}
                variants={revealItem}
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
