import { experiences } from '../data/experiences'
import ExperienceCard from './ExperienceCard'
import ExperienceDiagram from './ExperienceDiagram'
import MotionReveal, { MotionItem } from './MotionReveal'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <MotionReveal className="section-header">
          <MotionItem as="p" className="section-label">Where I've worked</MotionItem>
          <MotionItem as="h2" className="section-title">Experience</MotionItem>
          <MotionItem className="divider" />
        </MotionReveal>

        <ExperienceDiagram />

        <MotionReveal className={styles.timeline} amount={0.12}>
          {experiences.map((exp, i) => (
            <MotionItem key={`${exp.company}-${i}`}>
              <ExperienceCard
                {...exp}
                isFirst={i === 0}
              />
            </MotionItem>
          ))}
        </MotionReveal>
      </div>
    </section>
  )
}
