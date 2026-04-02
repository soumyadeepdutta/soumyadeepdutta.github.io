import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import styles from './Projects.module.css'

export default function Projects() {
  return (
    <section className="section section-alt" id="projects">
      <div className="container">
        <div className="section-header reveal reveal-1">
          <p className="section-label">What I've built</p>
          <h2 className="section-title">Projects</h2>
          <div className="divider" />
          <p className="section-subtitle">
            A selection of backend and cloud projects. Edit{' '}
            <code className="mono" style={{ fontSize: '0.85em', color: 'var(--accent)' }}>src/data/projects.js</code>{' '}
            to add your own.
          </p>
        </div>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <div key={project.name} className={`reveal reveal-${Math.min(i + 1, 5)}`}>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
