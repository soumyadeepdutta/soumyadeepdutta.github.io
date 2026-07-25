import styles from './Footer.module.css'
import { navigateToTop } from '../utils/navigation'

const commitDate = typeof __COMMIT_DATE__ !== 'undefined' ? __COMMIT_DATE__ : null

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <p className={styles.text}>
              © {new Date().getFullYear()} Soumyadeep Dutta. Built with React + Vite.
            </p>
            {commitDate && (
              <p className={styles.updatedText}>
                Last updated on {commitDate}
              </p>
            )}
          </div>
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
