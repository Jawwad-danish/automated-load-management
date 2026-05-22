import { ArnPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { ResourceWrapper, ServiceFactory } from "./service-factory";
export interface S3BucketOptions {
  publicReadAccess: boolean;
}

export class S3Wrapper extends ResourceWrapper<s3.Bucket> {
  allowLambdaToReadWrite(lambda: lambda.Function) {
    this.resource.grantReadWrite(lambda);
    return this;
  }

  allowCrossAccountAccess(principalArn: string) {
    this.resource.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject", "s3:DeleteObject", "s3:PutObject"],
        resources: [`${this.resource.bucketArn}/*`],
        principals: [new ArnPrincipal(principalArn)],
      }),
    );
    return this;
  }

  enableCORS() {
    this.resource.addCorsRule({
      allowedHeaders: ["*"],
      allowedMethods: [
        s3.HttpMethods.GET,
        s3.HttpMethods.PUT,
        s3.HttpMethods.POST,
      ],
      allowedOrigins: ["*"],
      exposedHeaders: ["ETag"],
      maxAge: 3000,
    });
    return this;
  }
}

export class S3Factory extends ServiceFactory<S3Wrapper, S3BucketOptions> {
  build(
    idSuffix: string,
    options: S3BucketOptions = {
      publicReadAccess: false,
    },
  ): S3Wrapper {
    const { publicReadAccess } = options;
    const identifier = `${this.envProps.shortName}-${idSuffix}`;
    const bucket = new s3.Bucket(this.scope, `${identifier}-bucket`, {
      bucketName: identifier,
    });
    if (publicReadAccess) {
      bucket.grantPublicAccess();
    }
    return new S3Wrapper(bucket);
  }
}
