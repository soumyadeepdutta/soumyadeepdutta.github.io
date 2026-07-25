/**
 * Work experience data.
 * Add a new object to this array to render a new experience card automatically.
 */
export const experiences = [
  {
    title: 'Software Engineer',
    company: 'KFin Technologies Limited',
    location: 'Hyderabad, India',
    start: 'Jul 2024',
    end: 'Present',
    tags: ['NestJS', 'MongoDB', 'AWS CDK', 'Jenkins', 'Docker', 'Kinesis Firehose', 'Prometheus', 'Grafana', 'JWE/JWS'],
    bullets: [
      'Led backend development for the Group SIP corporate investment portal (NestJS, MongoDB), coordinating delivery across a team of 5 engineers with DevOps, QA, and business stakeholders.',
      'Designed and maintained production-grade CI/CD pipelines (Jenkins, Docker, AWS) with ECR layer caching, reducing average build time by 60%; provisioned infrastructure via AWS CDK (ECS, Lambda, SQS, Firehose, Glue, API Gateway, NLB, ASG).',
      'Deployed and managed AWS infrastructure for LAMF (Loan Against Mutual Fund) — a top-10 KFin product processing 700,000+ requests/day, used by leading AMCs across India.',
      'Architected a high-throughput log ingestion pipeline (Kinesis Firehose → AWS Glue → S3 Parquet → Athena) processing 10,000,000+ log events/day; reduced analytical query latency from 15s to under 3s; full observability via Prometheus, Tempo, and Grafana.',
      'Built an event-driven notification service (SQS + Lambda) for asynchronous PDF generation and email delivery, with CloudWatch monitoring and DLQ-based failure handling.',
      'Integrated CERSAI KYC API for regulatory compliance in the Kfin NPS product, serving 30,000+ requests/day.',
      'Implemented JWE/JWS token-based security for encrypted payload handling across financial APIs.',
      'Accelerated engineering productivity via Postman automated test suites, AI editors (Kiro, Cursor), and MCP tooling (Postman MCP, Serena, Context7).',
    ],
  },
  {
    title: 'Senior Software Developer',
    company: 'Airdit Software Services',
    location: 'Bengaluru, India',
    start: 'Oct 2023',
    end: 'May 2024',
    tags: ['Node.js', 'PostgreSQL', 'Azure AI', 'SAP BTP', 'Jest'],
    bullets: [
      'Developed a scalable SaaS backend (AISP) using Node.js and PostgreSQL; integrated Azure AI APIs for image and speech processing; implemented Jest unit tests for quality assurance.',
      'Built an enterprise web application on SAP BTP using Node.js, integrating with SAP platform services.',
    ],
  },
  {
    title: 'Software Development Engineer',
    company: 'Techno Exponent',
    location: 'Kolkata, India',
    start: 'Sept 2022',
    end: 'Sept 2023',
    tags: ['Node.js', 'PostgreSQL', 'REST API', 'Stripe', 'AWS S3', 'Telnyx', 'Swagger'],
    bullets: [
      'Engineered backend for a high-traffic healthcare platform (Node.js, PostgreSQL); designed Swagger-documented RESTful APIs serving web and mobile clients.',
      'Integrated Stripe, AWS S3, and Telnyx for payment, file storage, and telephony workflows.',
    ],
  },
  {
    title: 'Software Development Engineer',
    company: '99ideas SaaS Pvt. Ltd.',
    location: 'Pune, India (Remote)',
    start: 'Jan 2021',
    end: 'Aug 2022',
    tags: ['Node.js', 'Python', 'Django', 'PostgreSQL', 'Pandas'],
    bullets: [
      'Built scalable Node.js APIs for a national-level academic admission platform and CMS, handling concurrent multi-institution onboarding flows.',
      'Developed data analytics dashboards using Python (Pandas) and Django for admission metrics reporting.',
    ],
  },
]
