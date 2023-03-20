import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { CdkEcsStack } from '../lib';

test('test datadog fargate integration construct', () => {

  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'flaskapp');
  const taskDefinition = new ecs.TaskDefinition(stack, 'taskcont', {
    compatibility: ecs.Compatibility.FARGATE,
    memoryMiB: '2048',
    cpu: '2048',
  });

  // WHEN
  new CdkEcsStack(stack, 'Service', taskDefinition, {
    datadogApiKey: 'YOUR_API_KEY',
  });

  // THEN - stack contains a taskDefinition with Datadog definition
  expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', 
  {
    "ContainerDefinitions": [
      {
        "Environment": [
          {
            "Name": "ECS_FARGATE",
            "Value": "true"
          },
          {
            "Name": "DD_API_KEY",
            "Value": {
              "Ref": "ServiceDatadogApiKeyParameter"
            }
          }
        ],
        "Essential": true,
        "Image": "public.ecr.aws/datadog/agent:latest",
        "Memory": 512,
        "Name": "datadog-agent",
        "PortMappings": [
          {
            "ContainerPort": 8125,
            "Protocol": "udp"
          }
        ]
      }
    ],
    "Cpu": "2048",
    "Family": "taskcont",
    "Memory": "2048",
    "NetworkMode": "awsvpc",
    "RequiresCompatibilities": [
      "FARGATE"
    ],
    "TaskRoleArn": {
      "Fn::GetAtt": [
        "task-def",
        "Arn"
      ]
    }
  }
  ));
});