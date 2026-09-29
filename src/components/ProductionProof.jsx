import { useRef, useState } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import styles from './ProductionProof.module.css'
import DealSlot from './DealSlot'
import { useDealProgress } from '../hooks/useDeal'
import {
  instant,
  respond,
  revealItem,
  spring,
  staggerGroup,
  viewport,
} from '../utils/motionTokens'

const headerGroup = staggerGroup()

// Cards start gathered toward the flagship and fan out into the grid.
const POSES = {
  lamf: { y: 28, scale: 0.97 },
  traffic: { x: -56, y: 20, rotate: -1.5, scale: 0.94 },
  query: { x: -64, y: -12, rotate: 1.5, scale: 0.94 },
  build: { x: -72, y: -12, rotate: -1.5, scale: 0.94 },
}

export default function ProductionProof() {
  const prefersReduced = useReducedMotion()
  const gridRef = useRef(null)
  const progress = useDealProgress(gridRef)
  const [activeMetric, setActiveMetric] = useState('lamf')

  const metricInteraction = (id) => ({
    'data-active': activeMetric === id ? 'true' : undefined,
    tabIndex: 0,
    onPointerEnter: () => setActiveMetric(id),
    onFocus: () => setActiveMetric(id),
    onClick: () => setActiveMetric(id),
    whileHover: prefersReduced ? undefined : respond.lift,
    whileTap: prefersReduced ? undefined : respond.press,
    transition: spring.hover,
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
      transition={prefersReduced ? instant : spring.highlight}
      aria-hidden="true"
    />
  )

  return (
    <section className={styles.section} id="proof" aria-labelledby="proof-title">
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          variants={headerGroup}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={viewport.text}
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
            All from systems I built or run in production.
          </motion.p>
        </motion.header>

        <LayoutGroup id="production-proof">
          <div
            ref={gridRef}
            className={styles.grid}
            onPointerLeave={() => setActiveMetric('lamf')}
          >
            <DealSlot
              className={styles.dealSlot}
              progress={progress}
              index={0}
              count={4}
              from={POSES.lamf}
            >
              <motion.article
                className={`${styles.metricCard} ${styles.flagship}`}
                aria-label="LAMF daily volume"
                {...metricInteraction('lamf')}
              >
                {activeMetric === 'lamf' && activeBackdrop}
                <p className={`mono ${styles.flagshipContext}`}>LAMF · LOAN AGAINST MUTUAL FUND</p>
                <div className={styles.flagshipMid}>
                  <p className={styles.flagshipValue}>~₹1 Cr</p>
                  <p className={styles.flagshipLabel}>
                    moving through the platform most days
                  </p>
                </div>
                <p className={`mono ${styles.flagshipPipeline}`}>
                  AWS &nbsp;/&nbsp; EVENT-DRIVEN &nbsp;/&nbsp; I RUN THE DEPLOYMENT
                </p>
              </motion.article>
            </DealSlot>

            <div className={styles.cluster}>
              <DealSlot
                className={styles.dealSlot}
                progress={progress}
                index={1}
                count={4}
                from={POSES.traffic}
              >
                <motion.article
                  className={`${styles.metricCard} ${styles.traffic}`}
                  aria-label="AMCs served"
                  {...metricInteraction('traffic')}
                >
                  {activeMetric === 'traffic' && activeBackdrop}
                  <div className={styles.trafficCopy}>
                    <p className={styles.trafficValue}>23</p>
                    <p className={styles.trafficLabel}>AMCs on LAMF</p>
                  </div>
                  <p className={`mono ${styles.trafficNote}`}>TOP-10 KFIN PRODUCT</p>
                </motion.article>
              </DealSlot>

              <div className={styles.efficiency}>
                <DealSlot
                  className={styles.dealSlot}
                  progress={progress}
                  index={2}
                  count={4}
                  from={POSES.query}
                >
                  <motion.article
                    className={`${styles.metricCard} ${styles.mini}`}
                    aria-label="Query speed"
                    {...metricInteraction('query')}
                  >
                    {activeMetric === 'query' && activeBackdrop}
                    <div>
                      <p className={styles.miniValue}>&lt;3s</p>
                      <p className={styles.miniLabel}>log queries</p>
                    </div>
                    <p className={`mono ${styles.miniNote}`}>from 15 seconds</p>
                  </motion.article>
                </DealSlot>

                <DealSlot
                  className={styles.dealSlot}
                  progress={progress}
                  index={3}
                  count={4}
                  from={POSES.build}
                >
                  <motion.article
                    className={`${styles.metricCard} ${styles.mini}`}
                    aria-label="Build speed"
                    {...metricInteraction('build')}
                  >
                    {activeMetric === 'build' && activeBackdrop}
                    <div>
                      <p className={styles.miniValue}>3–5m</p>
                      <p className={styles.miniLabel}>CI builds</p>
                    </div>
                    <p className={`mono ${styles.miniNote}`}>from 12–14 min</p>
                  </motion.article>
                </DealSlot>
              </div>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </section>
  )
}
