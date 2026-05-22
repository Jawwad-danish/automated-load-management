import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as s3 from "aws-cdk-lib/aws-s3";
import { ReceiptRuleSet } from "aws-cdk-lib/aws-ses";
import { S3 } from "aws-cdk-lib/aws-ses-actions";
import { Construct } from "constructs";
import { EnvProps } from "../cdk.config";
import { ResourcesFactory } from "./util";

export interface EmailReceiveStackProps extends cdk.StackProps {
  lambdaVpc: ec2.IVpc;
  lambdaSecurityGroup: ec2.SecurityGroup;
  envProps: EnvProps;
  filestackPrincipalArn: string;
}

export class EmailReceiveStack extends cdk.Stack {
  public readonly emailParsedNotificationQueueUrl: string;
  public readonly emailReceiveBucket: s3.IBucket;

  constructor(
    scope: Construct,
    id: string,
    private props: EmailReceiveStackProps,
  ) {
    super(scope, id, props);

    const resourcesFactory = new ResourcesFactory(this, props.envProps);
    const emailReceiveBucket = resourcesFactory.s3
      .build("loads-emails")
      .enableCORS()
      .allowCrossAccountAccess(props.filestackPrincipalArn);

    const emailReceiveBucketNotificationTopic =
      resourcesFactory.sns.build("loads-emails");
    const emailReceiveNotificationQueue =
      resourcesFactory.sqs.build("loads-emails");
    const emailParsedNotificationQueue =
      resourcesFactory.sqs.build("parsed-emails");
    this.emailParsedNotificationQueueUrl =
      emailParsedNotificationQueue.resource.queueUrl;
    this.emailReceiveBucket = emailReceiveBucket.resource;

    const loadEmailEventHandler = resourcesFactory.lambda
      .build("loads-email-event-handler", {
        vpc: this.props.lambdaVpc,
        timeoutSeconds: 30,
        memory: 256,
        securityGroup: this.props.lambdaSecurityGroup,
        description:
          "Handler for events when emails are received with loads files",
        environment: {
          EMAIL_PARSED_QUEUE_URL: this.emailParsedNotificationQueueUrl,
        },
      })
      .allowBucketReadWrite(emailReceiveBucket.resource);

    emailReceiveNotificationQueue
      .subscribeToTopic(emailReceiveBucketNotificationTopic.resource)
      .addEventSourceToLambdaFunction(loadEmailEventHandler.resource);

    emailParsedNotificationQueue.allowLambdaToWrite(
      loadEmailEventHandler.resource,
    );

    // There is not way to activate a rule set from CDK or CloudFormation
    // This needs to be manually done via de CLI or from the Web UI
    // For more information see https://github.com/aws/aws-cdk/issues/10321
    new ReceiptRuleSet(this, `${this.props.envProps.shortName}-loads-bobtail`, {
      receiptRuleSetName: `${this.props.envProps.shortName}-loads-bobtail`,
      rules: [
        {
          receiptRuleName: `${this.props.envProps.shortName}-loads-write-to-S3`,
          recipients: [this.props.envProps.emailRecipient],
          enabled: true,
          actions: [
            new S3({
              bucket: emailReceiveBucket.resource,
              objectKeyPrefix: "raw/",
              topic: emailReceiveBucketNotificationTopic.resource,
            }),
          ],
        },
      ],
    });
  }
}
