import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>© {year} Soumyadeep Dutta</p>
        <p className={styles.closing}>Thanks for reading past the hero.</p>
      </div>
    </footer>
  )
}
