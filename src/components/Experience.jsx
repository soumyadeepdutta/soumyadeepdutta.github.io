import { experiences } from '../data/experiences'
import ExperienceCard from './ExperienceCard'
import ExperienceDiagram from './ExperienceDiagram'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-header reveal reveal-1">
          <p className="section-label">Where I've worked</p>
          <h2 className="section-title">Experience</h2>
          <div className="divider" />
        </div>

        {/* Interactive Production System Topology Diagram */}
        <ExperienceDiagram />

        <div className={styles.timeline}>
          {experiences.map((exp, i) => (
            <ExperienceCard
              key={`${exp.company}-${i}`}
              {...exp}
              isFirst={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
