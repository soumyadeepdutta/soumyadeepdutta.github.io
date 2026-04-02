import {
  ArchitectureGroupAWSCloudlogo,
  ArchitectureServiceAmazonAPIGateway,
  ArchitectureServiceAmazonAthena,
  ArchitectureServiceAmazonCloudFront,
  ArchitectureServiceAmazonDataFirehose,
  ArchitectureServiceAmazonDynamoDB,
  ArchitectureServiceAmazonEC2,
  ArchitectureServiceAmazonElasticContainerService,
  ArchitectureServiceAmazonRDS,
  ArchitectureServiceAmazonSimpleStorageService,
  ArchitectureServiceAWSCloudFormation,
  ArchitectureServiceAWSGlue,
  ArchitectureServiceAWSLambda,
} from 'aws-react-icons'
import { BsBroadcast } from 'react-icons/bs'
import { BiMessageSquareEdit, BiNetworkChart } from 'react-icons/bi'
import { FaAws } from 'react-icons/fa'
import { FiLink2, FiTerminal } from 'react-icons/fi'
import {
  SiDjango,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiGit,
  SiGithubactions,
  SiGraphql,
  SiJavascript,
  SiJest,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNginx,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiRedis,
  SiSocketdotio,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si'
import { TbApi } from 'react-icons/tb'

const ICON_MAP = {
  aws: FaAws,
  'aws-apigateway': ArchitectureServiceAmazonAPIGateway,
  'aws-athena': ArchitectureServiceAmazonAthena,
  'aws-cloudformation': ArchitectureServiceAWSCloudFormation,
  'aws-cloudfront': ArchitectureServiceAmazonCloudFront,
  'aws-dynamodb': ArchitectureServiceAmazonDynamoDB,
  'aws-ec2': ArchitectureServiceAmazonEC2,
  'aws-ecs': ArchitectureServiceAmazonElasticContainerService,
  'aws-firehose': ArchitectureServiceAmazonDataFirehose,
  'aws-glue': ArchitectureServiceAWSGlue,
  'aws-lambda': ArchitectureServiceAWSLambda,
  'aws-rds': ArchitectureServiceAmazonRDS,
  'aws-s3': ArchitectureServiceAmazonSimpleStorageService,
  bash: FiTerminal,
  django: SiDjango,
  docker: SiDocker,
  express: SiExpress,
  fastapi: SiFastapi,
  git: SiGit,
  githubactions: SiGithubactions,
  graphql: SiGraphql,
  javascript: SiJavascript,
  jest: SiJest,
  langchain: FiLink2,
  linux: SiLinux,
  mongodb: SiMongodb,
  mysql: SiMysql,
  nginx: SiNginx,
  nodejs: SiNodedotjs,
  openai: SiOpenai,
  postgresql: SiPostgresql,
  prompt: BiMessageSquareEdit,
  python: SiPython,
  rag: BiNetworkChart,
  redis: SiRedis,
  rest: TbApi,
  socketio: SiSocketdotio,
  terraform: SiTerraform,
  typescript: SiTypescript,
  websockets: BsBroadcast,
}

const LABEL_ICON_MAP = {
  ai: 'openai',
  'api gateway': 'aws-apigateway',
  athena: 'aws-athena',
  aws: 'aws',
  'aws bedrock': 'aws',
  'aws cdk': 'aws-cloudformation',
  'aws lambda': 'aws-lambda',
  bash: 'bash',
  'cloud formation': 'aws-cloudformation',
  cloudformation: 'aws-cloudformation',
  cloudfront: 'aws-cloudfront',
  cli: 'bash',
  django: 'django',
  docker: 'docker',
  dynamodb: 'aws-dynamodb',
  ec2: 'aws-ec2',
  'ecs / fargate': 'aws-ecs',
  ecs: 'aws-ecs',
  express: 'express',
  'express.js': 'express',
  fargate: 'aws-ecs',
  fastapi: 'fastapi',
  firehose: 'aws-firehose',
  git: 'git',
  'github actions': 'githubactions',
  glue: 'aws-glue',
  graphql: 'graphql',
  javascript: 'javascript',
  jest: 'jest',
  lambda: 'aws-lambda',
  langchain: 'langchain',
  linux: 'linux',
  mongodb: 'mongodb',
  mysql: 'mysql',
  'node.js': 'nodejs',
  nginx: 'nginx',
  'openai api': 'openai',
  postgresql: 'postgresql',
  'prompt engineering': 'prompt',
  python: 'python',
  'rag pipelines': 'rag',
  rds: 'aws-rds',
  redis: 'redis',
  rest: 'rest',
  s3: 'aws-s3',
  'socket.io': 'socketio',
  terraform: 'terraform',
  typescript: 'typescript',
  websockets: 'websockets',
}

export function getTechIcon(iconKey) {
  return iconKey ? ICON_MAP[iconKey] ?? null : null
}

export function resolveTechIconKey(item) {
  if (item && typeof item === 'object' && item.icon) {
    return item.icon
  }

  const label = typeof item === 'string' ? item : item?.label
  if (!label) {
    return null
  }

  return LABEL_ICON_MAP[label.trim().toLowerCase()] ?? null
}

export function getTechLabel(item) {
  return typeof item === 'string' ? item : item?.label ?? ''
}