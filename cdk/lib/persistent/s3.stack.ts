import * as cdk from "aws-cdk-lib";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { EnvProps } from "../cdk.config";
import { Construct } from "constructs";

export interface S3StackProps extends cdk.StackProps {
  envProps: EnvProps;
}

export class S3Stack extends cdk.Stack {
  readonly loggingBucket: IBucket;

  constructor(
    scope: Construct,
    id: string,
    private props: S3StackProps,
  ) {
    super(scope, id, props);

    this.loggingBucket = this.createBucket("bobtail-infra-logs");
  }

  private createBucket(name: string, publicBucket = false): Bucket {
    return new Bucket(this, `${this.props.envProps.shortName}-${name}`, {
      publicReadAccess: publicBucket,
      bucketName: `${this.props.envProps.shortName}-${name}`,
    });
  }
}
