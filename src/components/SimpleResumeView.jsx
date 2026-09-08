import { motion, useReducedMotion } from 'motion/react'
import styles from './SimpleResumeView.module.css'

const EXPERIENCE = [
  {
    company: 'KFin Technologies Limited',
    location: 'Hyderabad',
    role: 'Software Engineer',
    dates: 'Jul 2024 - Present',
    points: [
      'Own Group SIP backend delivery with a five-engineer team, plus AWS deployment for LAMF, a top-10 KFin product processing 700,000+ requests each day.',
      'Built a Firehose, Glue, S3 Parquet, and Athena log pipeline processing 10,000,000+ events/day and reduced analytical queries from 15 seconds to under 3 seconds.',
      'Reduced CI build time by 60% with ECR layer caching and provision infrastructure through AWS CDK across ECS, Lambda, SQS, Firehose, Glue, API Gateway, NLB, and ASG.',
      'Delivered mTLS, JWE/JWS, and CERSAI KYC integrations at 30,000+ requests/day, plus MCP and Athena tooling for support and production debugging.',
    ],
  },
  {
    company: 'Airdit Software Services',
    location: 'Bengaluru',
    role: 'Senior Software Developer',
    dates: 'Oct 2023 - May 2024',
    points: [
      'Developed a Node.js and PostgreSQL SaaS backend, integrated Azure AI image and speech APIs, and added Jest unit coverage.',
      'Built an enterprise application on SAP BTP using Node.js and SAP platform services.',
    ],
  },
  {
    company: 'Techno Exponent',
    location: 'Kolkata',
    role: 'Software Development Engineer',
    dates: 'Sep 2022 - Sep 2023',
    points: [
      'Engineered backend APIs for a high-traffic healthcare platform and integrated Stripe, AWS S3, and Telnyx workflows.',
      'Prototyped structured prescription drafting with Whisper, Llama 2, and Pydantic validation.',
    ],
  },
  {
    company: '99ideas SaaS Pvt. Ltd.',
    location: 'Pune, remote',
    role: 'Software Development Engineer',
    dates: 'Jan 2021 - Aug 2022',
    points: [
      'Built Node.js APIs for national academic admissions and analytics dashboards with Python, Pandas, and Django.',
    ],
  },
]

const SYSTEM_GROUPS = [
  {
    title: 'Production systems',
    items: [
      {
        name: 'LAMF',
        meta: '700K+ requests/day · 10M+ events/day · queries under 3s',
        text: 'Lending infrastructure spanning deployment, asynchronous workflows, log analytics, observability, and internal support tooling.',
      },
      {
        name: 'Group SIP',
        meta: 'NestJS · MongoDB · ECS · CDK',
        text: 'Corporate investment portal delivered end to end with team leadership, backend ownership, infrastructure, and CI/CD.',
      },
      {
        name: 'Doctorscan',
        meta: 'Node.js · Stripe · S3 · Telnyx',
        text: 'Healthcare backend for consultation, payments, storage, telephony, and scheduling across web and mobile.',
      },
    ],
  },
  {
    title: 'Agent and data tools',
    items: [
      {
        name: 'Simplete-PMS',
        meta: 'React · Fastify · MongoDB · MCP',
        text: 'Self-hosted project management with RBAC, timelines, and an MCP server over HTTP.',
      },
      {
        name: 'Artha',
        meta: 'Python · Ollama · Qdrant · SQLite',
        text: 'Local personal-finance RAG with exact ledgers and no cloud API dependency.',
      },
      {
        name: 'LAMF support MCP',
        meta: 'MCP · Athena · production support',
        text: 'Internal agent tooling that helps support answer client queries and developers inspect bounded log windows.',
      },
    ],
  },
]

const SKILL_GROUPS = [
  {
    title: 'Core engineering',
    rows: [
      ['Backend', 'Node.js, ExpressJS, NestJS, TypeScript, JavaScript, Python'],
      ['Data', 'PostgreSQL, MySQL, MongoDB, SQLite, Qdrant'],
      ['Architecture', 'Event-driven systems, serverless, REST APIs, distributed systems'],
    ],
  },
  {
    title: 'Platform and operations',
    rows: [
      ['AWS', 'ECS, EC2, Lambda, SQS, S3, Firehose, Glue, Athena, API Gateway, CDK'],
      ['Delivery', 'Jenkins, Docker, ECR, CI/CD pipelines'],
      ['Observability', 'Prometheus, Grafana, Tempo, CloudWatch'],
    ],
  },
  {
    title: 'Security and AI',
    rows: [
      ['Security', 'JWE/JWS, mTLS, SSO/OAuth'],
      ['Testing', 'Jest, Postman automated tests'],
      ['Agent tooling', 'MCP servers, Ollama, RAG, Cursor, Kiro, Azure AI APIs'],
    ],
  },
]

