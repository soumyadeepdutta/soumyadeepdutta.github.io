import { tools } from '../data/tools'
import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

export default function HandfulTools() {
  return (
    <section className="section" id="tools">
      <div className="container">
        <div className="section-header reveal reveal-1">
          <p className="section-label">Things I built for utility</p>
          <h2 className="section-title">Handful Tools</h2>
          <div className="divider" />
        </div>

        <div className={styles.grid}>
          {tools.map((tool, i) => (
            <div key={tool.name} className={`reveal reveal-${Math.min(i + 1, 5)}`}>
              <ProjectCard {...tool} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
