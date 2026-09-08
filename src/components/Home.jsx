import Hero from './Hero'
import ProductionProof from './ProductionProof'
import SystemsUnderPressure from './SystemsUnderPressure'
import ProductionDisciplines from './ProductionDisciplines'
import CareerReleaseStack from './CareerReleaseStack'
import StubbornProblemContact from './StubbornProblemContact'
import styles from './Home.module.css'

export default function Home() {
  return (
    <main id="main" className={styles.home}>
      <div className={styles.spine} aria-hidden="true" />
      <Hero />
      <ProductionProof />
      <SystemsUnderPressure />
      <ProductionDisciplines />
      <CareerReleaseStack />
      <StubbornProblemContact />
    </main>
  )
}
