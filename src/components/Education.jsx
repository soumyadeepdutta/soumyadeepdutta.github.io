import { education } from '../data/education'
import { EducationCard } from './EducationCard'
import styles from './Education.module.css'

export default function Education() {
  return (
    <section className="section section-alt" id="education">
      <div className="container">
        <div className="section-header reveal reveal-1">
          <p className="section-label">Academic background</p>
          <h2 className="section-title">Education</h2>
          <div className="divider" />
        </div>

        <div className={styles.list}>
          {education.map((edu, i) => (
            <div key={`${edu.institution}-${i}`} className={`reveal reveal-${Math.min(i + 1, 5)}`}>
              <EducationCard {...edu} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