const reveal = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

function Reveal({ children, className = '', amount = 0.16 }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={reveal}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'visible'}
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  )
}

export default function SimpleResumeView() {
  return (
    <article className={styles.simpleView}>
      <header className={styles.hero} id="simple-profile">
        <Reveal className={styles.heroGrid} amount={0.4}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Backend engineer</p>
            <h1>Soumyadeep Dutta</h1>
            <p className={styles.role}>
              Node.js and AWS systems for fintech, healthcare, and SaaS.
            </p>
            <p className={styles.summary}>
              Five years owning backend work from API design through deployment,
              observability, production support, and team delivery.
            </p>
            <div className={styles.contactLine}>
              <a href="mailto:imsoumyadeepdutta@gmail.com">
                imsoumyadeepdutta@gmail.com
              </a>
              <a
                href="https://github.com/soumyadeepdutta"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/soumyadeep-dutta"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <dl className={styles.profileFacts}>
            <div>
              <dt>Current</dt>
              <dd>KFin Technologies</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Backend, AWS, distributed systems</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Kolkata, India</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className={styles.metrics}>
          {[
            ['5+', 'years shipping'],
            ['700K+', 'requests / day'],
            ['10M+', 'events / day'],
            ['<3s', 'analytics queries'],
          ].map(([value, label]) => (
            <div className={styles.metric} key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </Reveal>
      </header>

      <section
        className={`${styles.section} ${styles.sectionTint}`}
        id="simple-experience"
        aria-labelledby="simple-experience-title"
      >
        <Reveal className={styles.sectionHeading}>
          <h2 id="simple-experience-title">Professional experience</h2>
          <p>
            Backend delivery that expanded into infrastructure, security,
            observability, and team ownership.
          </p>
        </Reveal>

        <div className={styles.experienceList}>
          {EXPERIENCE.map((job) => (
            <Reveal className={styles.job} key={job.company}>
              <div className={styles.jobMeta}>
                <h3>{job.company}</h3>
                <p>{job.location}</p>
                <span>{job.dates}</span>
              </div>
              <div className={styles.jobBody}>
                <h4>{job.role}</h4>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className={styles.section}
        id="simple-systems"
        aria-labelledby="simple-systems-title"
      >
        <Reveal className={styles.sectionHeading}>
          <h2 id="simple-systems-title">Selected systems</h2>
          <p>
            The products and internal tools behind the production numbers.
          </p>
        </Reveal>

        <div className={styles.systemGroups}>
          {SYSTEM_GROUPS.map((group) => (
            <Reveal className={styles.systemGroup} key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item) => (
                <article className={styles.system} key={item.name}>
                  <h4>{item.name}</h4>
                  <p>{item.text}</p>
                  <span>{item.meta}</span>
                </article>
              ))}
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.sectionTint}`}
        id="simple-skills"
        aria-labelledby="simple-skills-title"
      >
        <Reveal className={styles.sectionHeading}>
          <h2 id="simple-skills-title">Technical range</h2>
        </Reveal>

        <div className={styles.skillGroups}>
          {SKILL_GROUPS.map((group) => (
            <Reveal className={styles.skillGroup} key={group.title}>
              <h3>{group.title}</h3>
              <dl>
                {group.rows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.closing}`}
        id="simple-contact"
        aria-labelledby="simple-contact-title"
      >
        <Reveal className={styles.credentials}>
          <div>
            <h2>Credentials</h2>
            <dl>
              <div>
                <dt>B.Tech, Computer Science and Engineering</dt>
                <dd>
                  Supreme Knowledge Foundation Group of Institutions · CGPA 8.40
                </dd>
              </div>
              <div>
                <dt>AWS Solutions Architect - Associate</dt>
                <dd>In progress</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>Bengali, English, Hindi</dd>
              </div>
            </dl>
          </div>
          <div className={styles.contactBlock}>
            <h2 id="simple-contact-title">Contact</h2>
            <p>
              Open to comparing notes on backend systems, infrastructure, and
              practical AI tooling.
            </p>
            <a
              className={styles.emailLink}
              href="mailto:imsoumyadeepdutta@gmail.com"
            >
              Email me <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>
      </section>
    </article>
  )
}
