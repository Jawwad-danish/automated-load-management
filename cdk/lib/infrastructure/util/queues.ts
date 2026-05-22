import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { EnvProps } from "../../cdk.config";

export interface QueueOptions {
  envProps: EnvProps;
  name: string;
  scope: Construct;
  dlq?: boolean;
  fifo?: boolean;
}

export class Queues {
  private static buildName(options: QueueOptions, suffix: string) {
    const { envProps, name, fifo } = options;
    const ending = fifo ? `${suffix}.fifo` : suffix;
    return `${envProps.shortName}-${name}-${ending}`;
  }

  private static buildDeadLetterQueue(options: QueueOptions): sqs.Queue {
    return new sqs.Queue(
      options.scope,
      Queues.buildName(options, "DeadLetterQueue"),
      {
        queueName: Queues.buildName(options, "dql"),
        retentionPeriod: cdk.Duration.days(4),
      },
    );
  }

  private static maybeBuildDeadLetterQueue(
    options: QueueOptions,
  ): undefined | sqs.DeadLetterQueue {
    if (!options.dlq) {
      return;
    }
    return {
      queue: Queues.buildDeadLetterQueue(options),
      maxReceiveCount: 1,
    };
  }

  static build(options: QueueOptions) {
    const queue = new sqs.Queue(
      options.scope,
      Queues.buildName(options, "Queue"),
      {
        queueName: Queues.buildName(options, "queue"),
        visibilityTimeout: cdk.Duration.minutes(5),
        retentionPeriod: cdk.Duration.days(4),
        deliveryDelay: cdk.Duration.millis(0),
        deadLetterQueue: Queues.maybeBuildDeadLetterQueue(options),
      },
    );
    return new QueueConfigurer(queue);
  }
}

export class QueueConfigurer {
  constructor(readonly queue: sqs.Queue) {}

  subscribeToTopic(topic: sns.Topic) {
    topic.addSubscription(new subs.SqsSubscription(this.queue));
    return this;
  }

  addEventSourceToLambdaFunction(lambdaFunction: lambda.Function) {
    const eventSource = new lambdaEventSources.SqsEventSource(this.queue);
    lambdaFunction.addEventSource(eventSource);
    return this;
  }
}
