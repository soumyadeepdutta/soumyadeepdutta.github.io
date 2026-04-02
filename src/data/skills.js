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
      skill('REST', 'rest'),
      skill('WebSockets', 'websockets'),
    ],
  },
  {
    category: 'AWS',
    color: 'accent',
    items: [
      skill('EC2', 'aws-ec2'),
      skill('Lambda', 'aws-lambda'),
      skill('ECS / Fargate', 'aws-ecs'),
      skill('S3', 'aws-s3'),
      skill('RDS', 'aws-rds'),
      skill('DynamoDB', 'aws-dynamodb'),
      skill('API Gateway', 'aws-apigateway'),
      skill('CloudFront', 'aws-cloudfront'),
      skill('Firehose', 'aws-firehose'),
      skill('Glue', 'aws-glue'),
      skill('Athena', 'aws-athena'),
      skill('CloudFormation', 'aws-cloudformation'),
    ],
  },
  {
    category: 'Databases',
    color: 'green',
    items: [
      skill('PostgreSQL', 'postgresql'),
      skill('MongoDB', 'mongodb'),
      skill('Redis', 'redis'),
      skill('DynamoDB', 'aws-dynamodb'),
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
      skill('LangChain', 'langchain'),
      skill('OpenAI API', 'openai'),
      skill('RAG Pipelines', 'rag'),
      skill('Prompt Engineering', 'prompt'),
    ],
  },
]
