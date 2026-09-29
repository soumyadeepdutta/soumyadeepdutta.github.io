import { motion, useReducedMotion } from 'motion/react'
import styles from './SimpleResumeView.module.css'
import {
  revealItem,
  rhythm,
  staggerGroup,
  viewport,
} from '../utils/motionTokens'

const EXPERIENCE = [
  {
    company: 'KFin Technologies Limited',
    location: 'Hyderabad',
    role: 'Software Engineer',
    dates: 'Jul 2024 - Present',
    points: [
      'Run AWS deployment for LAMF (Loan Against Mutual Fund), a top-10 KFin product used by 23 AMCs and moving close to ₹1 crore a day; built its SQS + Lambda notification service with DLQ-based failure handling.',
      'Led a five-engineer team to build the Group SIP corporate investment portal end to end (NestJS, MongoDB, ECS, CDK); the product is now in its sales phase. Currently mentoring two interns across three projects.',
      "Built an MCP server that lets the LAMF support team's AI agent resolve six recurring client queries (unprocessed requests, KYC status, folio mode of holding, blocked funds), plus an Athena query runner for debugging.",
      'Built a Firehose, Glue, S3 Parquet, and Athena log pipeline for 10M+ events a day, cutting log queries from 15 seconds to under 3.',
      'Cut CI builds from 12–14 minutes to 3–5 with ECR layer caching; infrastructure in AWS CDK across ECS, Lambda, SQS, Firehose, Glue, API Gateway, NLB, and ASG.',
      'Built an mTLS-secured wrapper for CERSAI KYC in the KFin NPS product, with JWE/JWS protection for financial payloads.',
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
      'Joined as a contract developer (Jan–Jul 2021), then full-time from Aug 2021.',
      'Built Node.js APIs for national PGDM admissions (merit lists, fee payments across institutions) and analytics dashboards with Python, Pandas, and Django.',
    ],
  },
]

const SYSTEM_GROUPS = [
  {
    title: 'Production systems',
    items: [
      {
        name: 'LAMF',
        meta: '23 AMCs · ~₹1 Cr/day · log queries under 3s',
        text: 'Lending infrastructure spanning deployment, asynchronous workflows, log analytics, observability, and internal support tooling.',
      },
      {
        name: 'Group SIP',
        meta: 'NestJS · MongoDB · ECS · CDK',
        text: 'Salary-linked SIPs across multiple AMCs, built end to end with team leadership, backend ownership, infrastructure, and CI/CD. Now in its sales phase.',
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
        text: "Lets the support team's AI agent resolve six recurring client queries on its own, and gives developers bounded log windows for debugging.",
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

const group = staggerGroup(rhythm.cards)

// Brief is Rise only: a group fades up once, item by item, on springs.
function Reveal({ children, className = '', amount }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={group}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={amount ? { ...viewport.group, amount } : viewport.group}
    >
      {children}
    </motion.div>
  )
}

function Item({ children, as = 'div', ...rest }) {
  const Tag = motion[as]

  return (
    <Tag variants={revealItem} {...rest}>
      {children}
    </Tag>
  )
}

export default function SimpleResumeView() {
  return (
    <article className={styles.simpleView}>
      <header className={styles.hero} id="simple-profile">
        <Reveal className={styles.heroGrid} amount={0.4}>
          <Item className={styles.heroCopy}>
            <p className={styles.kicker}>Backend engineer at KFin Technologies</p>
            <h1>Soumyadeep Dutta</h1>
            <p className={styles.role}>
              Node.js, Python, and AWS systems for fintech, healthcare, and SaaS.
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
          </Item>

          <Item as="dl" className={styles.profileFacts}>
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
          </Item>
        </Reveal>

        <Reveal className={styles.metrics}>
          {[
            ['5+', 'years shipping'],
            ['23', 'AMCs on LAMF'],
            ['~₹1 Cr', 'moved / day'],
            ['3–5 min', 'CI builds, from 12–14'],
          ].map(([value, label]) => (
            <Item className={styles.metric} key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </Item>
          ))}
        </Reveal>
      </header>

      <section
        className={`${styles.section} ${styles.sectionTint}`}
        id="simple-experience"
        aria-labelledby="simple-experience-title"
      >
        <Reveal className={styles.sectionHeading}>
          <Item as="h2" id="simple-experience-title">
            Professional experience
          </Item>
          <Item as="p">
            Backend delivery that expanded into infrastructure, security,
            observability, and team ownership.
          </Item>
        </Reveal>

        <Reveal className={styles.experienceList}>
          {EXPERIENCE.map((job) => (
            <Item className={styles.job} key={job.company}>
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
            </Item>
          ))}
        </Reveal>
      </section>

      <section
        className={styles.section}
        id="simple-systems"
        aria-labelledby="simple-systems-title"
      >
        <Reveal className={styles.sectionHeading}>
          <Item as="h2" id="simple-systems-title">
            Selected systems
          </Item>
          <Item as="p">
            The products and internal tools behind the production numbers.
          </Item>
        </Reveal>

        <div className={styles.systemGroups}>
          {SYSTEM_GROUPS.map((group) => (
            <Reveal className={styles.systemGroup} key={group.title}>
              <Item as="h3">{group.title}</Item>
              {group.items.map((item) => (
                <Item as="article" className={styles.system} key={item.name}>
                  <h4>{item.name}</h4>
                  <p>{item.text}</p>
                  <span>{item.meta}</span>
                </Item>
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
          <Item as="h2" id="simple-skills-title">
            Technical range
          </Item>
        </Reveal>

        <Reveal className={styles.skillGroups}>
          {SKILL_GROUPS.map((group) => (
            <Item className={styles.skillGroup} key={group.title}>
              <h3>{group.title}</h3>
              <dl>
                {group.rows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </Item>
          ))}
        </Reveal>
      </section>

      <section
        className={`${styles.section} ${styles.closing}`}
        id="simple-contact"
        aria-labelledby="simple-contact-title"
      >
        <Reveal className={styles.credentials}>
          <Item>
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
          </Item>
          <Item className={styles.contactBlock}>
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
          </Item>
        </Reveal>
      </section>
    </article>
  )
}
