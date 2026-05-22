import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { ResourceWrapper, ServiceFactory } from "./service-factory";

export interface SQSOptions {
  dlq?: boolean;
  fifo?: boolean;
}

export class SQSWrapper extends ResourceWrapper<sqs.Queue> {
  subscribeToTopic(topic: sns.Topic) {
    topic.addSubscription(new subs.SqsSubscription(this.resource));
    return this;
  }

  addEventSourceToLambdaFunction(lambdaFunction: lambda.Function) {
    const eventSource = new lambdaEventSources.SqsEventSource(this.resource);
    lambdaFunction.addEventSource(eventSource);
    return this;
  }

  allowLambdaToWrite(lambdaFunction: lambda.Function) {
    this.resource.grantSendMessages(lambdaFunction);
  }
}

export class SQSFactory extends ServiceFactory<SQSWrapper, SQSOptions> {
  private buildName(name: string, options: SQSOptions) {
    const { fifo } = options;
    const ending = fifo ? `${name}.fifo` : name;
    return `${this.envProps.shortName}-${ending}`;
  }

  private buildDeadLetterQueue(name: string, options: SQSOptions): sqs.Queue {
    return new sqs.Queue(this.scope, this.buildName(`${name}-dlq`, options), {
      queueName: this.buildName(`${name}-dlq`, options),
      retentionPeriod: cdk.Duration.days(4),
    });
  }

  private maybeBuildDeadLetterQueue(
    name: string,
    options: SQSOptions,
  ): undefined | sqs.DeadLetterQueue {
    if (!options.dlq) {
      return;
    }
    return {
      queue: this.buildDeadLetterQueue(name, options),
      maxReceiveCount: 1,
    };
  }

  build(idSuffix: string, options: SQSOptions = {}): SQSWrapper {
    const queue = new sqs.Queue(
      this.scope,
      this.buildName(`${idSuffix}-queue`, options),
      {
        queueName: this.buildName(idSuffix, options),
        visibilityTimeout: cdk.Duration.minutes(5),
        retentionPeriod: cdk.Duration.days(4),
        deliveryDelay: cdk.Duration.millis(0),
        deadLetterQueue: this.maybeBuildDeadLetterQueue(idSuffix, options),
      },
    );
    return new SQSWrapper(queue);
  }
}
