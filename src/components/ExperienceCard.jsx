import styles from './Experience.module.css'

/**
 * Reusable experience card.
 * Props: { title, company, location, start, end, tags, bullets }
 */
export default function ExperienceCard({ title, company, location, start, end, tags, bullets, isFirst }) {
  return (
    <div className={`${styles.item} ${isFirst ? styles.first : ''}`}>
      {/* Timeline dot */}
      <div className={styles.dot} aria-hidden="true" />

      <div className={`card ${styles.card}`}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.company}>
              <span>{company}</span>
              <span className={styles.sep}>·</span>
              <span className={styles.location}>{location}</span>
            </p>
          </div>
          <span className={`mono ${styles.dates}`}>
            {start} – {end}
          </span>
        </div>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className={styles.tags}>
            {tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        {/* Bullets */}
        {bullets?.length > 0 && (
          <ul className={styles.bullets}>
            {bullets.map((b, i) => (
              <li key={i} className={styles.bullet}>
                <span className={styles.bulletDot} aria-hidden="true">▸</span>
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
