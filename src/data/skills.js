/**
 * Skills data.
 * Each category renders as a row of badge chips.
 */
const skill = (label, icon = null) => ({ label, icon })

export const skills = [
  {
    category: 'Backend & Languages',
    color: 'accent',
    items: [
      skill('Node.js', 'nodejs'),
      skill('ExpressJS', 'express'),
      skill('NestJS', 'nestjs'),
      skill('JavaScript', 'javascript'),
      skill('TypeScript', 'typescript'),
      skill('Python', 'python'),
    ],
  },
  {
    category: 'AWS Cloud Infrastructure',
    color: 'accent',
    items: [
      skill('ECS', 'aws-ecs'),
      skill('EC2', 'aws-ec2'),
      skill('Lambda', 'aws-lambda'),
      skill('SQS', 'aws-sqs'),
      skill('S3', 'aws-s3'),
      skill('Kinesis Firehose', 'aws-firehose'),
      skill('AWS Glue', 'aws-glue'),
      skill('Amazon Athena', 'aws-athena'),
      skill('API Gateway', 'aws-apigateway'),
      skill('NLB', 'aws-nlb'),
      skill('AWS CDK', 'aws-cdk'),
      skill('ASG', 'aws-asg'),
    ],
  },
  {
    category: 'Databases',
    color: 'green',
    items: [
      skill('PostgreSQL', 'postgresql'),
      skill('MySQL', 'mysql'),
      skill('MongoDB', 'mongodb'),
    ],
  },
  {
    category: 'DevOps & Observability',
    color: 'purple',
    items: [
      skill('Jenkins', 'jenkins'),
      skill('Docker', 'docker'),
      skill('AWS ECR', 'aws-ecr'),
      skill('CI/CD Pipelines', 'cicd'),
      skill('Prometheus', 'prometheus'),
      skill('Grafana', 'grafana'),
      skill('Tempo (Tracing)', 'tempo'),
    ],
  },
  {
    category: 'Architecture & Security',
    color: 'blue',
    items: [
      skill('Event-Driven Systems', 'event-driven'),
      skill('Serverless', 'serverless'),
      skill('REST API Design', 'rest'),
      skill('Distributed Systems', 'distributed-systems'),
      skill('JWE/JWS Security', 'jwe-jws'),
      skill('SSO / OAuth', 'sso-oauth'),
      skill('Jest', 'jest'),
      skill('Postman', 'postman'),
    ],
  },
  {
    category: 'Tooling & Ecosystem',
    color: 'purple',
    items: [
      skill('Git', 'git'),
      skill('Swagger', 'swagger'),
      skill('AI Editors (Kiro, Cursor)', 'ai-editors'),
      skill('MCP Tooling', 'mcp'),
      skill('n8n', 'n8n'),
      skill('Azure AI APIs', 'azure-ai'),
      skill('SAP BTP', 'sap-btp'),
    ],
  },
]
