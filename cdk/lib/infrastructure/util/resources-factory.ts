import { Construct } from "constructs";
import { EnvProps } from "../../cdk.config";
import { LambdaFunctionFactory } from "./lambda.service-factory";
import { S3Factory } from "./s3.service-factory";
import { SNSFactory } from "./sns.service-factory";
import { SQSFactory } from "./sqs.service-factory";

export class ResourcesFactory {
  readonly lambda: LambdaFunctionFactory;
  readonly s3: S3Factory;
  readonly sqs: SQSFactory;
  readonly sns: SNSFactory;

  constructor(
    readonly scope: Construct,
    readonly envProps: EnvProps,
  ) {
    this.lambda = new LambdaFunctionFactory(scope, envProps);
    this.s3 = new S3Factory(scope, envProps);
    this.sqs = new SQSFactory(scope, envProps);
    this.sns = new SNSFactory(scope, envProps);
  }
}
