import { motion, useReducedMotion, stagger } from 'motion/react'
import styles from './SystemsUnderPressure.module.css'

const STAGES = [
  { index: '01', role: 'INGEST', name: 'Firehose' },
  { index: '02', role: 'CATALOG', name: 'AWS Glue' },
  { index: '03', role: 'STORE', name: 'S3 Parquet' },
  { index: '04', role: 'QUERY', name: 'Athena', highlight: true },
]

const revealItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', visualDuration: 0.45, bounce: 0 },
  },
}

export default function SystemsUnderPressure() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className={styles.section}
      id="systems"
      aria-labelledby="systems-title"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.08) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.h2
            id="systems-title"
            className={styles.title}
            variants={revealItem}
          >
            <span className={styles.titleLine}>A few systems</span>
            <span className={styles.titleLine}>I know well.</span>
          </motion.h2>
          <motion.p className={styles.intro} variants={revealItem}>
            The domains changed. I kept looking for the fragile parts and making
            them easier to see.
          </motion.p>
        </motion.header>

        <motion.article
          className={styles.lamf}
          aria-label="LAMF flagship case"
          variants={revealItem}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.lamfNarrative}>
            <div className={styles.lamfIntro}>
              <p className={styles.lamfName}>LAMF</p>
              <p className={styles.lamfStatement}>
                A lending platform where throughput, auditability, and recovery
                all matter at once.
              </p>
              <p className={`mono ${styles.lamfStack}`}>
                AWS &nbsp;/&nbsp; EVENT-DRIVEN &nbsp;/&nbsp; OBSERVABILITY
                &nbsp;/&nbsp; MCP
              </p>
            </div>
            <div className={styles.lamfLesson}>
              <p className={`mono ${styles.lessonLabel}`}>THE HARD PART</p>
              <p className={styles.lessonText}>
                Make failure visible before it becomes customer-facing.
              </p>
            </div>
          </div>

          <div className={styles.corridor}>
            <div className={styles.metricHeader}>
              <div className={styles.metricLeft}>
                <p className={styles.eventValue}>10,000,000+</p>
                <p className={styles.eventLabel}>
                  events entering the corridor each day
                </p>
              </div>
              <p className={`mono ${styles.queryGain}`}>15s &nbsp;&gt;&nbsp; &lt;3s</p>
            </div>

            <div className={styles.stages} role="list">
              {STAGES.map((stage) => (
                <div
                  key={stage.index}
                  className={`${styles.stage} ${
                    stage.highlight ? styles.stageQuery : ''
                  }`}
                  role="listitem"
                >
                  <span className={`mono ${styles.stageIndex}`}>
                    {stage.index}
                  </span>
                  <span className={`mono ${styles.stageRole}`}>{stage.role}</span>
                  <span className={styles.stageName}>{stage.name}</span>
                </div>
              ))}
            </div>

            <div className={styles.obsRail}>
              <span className={`mono ${styles.obsLabel}`}>
                TRACE THE WHOLE PATH
              </span>
              <span className={`mono ${styles.obsTools}`}>
                Prometheus &nbsp;/&nbsp; Tempo &nbsp;/&nbsp; Grafana
              </span>
            </div>
          </div>
        </motion.article>

        <motion.div
          className={styles.secondary}
          variants={{
            hidden: {},
            show: { transition: { delayChildren: stagger(0.1) } },
          }}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.article
            className={styles.sip}
            variants={revealItem}
            aria-label="Group SIP"
          >
            <div className={styles.sipHeader}>
              <h3 className={styles.sipName}>Group SIP</h3>
              <p className={styles.sipRole}>Corporate investment portal</p>
              <p className={styles.sipSummary}>
                Owned the backend, led five engineers, and shipped the platform
                on ECS with infrastructure defined in CDK.
              </p>
            </div>

            <div className={styles.sipProof}>
              <div className={styles.sipTeam}>
                <p className={styles.sipTeamValue}>05</p>
                <p className={styles.sipTeamLabel}>engineers led</p>
              </div>
              <div className={styles.sipShip}>
                <p className={styles.sipShipValue}>ECS</p>
                <p className={`mono ${styles.sipShipStack}`}>
                  CDK &nbsp;/&nbsp; JENKINS &nbsp;/&nbsp; DOCKER
                </p>
              </div>
            </div>

            <p className={styles.sipLesson}>
              The architecture, deployment, and team had to move together.
              Owning only one would not have been enough.
            </p>
          </motion.article>

          <div className={styles.labs}>
            <motion.article
              className={`${styles.lab} ${styles.labSimplete}`}
              variants={revealItem}
              aria-label="Simplete-PMS"
            >
              <div>
                <p className={`mono ${styles.labKind}`}>PROJECTS FOR AGENTS</p>
                <h3 className={styles.labName}>Simplete-PMS</h3>
                <p className={styles.labBody}>
                  A self-hosted project system with RBAC, timelines, and an MCP
                  server over HTTP.
                </p>
              </div>
              <p className={`mono ${styles.labStack}`}>
                React / Fastify / MongoDB / MCP
              </p>
            </motion.article>

            <motion.article
              className={`${styles.lab} ${styles.labArtha}`}
              variants={revealItem}
              aria-label="Artha"
            >
              <div>
                <p className={`mono ${styles.labKind}`}>FINANCE, KEPT LOCAL</p>
                <h3 className={styles.labName}>Artha</h3>
                <p className={styles.labBody}>
                  RAG over bank statements with exact ledgers in SQLite and
                  local recall through Ollama and Qdrant.
                </p>
              </div>
              <p className={`mono ${styles.labStack}`}>
                Python / Ollama / Qdrant / SQLite
              </p>
            </motion.article>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
