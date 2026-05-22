import { App, Stack, StackProps } from "aws-cdk-lib";
import {
  AppConfigStack,
  DeploymentStrategy,
} from "./infrastructure/app-config.stack";
// Uncomment for RDS/Aurora support
import { EnvProps } from "./cdk.config";
import { BastionStack } from "./infrastructure/bastion.stack";
import { SecretsManagerStack } from "./infrastructure/secrets-manager.stack";
import { SecurityGroupStack } from "./infrastructure/security-groups.stack";
import { VpcStack } from "./infrastructure/vpc.stack";
import { AuroraStack } from "./persistent/aurora.stack";
import { S3Stack } from "./persistent/s3.stack";
// Uncomment for SQS
import { ApiStack } from "./api/api.stack";
import { EmailReceiveStack } from "./infrastructure/email-receive.stack";
import { EcrStack } from "./persistent/ecr.stack";

export interface CdkStackProps extends StackProps {
  envProps: EnvProps;
}
export class CdkStack extends Stack {
  constructor(
    scope: App,
    id: string,
    private props: CdkStackProps,
  ) {
    super(scope, id, props);

    const s3Stack = new S3Stack(scope, `${props.envProps.shortName}-S3`, {
      ...props,
      description: `${props.envProps.shortName} S3 Stack`,
    });

    // Networking
    const vpcStack = new VpcStack(scope, `${props.envProps.shortName}-VPC`, {
      ...props,
      loggingBucket: s3Stack.loggingBucket,
      description: `${props.envProps.shortName} VPC Stack`,
    });

    const sgStack = new SecurityGroupStack(
      scope,
      `${props.envProps.shortName}-SG`,
      {
        ...props,
        vpc: vpcStack.vpc,
        description: `${props.envProps.shortName} Security Groups Stack`,
      },
    );

    // Persistent
    // no prefix since we use 1ECR for all env's
    const ecrStack = new EcrStack(scope, `${props.envProps.shortName}-ECR`, {
      ...props,
      description: `Loads Management ECR Stack`,
    });

    const secretsManagerStack = new SecretsManagerStack(
      scope,
      `BobtaillmSecretsManager`,
      {
        ...props,
        description: `Bobtail ${props.envProps.shortName} Secrets Manager Stack`,
      },
    );

    new BastionStack(scope, `${props.envProps.shortName}-Bastion`, {
      ...props,
      description: `${props.envProps.shortName} Bastion Stack`,
      vpc: vpcStack.vpc,
      securityGroup: sgStack.bastionSecurityGroup,
    });

    const auroraStack = new AuroraStack(
      scope,
      `${props.envProps.shortName}-Aurora`,
      {
        ...props,
        description: `${props.envProps.shortName} Aurora Stack`,
        vpc: vpcStack.vpc,
        auroraSecurityGroup: sgStack.auroraSecurityGroup,
      },
    );

    const emailReceiveStack = new EmailReceiveStack(
      scope,
      `${props.envProps.shortName}-Email-Receive`,
      {
        lambdaVpc: vpcStack.vpc,
        lambdaSecurityGroup: sgStack.lambdaSecurityGroup,
        filestackPrincipalArn: props.envProps.filestackPrincipalArn,
        ...props,
      },
    );

    const appConfigStack = new AppConfigStack(scope, `BobtaillmAppConfig`, {
      ...props,
      description: `Bobtail ${props.envProps.shortName} AppConfig Stack`,
      deploymentStrategy: DeploymentStrategy.QUICK,
      content: {
        dbSecretARN: auroraStack.dbSecretARN,
        auth0SecretArn: secretsManagerStack.auth0Secret.secretArn,
        loadsManagementApiKeysSecretARN:
          secretsManagerStack.loadsManagementApiKeysSecret.secretArn,
        twilioSecretArn: secretsManagerStack.twilioApiKeysSecret.secretArn,
        clientServiceUrl: process.env.CLIENT_SERVICE_URL || "",
        brokerServiceUrl: process.env.BROKER_SERVICE_URL || "",
        filestackSecretArn: secretsManagerStack.filestackSecret.secretArn,
        peruseSecretArn: secretsManagerStack.peruseSecret.secretArn,
        peruseUrl: props.envProps.peruseUrl,
        emailParsedNotificationQueueUrl:
          emailReceiveStack.emailParsedNotificationQueueUrl,
        apiDomainAlias: props.envProps.apiDomainAlias,
        sentryEnabled: props.envProps.sentryEnabled,
        sentryDsn: props.envProps.sentryDsn,
        sentrySampleRateErrors: props.envProps.sentrySampleRateErrors,
        segmentWriteKeySecretARN:
          secretsManagerStack.segmentWriteKeySecret.secretArn,
        segmentEnabled: props.envProps.segmentEnabled,
      },
    });

    // Compute and Runtime
    const apiStack = new ApiStack(scope, `${props.envProps.shortName}-Api`, {
      ...props,
      description: `${props.envProps.shortName} Api Stack`,
      vpc: vpcStack.vpc,
      ecrRepository: ecrStack.ecrRepository,
      serviceSecurityGroup: sgStack.fargateSecurityGroup,
      loggingBucket: s3Stack.loggingBucket,
      albSecurityGroup: sgStack.albSecurityGroup,
      loadsEmailBucket: emailReceiveStack.emailReceiveBucket,
    });
    apiStack.addDependency(appConfigStack);
  }
}
