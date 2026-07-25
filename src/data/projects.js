/**
 * Project data.
 * Add a new object to this array to render a new project card automatically.
 */
export const projects = [
  {
    name: 'Group SIP — Corporate Investment Portal',
    description:
      'Led end-to-end backend development of a corporate SIP portal enabling salary-linked investments across multiple AMC funds. Implemented JWE/JWS financial-grade security and deployed on AWS ECS with Jenkins CI/CD.',
    tags: ['NestJS', 'MongoDB', 'AWS ECS', 'Jenkins', 'JWE/JWS'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'accent',
  },
  {
    name: 'LAMF Log Ingestion Pipeline',
    description:
      'Migrated on-prem MongoDB logs to a cloud-native pipeline processing 10,000,000+ events/day via Kinesis Firehose → AWS Glue → S3 (Parquet) → Athena. Reduced query time from 15s to under 3s with full Prometheus, Tempo, and Grafana observability.',
    tags: ['Kinesis Firehose', 'AWS Glue', 'S3', 'Athena', 'Prometheus', 'Grafana'],
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
]
