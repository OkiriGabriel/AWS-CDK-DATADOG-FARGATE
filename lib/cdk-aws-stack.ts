 
import * as ecs from '@aws-cdk/aws-ecs';
import * as ssm from '@aws-cdk/aws-ssm';

import * as cdk from '@aws-cdk/core';
import { DataDogIntegrationProps } from './datadog-integration-props';

/** Include Datadog agent in the specified task definition. */
export class CdkEcsStack extends cdk.Stack {
  constructor(
    parent: cdk.Stack, name: string,
    taskDefinition: ecs.TaskDefinition,
    props: DataDogIntegrationProps) {
    super(parent, name);

    if (!taskDefinition.isFargateCompatible) {
      throw new Error('Only Fargate supported');
    }

    // Datadog parameters
    const environment = {
      ECS_FARGATE: 'true',
      DD_API_KEY: ssm.StringParameter.fromStringParameterName(parent, `${name}DatadogApiKey`, props.datadogApiKey).stringValue,
      ...props.environment,
    };

    const datadog = taskDefinition.addContainer('datadog-agent', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/datadog/agent:latest'),
      memoryLimitMiB: 512,
      logging: props.logging,
      environment,
      essential: true,
    });

    const container = taskDefinition.addContainer('flaskapp', {
      image: ecs.ContainerImage.fromRegistry('nginx'),
      memoryLimitMiB: 256,
      essential: true,
    });

    container.addPortMappings({
      containerPort: 80,
      protocol: ecs.Protocol.TCP,
    });
    // datadog.addPortMappings({
    //   containerPort: 8126,
    //   protocol: ecs.Protocol.TCP,
    // });

    datadog.addPortMappings({
      containerPort: 8125,
      protocol: ecs.Protocol.UDP,
    });
  }
}