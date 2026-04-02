import styles from './Education.module.css'

/**
 * Reusable education card.
 * Props: { degree, institution, affiliatedTo, location, start, end, grade, bullets }
 */
export function EducationCard({ degree, institution, affiliatedTo, location, start, end, grade, bullets }) {
  const dateRange = start ? `${start} – ${end}` : end

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <h3 className={styles.degree}>{degree}</h3>
          <p className={styles.institution}>{institution}</p>
          {affiliatedTo && <p className={styles.affiliated}>{affiliatedTo}</p>}
          <p className={styles.location}>📍 {location}</p>
        </div>
        <div className={styles.right}>
          <span className={`mono ${styles.dates}`}>{dateRange}</span>
          {grade && <span className={styles.grade}>{grade}</span>}
        </div>
      </div>

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
  )
}
