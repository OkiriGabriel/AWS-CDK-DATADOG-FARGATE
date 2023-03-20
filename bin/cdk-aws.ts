import * as ecs from '@aws-cdk/aws-ecs';

import * as cdk from '@aws-cdk/core';
import { DatadogFargateIntegration } from 'aws-cdk-datadog-ecs-integration';

const stack = new cdk.Stack();
const taskDefinition = new ecs.TaskDefinition(stack, 'taskcont', {
  compatibility: ecs.Compatibility.FARGATE,
  memoryMiB: '2048',
  cpu: '2048',
});

// Include Datadog with the specific API key
new DatadogFargateIntegration(stack, 'MyStack', taskDefinition, {
  datadogApiKey: 'YOUR_API_KEY',
  environment: { account: 'ID',region: 'us-east-1' },
});





