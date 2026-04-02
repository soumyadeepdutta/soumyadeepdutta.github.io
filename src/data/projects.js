/**
 * Project data.
 * Add a new object to this array to render a new project card automatically.
 */
export const projects = [
  {
    name: 'CloudDeploy CLI',
    description:
      'A Node.js CLI tool that scaffolds production-ready AWS CloudFormation stacks for common patterns (VPC, ECS Fargate service, RDS, S3 static site). Reduces infra setup from hours to minutes.',
    tags: ['Node.js', 'AWS CDK', 'CloudFormation', 'CLI'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'accent',
  },
  {
    name: 'AI Resume Screener',
    description:
      'Python FastAPI service backed by AWS Bedrock (Claude) that parses resumes and job descriptions, scores candidate fit, and returns structured JSON. Deployed as an AWS Lambda function behind API Gateway.',
    tags: ['Python', 'FastAPI', 'AWS Bedrock', 'Lambda', 'AI'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'blue',
  },
  {
    name: 'Distributed Task Queue',
    description:
      'A horizontally-scalable background job system using Bull (Redis) and Node.js workers. Supports retries, dead-letter queues, and a real-time job-status dashboard built with Socket.IO.',
    tags: ['Node.js', 'Redis', 'Bull', 'Socket.IO', 'Docker'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'green',
  },
  {
    name: 'Serverless URL Shortener',
    description:
      'A fully serverless URL-shortening service built with AWS Lambda, API Gateway, DynamoDB, and CloudFront. Handles 10K+ requests/second at near-zero cost thanks to a pay-per-use architecture.',
    tags: ['Python', 'AWS Lambda', 'DynamoDB', 'API Gateway', 'CloudFront'],
    github: 'https://github.com/soumyadeepdutta',
    live: null,
    color: 'purple',
  },
]
