import { useState } from 'react'
import {
  LayoutGroup,
  motion,
  useReducedMotion,
  stagger,
} from 'motion/react'
import styles from './ProductionProof.module.css'

const revealItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', visualDuration: 0.45, bounce: 0 },
  },
}

const metricSpring = {
  type: 'spring',
  stiffness: 155,
  damping: 21,
  mass: 0.72,
}

const metricTransition = {
  default: metricSpring,
  opacity: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
}

const flagshipReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.9, rotate: -1.2 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: metricTransition,
  },
}

const clusterReveal = {
  hidden: {},
  show: {
    transition: {
      delayChildren: stagger(0.11, { startDelay: 0.1 }),
    },
  },
}

const efficiencyReveal = {
  hidden: {},
  show: {
    transition: {
      delayChildren: stagger(0.09, { startDelay: 0.06 }),
    },
  },
}

const trafficReveal = {
  hidden: {
    opacity: 0,
    x: '-58%',
    y: 96,
    scale: 0.7,
    rotate: -3.5,
    transformOrigin: '0% 65%',
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: metricTransition,
  },
}

const queryReveal = {
  hidden: {
    opacity: 0,
    x: '-125%',
    y: -44,
    scale: 0.64,
    rotate: 4,
    transformOrigin: '0% 0%',
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: metricTransition,
  },
}

const buildReveal = {
  hidden: {
    opacity: 0,
    x: '-185%',
    y: -38,
    scale: 0.6,
    rotate: -4.5,
    transformOrigin: '0% 0%',
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: metricTransition,
  },
}

export default function ProductionProof() {
  const prefersReduced = useReducedMotion()
  const [activeMetric, setActiveMetric] = useState('lamf')

  const metricInteraction = (id) => ({
    'data-active': activeMetric === id ? 'true' : undefined,
    tabIndex: 0,
    onPointerEnter: () => setActiveMetric(id),
    onFocus: () => setActiveMetric(id),
    onClick: () => setActiveMetric(id),
  })

  const activeBackdrop = (
    <motion.span
      className={styles.activeBackdrop}
      layoutId="production-proof-active"
      style={{
        borderRadius: 20,
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.24), inset 0 -18px 36px rgba(9, 9, 11, 0.1)',
      }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 310, damping: 30, mass: 0.7 }
      }
      aria-hidden="true"
    />
  )

  return (
    <section className={styles.section} id="proof" aria-labelledby="proof-title">
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
            id="proof-title"
            className={styles.title}
            variants={revealItem}
          >
            <span className={styles.titleLine}>A few numbers</span>
            <span className={styles.titleLine}>I am proud of.</span>
          </motion.h2>
          <motion.p className={styles.intro} variants={revealItem}>
            All from systems I have helped build or run.
          </motion.p>
        </motion.header>

        <LayoutGroup id="production-proof">
          <motion.div
            className={styles.grid}
            variants={{
              hidden: {},
              show: { transition: { delayChildren: stagger(0.14) } },
            }}
            initial={prefersReduced ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.article
              className={`${styles.metricCard} ${styles.flagship}`}
              variants={flagshipReveal}
              aria-label="LAMF log pipeline"
              {...metricInteraction('lamf')}
            >
              {activeMetric === 'lamf' && activeBackdrop}
              <p className={`mono ${styles.flagshipContext}`}>LAMF LOG PIPELINE</p>
              <div className={styles.flagshipMid}>
                <p className={styles.flagshipValue}>10M+</p>
                <p className={styles.flagshipLabel}>
                  log events processed each day
                </p>
              </div>
              <p className={`mono ${styles.flagshipPipeline}`}>
                FIREHOSE &nbsp;&gt;&nbsp; GLUE &nbsp;&gt;&nbsp; S3 PARQUET &nbsp;&gt;&nbsp; ATHENA
              </p>
            </motion.article>

            <motion.div className={styles.cluster} variants={clusterReveal}>
              <motion.article
                className={`${styles.metricCard} ${styles.traffic}`}
                variants={trafficReveal}
                aria-label="Traffic"
                {...metricInteraction('traffic')}
              >
                {activeMetric === 'traffic' && activeBackdrop}
                <div className={styles.trafficCopy}>
                  <p className={styles.trafficValue}>700K+</p>
                  <p className={styles.trafficLabel}>requests / day</p>
                </div>
                <p className={`mono ${styles.trafficNote}`}>TOP-10 KFIN PRODUCT</p>
              </motion.article>

              <motion.div
                className={styles.efficiency}
                variants={efficiencyReveal}
              >
                <motion.article
                  className={`${styles.metricCard} ${styles.mini}`}
                  variants={queryReveal}
                  aria-label="Query speed"
                  {...metricInteraction('query')}
                >
                  {activeMetric === 'query' && activeBackdrop}
                  <div>
                    <p className={styles.miniValue}>&lt;3s</p>
                    <p className={styles.miniLabel}>analytics query</p>
                  </div>
                  <p className={`mono ${styles.miniNote}`}>from 15 seconds</p>
                </motion.article>

                <motion.article
                  className={`${styles.metricCard} ${styles.mini}`}
                  variants={buildReveal}
                  aria-label="Build speed"
                  {...metricInteraction('build')}
                >
                  {activeMetric === 'build' && activeBackdrop}
                  <div>
                    <p className={styles.miniValue}>60%</p>
                    <p className={styles.miniLabel}>faster builds</p>
                  </div>
                  <p className={`mono ${styles.miniNote}`}>ECR layer cache</p>
                </motion.article>
              </motion.div>
            </motion.div>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  )
}
