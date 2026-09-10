import styles from './Footer.module.css'
import HandwrittenText from './HandwrittenText'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>© {year} Soumyadeep Dutta</p>
        <HandwrittenText className={styles.closing}>
          Thanks for reading past the hero.
        </HandwrittenText>
      </div>
    </footer>
  )
}
