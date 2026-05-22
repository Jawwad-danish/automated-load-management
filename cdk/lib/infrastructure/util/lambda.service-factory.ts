import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction, SourceMapMode } from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sm from "aws-cdk-lib/aws-secretsmanager";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as path from "path";
import { ResourceWrapper, ServiceFactory } from "./service-factory";

class LambdaPaths {
  static getProjectRoot() {
    return path.resolve(__dirname, "../../../../api");
  }

  static getLambdaRoot() {
    return path.resolve(LambdaPaths.getProjectRoot(), "src/lambda");
  }

  static getDepsLockFile() {
    return path.resolve(LambdaPaths.getProjectRoot(), "package-lock.json");
  }

  static handler(name: string) {
    return path.resolve(LambdaPaths.getLambdaRoot(), `${name}/handler.ts`);
  }
}

export interface LambdaFunctionOptions {
  environment?: { [key: string]: string };
  vpc?: ec2.IVpc;
  securityGroup?: ec2.SecurityGroup;
  description?: string;
  timeoutSeconds?: number;
  memory?: number;
}

export class LambdaFunctionWrapper extends ResourceWrapper<lambda.Function> {
  public addQueueEventSource(queue: sqs.Queue) {
    const bucketEventSource = new lambdaEventSources.SqsEventSource(queue);
    this.resource.addEventSource(bucketEventSource);
    return this;
  }

  public allowSecretRead(secret: sm.ISecret) {
    this.resource.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [secret.secretArn],
        actions: [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret",
        ],
      }),
    );
    return this;
  }

  public allowBucketReadWrite(bucket: s3.Bucket) {
    bucket.grantReadWrite(this.resource);
    return this;
  }
}

export class LambdaFunctionFactory extends ServiceFactory<
  LambdaFunctionWrapper,
  LambdaFunctionOptions
> {
  build(
    idSuffix: string,
    options: LambdaFunctionOptions,
  ): LambdaFunctionWrapper {
    const identifier = `${this.envProps.shortName}-${idSuffix}`;
    const securityGroups = options.securityGroup ? [options.securityGroup] : [];
    const description = options.description
      ? `${options.description}. Env: ${this.envProps.name}`
      : undefined;
    const lambdaFunction = new NodejsFunction(this.scope, identifier, {
      bundling: {
        minify: true,
        sourceMap: true,
        sourceMapMode: SourceMapMode.INLINE,
        target: "es2020",
        externalModules: ["@aws-sdk/*"],
      },
      description,
      memorySize: options?.memory || 128,
      timeout: cdk.Duration.seconds(options?.timeoutSeconds || 5),
      entry: LambdaPaths.handler(idSuffix),
      functionName: identifier,
      handler: "handler",
      projectRoot: LambdaPaths.getProjectRoot(),
      depsLockFilePath: LambdaPaths.getDepsLockFile(),
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: options?.environment,
      vpc: options?.vpc,
      securityGroups: securityGroups,
    });
    return new LambdaFunctionWrapper(lambdaFunction);
  }
}
