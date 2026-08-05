import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

export default function Projects() {
  return (
    <section className="section section-alt" id="projects">
      <div className="container">
        <div className="section-header reveal reveal-1">
          <p className="section-label">What I've built</p>
          <h2 className="section-title">Main Projects</h2>
          <div className="divider" />
        </div>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <div
              key={project.name}
              className={`${styles.gridItem} ${i === 2 ? styles.featured : ''} reveal reveal-${Math.min(i + 1, 5)}`}
            >
              <ProjectCard {...project} featured={i === 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
