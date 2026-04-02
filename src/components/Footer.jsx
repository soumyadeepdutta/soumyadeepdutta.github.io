import styles from './Footer.module.css'
import { navigateToTop } from '../utils/navigation'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <p className={styles.text}>
            © {new Date().getFullYear()} Soumyadeep Dutta. Built with React + Vite.
          </p>
          <a
            href="#"
            className={`mono ${styles.topLink}`}
            onClick={e => {
              e.preventDefault()
              navigateToTop()
            }}
          >
            back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
