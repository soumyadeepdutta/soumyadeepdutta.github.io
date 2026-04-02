/**
 * Work experience data.
 * Add a new object to this array to render a new experience card automatically.
 */
export const experiences = [
  {
    title: 'Senior Backend Developer',
    company: 'Your Company Name',
    location: 'Kolkata, India (Remote)',
    start: 'Jan 2023',
    end: 'Present',
    tags: ['Node.js', 'Python', 'AWS', 'PostgreSQL'],
    bullets: [
      'Architected and maintained RESTful microservices handling 2M+ daily requests using Node.js and Express.',
      'Designed multi-tenant SaaS infrastructure on AWS (ECS, RDS, ElastiCache, CloudFront).',
      'Reduced API p99 latency from 850ms to 120ms by introducing Redis caching and query optimization.',
      'Led a team of 4 engineers, conducted code reviews, and defined backend coding standards.',
      'Implemented CI/CD pipelines via GitHub Actions with automated testing and zero-downtime deployments.',
    ],
  },
  {
    title: 'Backend Developer',
    company: 'Previous Company',
    location: 'Kolkata, India',
    start: 'Jul 2021',
    end: 'Dec 2022',
    tags: ['Python', 'Django', 'AWS Lambda', 'DynamoDB'],
    bullets: [
      'Built serverless data-processing pipelines on AWS Lambda + SQS + DynamoDB for real-time analytics.',
      'Developed Python-based ETL scripts ingesting 500K+ records daily from third-party APIs.',
      'Integrated OAuth 2.0 / JWT authentication and role-based access control across multiple services.',
      'Improved deployment frequency by 3× by migrating legacy monolith modules to containerised services.',
    ],
  },
  {
    title: 'Junior Software Engineer',
    company: 'Startup / First Role',
    location: 'Kolkata, India',
    start: 'Jun 2020',
    end: 'Jun 2021',
    tags: ['Node.js', 'MongoDB', 'Docker'],
    bullets: [
      'Developed RESTful APIs with Node.js/Express and MongoDB for a B2C e-commerce platform.',
      'Containerised the application stack with Docker, cutting onboarding time from days to hours.',
      'Wrote unit and integration tests (Jest) raising code coverage from 42% to 78%.',
    ],
  },
]
