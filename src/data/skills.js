/**
 * Skills data.
 * Each category renders as a row of badge chips.
 */
const skill = (label, icon = null) => ({ label, icon })

export const skills = [
  {
    category: 'Languages',
    color: 'accent',
    items: [
      skill('Node.js', 'nodejs'),
      skill('Python', 'python'),
      skill('TypeScript', 'typescript'),
      skill('JavaScript', 'javascript'),
      skill('Bash', 'bash'),
    ],
  },
  {
    category: 'Backend & APIs',
    color: 'blue',
    items: [
      skill('Express.js', 'express'),
      skill('FastAPI', 'fastapi'),
      skill('Django', 'django'),
      skill('GraphQL', 'graphql'),
      skill('REST'),
      skill('WebSockets'),
    ],
  },
  {
    category: 'AWS',
    color: 'accent',
    items: [
      skill('EC2'),
      skill('Lambda'),
      skill('ECS / Fargate'),
      skill('S3'),
      skill('RDS'),
      skill('DynamoDB'),
      skill('API Gateway'),
      skill('CloudFront'),
      skill('SQS / SNS'),
      skill('IAM'),
      skill('CloudFormation'),
      skill('Bedrock'),
    ],
  },
  {
    category: 'Databases',
    color: 'green',
    items: [
      skill('PostgreSQL', 'postgresql'),
      skill('MongoDB', 'mongodb'),
      skill('Redis', 'redis'),
      skill('DynamoDB'),
      skill('MySQL', 'mysql'),
    ],
  },
  {
    category: 'DevOps & Tooling',
    color: 'purple',
    items: [
      skill('Docker', 'docker'),
      skill('GitHub Actions', 'githubactions'),
      skill('Terraform', 'terraform'),
      skill('Nginx', 'nginx'),
      skill('Linux', 'linux'),
      skill('Git', 'git'),
    ],
  },
  {
    category: 'AI / ML',
    color: 'blue',
    items: [
      skill('AWS Bedrock'),
      skill('LangChain'),
      skill('OpenAI API', 'openai'),
      skill('RAG Pipelines'),
      skill('Prompt Engineering'),
    ],
  },
]
