import { motion, useReducedMotion, stagger } from 'motion/react'
import styles from './ProductionProof.module.css'

const revealItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', visualDuration: 0.45, bounce: 0 },
  },
}

export default function ProductionProof() {
  const prefersReduced = useReducedMotion()

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

        <motion.div
          className={styles.grid}
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.1) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.article
            className={styles.flagship}
            variants={revealItem}
            aria-label="LAMF log pipeline"
          >
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

          <div className={styles.cluster}>
            <motion.article
              className={styles.traffic}
              variants={revealItem}
              aria-label="Traffic"
            >
              <div className={styles.trafficCopy}>
                <p className={styles.trafficValue}>700K+</p>
                <p className={styles.trafficLabel}>requests / day</p>
              </div>
              <p className={`mono ${styles.trafficNote}`}>TOP-10 KFIN PRODUCT</p>
            </motion.article>

            <div className={styles.efficiency}>
              <motion.article
                className={styles.mini}
                variants={revealItem}
                aria-label="Query speed"
              >
                <div>
                  <p className={styles.miniValue}>&lt;3s</p>
                  <p className={styles.miniLabel}>analytics query</p>
                </div>
                <p className={`mono ${styles.miniNote}`}>from 15 seconds</p>
              </motion.article>

              <motion.article
                className={styles.mini}
                variants={revealItem}
                aria-label="Build speed"
              >
                <div>
                  <p className={styles.miniValue}>60%</p>
                  <p className={styles.miniLabel}>faster builds</p>
                </div>
                <p className={`mono ${styles.miniNote}`}>ECR layer cache</p>
              </motion.article>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
