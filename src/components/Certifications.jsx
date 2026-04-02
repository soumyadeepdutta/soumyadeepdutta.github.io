import { certifications } from '../data/certifications'
import styles from './Certifications.module.css'

/**
 * Reusable cert card. Data driven from src/data/certifications.js
 */
function CertCard({ name, issuer, date, badge, badgeColor, link, verified }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`card ${styles.card}`}
      style={{ textDecoration: 'none' }}
    >
      <div className={styles.badgeWrap} style={{ '--badge-color': badgeColor }}>
        <span className={styles.emoji}>{badge}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.issuer}>{issuer}</p>
        <div className={styles.footer}>
          <span className={`mono ${styles.date}`}>{date}</span>
          {verified ? (
            <span className={`${styles.badge} ${styles.verified}`}>✓ Verified</span>
          ) : (
            <span className={`${styles.badge} ${styles.inprogress}`}>In Progress</span>
          )}
        </div>
      </div>
    </a>
  )
}

export default function Certifications() {
  return (
    <section className="section" id="certifications">
      <div className="container">
        <div className="section-header reveal reveal-1">
          <p className="section-label">Credentials</p>
          <h2 className="section-title">Certifications</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Professional certifications validating cloud and engineering expertise.
          </p>
        </div>

        <div className={styles.grid}>
          {certifications.map((cert, i) => (
            <div key={cert.name} className={`reveal reveal-${Math.min(i + 1, 5)}`}>
              <CertCard {...cert} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
