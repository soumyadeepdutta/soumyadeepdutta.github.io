import { motion, useReducedMotion, stagger } from 'motion/react'
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

        <motion.div
          className={styles.lanes}
          role="list"
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.08) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {LANES.map((lane) => (
            <motion.article
              key={lane.word}
              className={`${styles.lane} ${
                lane.featured ? styles.laneFeatured : ''
              }`}
              role="listitem"
              variants={revealItem}
              aria-label={lane.word}
            >
              <p className={styles.word}>{lane.word}</p>
              <div className={styles.copy}>
                <p className={styles.proof}>{lane.proof}</p>
                <p className={styles.body}>{lane.body}</p>
              </div>
              <p className={`mono ${styles.stack}`}>{lane.stack}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
