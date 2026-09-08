import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import MotionReveal, { MotionItem } from './MotionReveal'
import styles from './Projects.module.css'

export default function Projects() {
  return (
    <section className="section section-alt" id="projects">
      <div className="container">
        <MotionReveal className="section-header">
          <MotionItem as="p" className="section-label">What I've built</MotionItem>
          <MotionItem as="h2" className="section-title">Main Projects</MotionItem>
          <MotionItem className="divider" />
        </MotionReveal>

        <MotionReveal className={styles.grid} amount={0.15}>
          {projects.map((project, i) => (
            <MotionItem
              key={project.name}
              className={`${styles.gridItem} ${i === 2 ? styles.featured : ''}`}
            >
              <ProjectCard {...project} featured={i === 2} />
            </MotionItem>
          ))}
        </MotionReveal>
      </div>
    </section>
  )
}
