import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Hero from './Hero'
import ProductionProof from './ProductionProof'
import SystemsUnderPressure from './SystemsUnderPressure'
import ProductionDisciplines from './ProductionDisciplines'
import CareerReleaseStack from './CareerReleaseStack'
import StubbornProblemContact from './StubbornProblemContact'
import SimpleResumeView from './SimpleResumeView'
import styles from './Home.module.css'
import { instant, viewSwap } from '../utils/motionTokens'

export default function Home({ viewMode = 'portfolio' }) {
  const reduce = useReducedMotion()
  const simple = viewMode === 'brief'

  return (
    <main id="main" className={styles.home}>
      {!simple && <div className={styles.spine} aria-hidden="true" />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={viewMode}
          className={styles.view}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={reduce ? instant : viewSwap}
        >
          {simple ? (
            <SimpleResumeView />
          ) : (
            <>
              <Hero />
              <ProductionProof />
              <SystemsUnderPressure />
              <ProductionDisciplines />
              <CareerReleaseStack />
              <StubbornProblemContact />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
