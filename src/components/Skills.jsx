import { skills } from '../data/skills'
import styles from './Skills.module.css'

const COLOR_MAP = {
  accent: 'tag',
  blue:   'tag tag-blue',
  green:  'tag tag-green',
  purple: 'tag tag-purple',
}

export default function Skills() {
  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <div className="section-header reveal reveal-1">
          <p className="section-label">What I work with</p>
          <h2 className="section-title">Tech Stack</h2>
          <div className="divider" />
          <p className="section-subtitle">
            My toolkit for building reliable backend systems and cloud-native architectures.
          </p>
        </div>

        <div className={styles.grid}>
          {skills.map((cat, i) => (
            <div
              key={cat.category}
              className={`${styles.category} reveal reveal-${Math.min(i + 1, 5)}`}
            >
              <h3 className={styles.catTitle}>{cat.category}</h3>
              <div className={styles.tags}>
                {cat.items.map(item => (
                  <span key={item} className={COLOR_MAP[cat.color] || 'tag'}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
