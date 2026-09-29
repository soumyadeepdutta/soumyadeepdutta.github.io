import { useRef, useState } from 'react'
import {
  LayoutGroup,
  motion,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import styles from './SystemsUnderPressure.module.css'
import DealSlot from './DealSlot'
import { useDealCard, useDealProgress } from '../hooks/useDeal'
import {
  instant,
  respond,
  revealItem,
  rhythm,
  spring,
  staggerGroup,
  viewport,
} from '../utils/motionTokens'

const STAGES = [
  { index: '01', role: 'INGEST', name: 'Firehose', detail: 'event stream' },
  { index: '02', role: 'CATALOG', name: 'AWS Glue', detail: 'schema layer' },
  { index: '03', role: 'STORE', name: 'S3 Parquet', detail: 'columnar lake' },
  { index: '04', role: 'QUERY', name: 'Athena', detail: 'answer in <3s' },
]

const headerGroup = staggerGroup()
const corridorGroup = staggerGroup(rhythm.text)

const LAMF_POSE = { y: 40, rotateX: 5, scale: 0.97 }

// The pipeline runs on the LAMF card's progress: the route fill grows across
// PIPELINE_RANGE and each stage lands as the fill reaches its slot.
const PIPELINE_RANGE = [0.35, 0.9]
const STAGE_POSE = { y: 16, scale: 0.96 }
const STAGE_SPAN = 0.2

// Group SIP leads; the labs slide out from behind it.
const CASE_POSES = {
  sip: { y: 36, scale: 0.96 },
  simplete: { x: -56, y: 20, rotate: -1.5, rotateY: -4, scale: 0.94 },
  artha: { x: -64, y: 28, rotate: 1.5, rotateY: -4, scale: 0.94 },
}

function stageWindow(index) {
  const [from, to] = PIPELINE_RANGE
  const end = from + ((to - from) * (index + 1)) / STAGES.length
  return [end - STAGE_SPAN, end]
}

function CorridorStack({ prefersReduced, progress }) {
  const [activeStage, setActiveStage] = useState(STAGES.length - 1)
  const routeScale = useTransform(progress, PIPELINE_RANGE, [0, 1])

  return (
    <motion.div
      className={styles.corridor}
      variants={corridorGroup}
      initial={prefersReduced ? false : 'hidden'}
      whileInView="show"
      viewport={viewport.group}
      onPointerLeave={() => setActiveStage(STAGES.length - 1)}
    >
      <motion.div className={styles.metricHeader} variants={revealItem}>
        <div className={styles.metricLeft}>
          <p className={styles.eventValue}>10,000,000+</p>
          <p className={styles.eventLabel}>
            log events a day, all of them queryable
          </p>
        </div>
        <div className={styles.queryMetric} aria-label="Query time improved from 15 seconds to under 3 seconds">
          <span className={`mono ${styles.queryOld}`}>15s</span>
          <span className={styles.queryArrow} aria-hidden="true">→</span>
          <strong className={`mono ${styles.queryGain}`}>&lt;3s</strong>
          <span className={`mono ${styles.queryLabel}`}>ATHENA QUERY</span>
        </div>
      </motion.div>

      <LayoutGroup id="lamf-signal-path">
        <div
          className={styles.pipeline}
          role="list"
          aria-label="Pipeline stages"
        >
          <div className={styles.pipelineRoute} aria-hidden="true">
            <motion.span
              className={styles.pipelineRouteFill}
              style={{ scaleX: prefersReduced ? 1 : routeScale }}
            />
          </div>

          {STAGES.map((stage, index) => (
            <DealSlot
              key={stage.index}
              className={styles.stageSlot}
              progress={progress}
              window={stageWindow(index)}
              from={STAGE_POSE}
              role="listitem"
            >
              <motion.div
                className={styles.stage}
                data-active={activeStage === index ? 'true' : undefined}
                tabIndex={0}
                aria-current={activeStage === index ? 'step' : undefined}
                aria-label={`${stage.role}: ${stage.name}`}
                onPointerEnter={() => setActiveStage(index)}
                onFocus={() => setActiveStage(index)}
                onClick={() => setActiveStage(index)}
                whileHover={prefersReduced ? undefined : respond.lift}
                whileTap={prefersReduced ? undefined : respond.press}
                transition={spring.hover}
              >
                {activeStage === index && (
                  <motion.span
                    className={styles.stageActive}
                    layoutId="lamf-active-stage"
                    style={{
                      borderRadius: 14,
                      boxShadow:
                        'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -18px 34px rgba(9, 12, 18, 0.08)',
                    }}
                    transition={prefersReduced ? instant : spring.highlight}
                    aria-hidden="true"
                  />
                )}
                <div className={styles.stageTop}>
                  <span className={`mono ${styles.stageIndex}`}>
                    {stage.index}
                  </span>
                  <span className={`mono ${styles.stageRole}`}>
                    {stage.role}
                  </span>
                </div>
                <strong className={styles.stageName}>{stage.name}</strong>
                <span className={`mono ${styles.stageDetail}`}>
                  {stage.detail}
                </span>
              </motion.div>
            </DealSlot>
          ))}
        </div>
      </LayoutGroup>

      <motion.div className={styles.obsRail} variants={revealItem}>
        <span className={styles.obsLine} aria-hidden="true" />
        <div className={styles.obsCopy}>
          <span className={`mono ${styles.obsLabel}`}>
            TRACE THE WHOLE PATH
          </span>
          <span className={`mono ${styles.obsTools}`}>
            Prometheus &nbsp;/&nbsp; Tempo &nbsp;/&nbsp; Grafana
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function SystemsUnderPressure() {
  const prefersReduced = useReducedMotion()
  const [activeCase, setActiveCase] = useState('sip')
  const lamfRef = useRef(null)
  const lamfProgress = useDealProgress(lamfRef)
  const lamfStyle = useDealCard(lamfProgress, { from: LAMF_POSE })
  const secondaryRef = useRef(null)
  const secondaryProgress = useDealProgress(secondaryRef)

  const activeSurface = (id) =>
    activeCase === id ? (
      <motion.span
        className={styles.caseActive}
        layoutId="secondary-case-active"
        style={{
          borderRadius: id === 'sip' ? 22 : 20,
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -24px 42px rgba(9, 12, 18, 0.08)',
        }}
        transition={prefersReduced ? instant : spring.highlight}
        aria-hidden="true"
      />
    ) : null

  return (
    <section
      className={styles.section}
      id="systems"
      aria-labelledby="systems-title"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          variants={headerGroup}
          initial={prefersReduced ? false : 'hidden'}
          whileInView="show"
          viewport={viewport.text}
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
          ref={lamfRef}
          className={styles.lamf}
          aria-label="LAMF flagship case"
          style={lamfStyle}
        >
          <div className={styles.lamfNarrative}>
            <div className={styles.lamfIntro}>
              <p className={styles.lamfName}>LAMF</p>
              <p className={styles.lamfStatement}>
                Loan Against Mutual Fund: a lending platform for 23 AMCs, where
                throughput, auditability, and recovery all matter at once.
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

          <CorridorStack
            prefersReduced={prefersReduced}
            progress={lamfProgress}
          />
        </motion.article>

        <LayoutGroup id="secondary-casework">
          <div
            ref={secondaryRef}
            className={styles.secondary}
            onPointerLeave={() => setActiveCase('sip')}
          >
            <DealSlot
              className={`${styles.caseSlot} ${styles.sipSlot}`}
              progress={secondaryProgress}
              index={0}
              count={3}
              from={CASE_POSES.sip}
            >
              <motion.article
                className={`${styles.caseCard} ${styles.sip}`}
                data-active={activeCase === 'sip' ? 'true' : undefined}
                aria-label="Group SIP"
                tabIndex={0}
                onPointerEnter={() => setActiveCase('sip')}
                onFocus={() => setActiveCase('sip')}
                onClick={() => setActiveCase('sip')}
                whileHover={prefersReduced ? undefined : respond.lift}
                whileTap={prefersReduced ? undefined : respond.press}
                transition={spring.hover}
              >
                {activeSurface('sip')}
                <div className={styles.sipHeader}>
                  <h3 className={styles.sipName}>Group SIP</h3>
                  <p className={styles.sipRole}>Salary-linked SIPs across AMCs</p>
                  <p className={styles.sipSummary}>
                    Owned the backend, led five engineers, and built it end to
                    end on ECS with CDK. It is now in its sales phase.
                  </p>
                </div>

                <div className={styles.sipProof}>
                  <div className={styles.sipTeam}>
                    <p className={styles.sipTeamValue}>05</p>
                    <p className={styles.sipTeamLabel}>engineers led</p>
                  </div>
                  <div className={styles.sipShip}>
                    <p className={styles.sipShipValue}>0→1</p>
                    <p className={`mono ${styles.sipShipStack}`}>
                      NESTJS &nbsp;/&nbsp; ECS &nbsp;/&nbsp; CDK
                    </p>
                  </div>
                </div>

                <p className={styles.sipLesson}>
                  The architecture, deployment, and team had to move together.
                  Owning only one would not have been enough.
                </p>
              </motion.article>
            </DealSlot>

            <div className={styles.labs}>
              <DealSlot
                className={styles.caseSlot}
                progress={secondaryProgress}
                index={1}
                count={3}
                from={CASE_POSES.simplete}
              >
                <motion.article
                  className={`${styles.caseCard} ${styles.lab} ${styles.labSimplete}`}
                  data-active={activeCase === 'simplete' ? 'true' : undefined}
                  aria-label="Simplete-PMS"
                  tabIndex={0}
                  onPointerEnter={() => setActiveCase('simplete')}
                  onFocus={() => setActiveCase('simplete')}
                  onClick={() => setActiveCase('simplete')}
                  whileHover={prefersReduced ? undefined : respond.lift}
                  whileTap={prefersReduced ? undefined : respond.press}
                  transition={spring.hover}
                >
                  {activeSurface('simplete')}
                  <div>
                    <p className={`mono ${styles.labKind}`}>PROJECTS FOR AGENTS</p>
                    <h3 className={styles.labName}>Simplete-PMS</h3>
                    <p className={styles.labBody}>
                      A self-hosted project system with RBAC, timelines, and an
                      MCP server over HTTP.
                    </p>
                  </div>
                  <p className={`mono ${styles.labStack}`}>
                    React / Fastify / MongoDB / MCP
                  </p>
                </motion.article>
              </DealSlot>

              <DealSlot
                className={styles.caseSlot}
                progress={secondaryProgress}
                index={2}
                count={3}
                from={CASE_POSES.artha}
              >
                <motion.article
                  className={`${styles.caseCard} ${styles.lab} ${styles.labArtha}`}
                  data-active={activeCase === 'artha' ? 'true' : undefined}
                  aria-label="Artha"
                  tabIndex={0}
                  onPointerEnter={() => setActiveCase('artha')}
                  onFocus={() => setActiveCase('artha')}
                  onClick={() => setActiveCase('artha')}
                  whileHover={prefersReduced ? undefined : respond.lift}
                  whileTap={prefersReduced ? undefined : respond.press}
                  transition={spring.hover}
                >
                  {activeSurface('artha')}
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
              </DealSlot>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </section>
  )
}
