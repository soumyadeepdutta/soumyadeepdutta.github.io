import { FiTerminal } from 'react-icons/fi'
import {
  SiDjango,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiGit,
  SiGithubactions,
  SiGraphql,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNginx,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiRedis,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si'
import { skills } from '../data/skills'
import styles from './Skills.module.css'

const COLOR_MAP = {
  accent: 'tag',
  blue:   'tag tag-blue',
  green:  'tag tag-green',
  purple: 'tag tag-purple',
}

const ICON_MAP = {
  bash: FiTerminal,
  django: SiDjango,
  docker: SiDocker,
  express: SiExpress,
  fastapi: SiFastapi,
  git: SiGit,
  githubactions: SiGithubactions,
  graphql: SiGraphql,
  javascript: SiJavascript,
  linux: SiLinux,
  mongodb: SiMongodb,
  mysql: SiMysql,
  nginx: SiNginx,
  nodejs: SiNodedotjs,
  openai: SiOpenai,
  postgresql: SiPostgresql,
  python: SiPython,
  redis: SiRedis,
  terraform: SiTerraform,
  typescript: SiTypescript,
}

export default function Skills() {
  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <div className="section-header reveal reveal-1">
          <p className="section-label">What I work with</p>
          <h2 className="section-title">Tech Stack</h2>
          <div className="divider" />
          <p className="section-subtitle">
            My toolkit for building reliable backend systems and cloud-native architectures.
          </p>
        </div>

        <div className={styles.grid}>
          {skills.map((cat, i) => (
            <div
              key={cat.category}
              className={`${styles.category} reveal reveal-${Math.min(i + 1, 5)}`}
            >
              <h3 className={styles.catTitle}>{cat.category}</h3>
              <div className={styles.tags}>
                {cat.items.map(item => {
                  const Icon = item.icon ? ICON_MAP[item.icon] : null

                  return (
                    <span key={item.label} className={`${COLOR_MAP[cat.color] || 'tag'} ${styles.skillTag}`}>
                      {Icon ? <Icon className={styles.skillIcon} aria-hidden="true" /> : null}
                      <span className={styles.skillLabel}>{item.label}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
