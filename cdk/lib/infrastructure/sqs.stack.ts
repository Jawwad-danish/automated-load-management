import * as cdk from "aws-cdk-lib";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { EnvProps } from "../cdk.config";

export interface SQSStackProps extends cdk.StackProps {
  envProps: EnvProps;
}

export class SQSStack extends cdk.Stack {
  readonly sampleQueue: sqs.Queue;
  readonly sampleDeadLetterQueue: sqs.Queue;

  constructor(
    scope: Construct,
    id: string,
    private props: SQSStackProps,
  ) {
    super(scope, id, props);

    this.sampleDeadLetterQueue = this.buildDeadLetterQueue("sample");
    this.sampleQueue = this.buildQueue("sample", this.sampleDeadLetterQueue);
  }

  private buildDeadLetterQueue(queueName: string): sqs.Queue {
    return new sqs.Queue(
      this,
      `${this.props.envProps.shortName}-${queueName}DeadLetterQueue`,
      {
        queueName: `${this.props.envProps.shortName}-${queueName}-dlq.fifo`,
        contentBasedDeduplication: true,
        retentionPeriod: cdk.Duration.days(4),
        fifo: true,
      },
    );
  }

  private buildQueue(queueName: string, deadLetterQueue: sqs.Queue): sqs.Queue {
    return new sqs.Queue(
      this,
      `${this.props.envProps.shortName}-${queueName}Queue`,
      {
        queueName: `${this.props.envProps.shortName}-${queueName}-queue.fifo`,
        fifo: true,
        contentBasedDeduplication: true,
        visibilityTimeout: cdk.Duration.minutes(5),
        retentionPeriod: cdk.Duration.days(4),
        deliveryDelay: cdk.Duration.millis(0),
        deadLetterQueue: {
          maxReceiveCount: 1,
          queue: deadLetterQueue,
        },
      },
    );
  }
}
