/**
 * Project data.
 * Add a new object to this array to render a new project card automatically.
 */
export const projects = [
  {
    name: 'Group SIP — Corporate Investment Portal',
    description:
      'Led end-to-end backend development of a corporate SIP portal enabling salary-linked investments across multiple AMC funds. Owned team leadership, backend build, and deployment on AWS ECS with infrastructure provisioned via AWS CDK; CI/CD via Jenkins.',
    tags: ['NestJS', 'MongoDB', 'AWS ECS', 'AWS CDK', 'Jenkins'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'accent',
  },
  {
    name: 'CERSAI KYC Integration (Kfin NPS)',
    description:
      'Built a secure API wrapper for CERSAI KYC integration using mutual TLS (mTLS) for two-way authenticated communication, serving 30,000+ requests/day for regulatory KYC verification.',
    tags: ['mTLS', 'JWE/JWS', 'Node.js', 'Regulatory Tech'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'purple',
  },
  {
    name: 'LAMF — Loan Against Mutual Fund Platform',
    description:
      'Manage full AWS deployment for LAMF lending product. Built an event-driven notification service (SQS + Lambda) for asynchronous PDF generation and email dispatch, and architected log ingestion pipeline (Firehose → Glue → S3 Parquet → Athena) processing 10M+ events/day.',
    tags: ['Kinesis Firehose', 'AWS Glue', 'S3', 'Athena', 'Lambda', 'SQS', 'Prometheus', 'Grafana'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'blue',
  },
  {
    name: 'PGDM Admissions Platform',
    description:
      'Backend for a national-level PGDM onboarding system handling high-concurrency admission flows, merit list generation, and secure fee payment integration across multiple institutions.',
    tags: ['Node.js', 'PostgreSQL', 'Django', 'Python'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'green',
  },
  {
    name: 'Doctorscan — Telehealth & Scheduling Platform',
    description:
      'Engineered the real-time backend for a global telehealth application, featuring live video consultation workflows, SMS/push notifications, and a scheduling system for patient appointment booking across time zones.',
    tags: ['Node.js', 'PostgreSQL', 'Real-Time Systems', 'WebRTC', 'REST API'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'blue',
  },
  {
    name: 'AI-Assisted Prescription Drafting Prototype',
    description:
      'Built a prototype enabling doctors to dictate consultations, transcribed via Whisper and converted into structured prescriptions using Llama 2, with Pydantic enforcing schema validation on model output.',
    tags: ['Python', 'Whisper', 'Llama 2', 'Pydantic', 'AI/ML'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'purple',
  },
]
