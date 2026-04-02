import styles from './Loader.module.css'

export default function Loader({ mode = 'initial' }) {
  if (mode === 'internal') {
    return (
      <div className={styles.internalWrap} aria-hidden="true">
        <div className={styles.internalBar} />
      </div>
    )
  }

  return (
    <div className={styles.initialOverlay} role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className={styles.initialCard}>
        <div className={styles.spinner} />
        <p className={`mono ${styles.label}`}>Booting cloud portfolio...</p>
      </div>
    </div>
  )
}
