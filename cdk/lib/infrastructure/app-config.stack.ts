import { Stack, StackProps } from "aws-cdk-lib";
import {
  CfnApplication,
  CfnConfigurationProfile,
  CfnDeployment,
  CfnDeploymentStrategy,
  CfnEnvironment,
  CfnHostedConfigurationVersion,
} from "aws-cdk-lib/aws-appconfig";
import { Construct } from "constructs";
import { EnvProps } from "../cdk.config";

export const ID_APPLICATION = "BobtaillmAppConfig";
export const ID_ENVIRONMENT = "BobtaillmAppConfigEnvironment";
export const ID_PROFILE = "BobtaillmAppConfigProfile";
export const ID_DEPLOYMENT_STRATEGY = "BobtaillmAppConfigDeploymentStrategy";
export const ID_HOSTED_CONFIGURATION = "EmptylmConfig";
export const ID_DEPLOYMENT = "BobtaillmAppConfigDeployment";
export const APPLICATION_NAME = "Bobtail-lm";

export enum DeploymentStrategy {
  QUICK,
  LINEAR_50_PERCENT,
}

export interface AppConfigContent {
  dbSecretARN: string;
  auth0SecretArn: string;
  loadsManagementApiKeysSecretARN: string;
  twilioSecretArn: string;
  clientServiceUrl: string;
  brokerServiceUrl: string;
  peruseSecretArn: string;
  filestackSecretArn: string;
  peruseUrl: string;
  emailParsedNotificationQueueUrl: string;
  apiDomainAlias: string;
  sentryEnabled: boolean;
  sentryDsn: string;
  sentrySampleRateErrors: number;
  segmentWriteKeySecretARN: string;
  segmentEnabled: boolean;
}

export interface AppConfigProps extends StackProps {
  deploymentStrategy?: DeploymentStrategy;
  content: AppConfigContent;
  envProps: EnvProps;
}

export class AppConfigStack extends Stack {
  readonly application: CfnApplication;
  readonly profile: CfnConfigurationProfile;
  readonly deploymentStrategy: CfnDeploymentStrategy;
  readonly appConfigEnvironment: CfnEnvironment;

  constructor(scope: Construct, id: string, props: AppConfigProps) {
    super(scope, id, props);

    this.application = new CfnApplication(this, ID_APPLICATION, {
      name: APPLICATION_NAME,
      description: "Configuration for bobtail-lm",
    });

    // // we need to create all envs at once
    const appConfigEnvs: Record<string, CfnEnvironment> = {
      Development: new CfnEnvironment(this, ID_ENVIRONMENT, {
        name: "Development",
        description: "Development environment for bobtail-lm",
        applicationId: this.application.ref,
      }),
      development: new CfnEnvironment(this, "development", {
        name: "development",
        description: "development environment for bobtail-lm",
        applicationId: this.application.ref,
      }),
      production: new CfnEnvironment(this, "production", {
        name: "production",
        description: "production environment for bobtail-lm",
        applicationId: this.application.ref,
      }),
      testing: new CfnEnvironment(this, "testing", {
        name: "testing",
        description: "testing environment for bobtail-lm",
        applicationId: this.application.ref,
      }),
    };

    // then choose the one to work with based on existing env
    this.appConfigEnvironment = appConfigEnvs[props.envProps.name];

    this.profile = new CfnConfigurationProfile(this, ID_PROFILE, {
      name: `General`,
      locationUri: "hosted",
      applicationId: this.application.ref,
    });
    this.deploymentStrategy = this.getDeploymentStrategy(
      props.deploymentStrategy,
    );

    this.deployInitialVersion(props.content);
  }

  private deployInitialVersion(content?: AppConfigContent): void {
    const emptyConfiguration = new CfnHostedConfigurationVersion(
      this,
      ID_HOSTED_CONFIGURATION,
      {
        applicationId: this.application.ref,
        configurationProfileId: this.profile.ref,
        contentType: "application/json",
        content: JSON.stringify({
          DB_SECRET_ARN: content?.dbSecretARN,
          AUTH0_SECRET_ARN: content?.auth0SecretArn,
          API_KEYS_SECRET_ARN: content?.loadsManagementApiKeysSecretARN,
          TWILIO_ACCOUNT_SECRET_ARN: content?.twilioSecretArn,
          PERUSE_SECRET_ARN: content?.peruseSecretArn,
          FILESTACK_SECRET_ARN: content?.filestackSecretArn,
          CLIENT_SERVICE_URL: content?.clientServiceUrl,
          BROKER_SERVICE_URL: content?.brokerServiceUrl,
          API_DOMAIN_ALIAS: content?.apiDomainAlias,
          PERUSE_URL:
            content?.peruseUrl || "https://api-service.staging.peruseml.com",
          EMAIL_PARSED_NOTIFICATION_QUEUE_URL:
            content?.emailParsedNotificationQueueUrl,
          SENTRY_ENABLED: content?.sentryEnabled,
          SENTRY_DSN: content?.sentryDsn,
          SENTRY_SAMPLE_RATE_ERRORS: content?.sentrySampleRateErrors,
          SEGMENT_WRITE_KEY_SECRET_ARN: content?.segmentWriteKeySecretARN,
          SEGMENT_ENABLED: content?.segmentEnabled,
        }),
      },
    );

    new CfnDeployment(this, ID_DEPLOYMENT, {
      applicationId: this.application.ref,
      configurationProfileId: this.profile.ref,
      configurationVersion: emptyConfiguration.ref,
      deploymentStrategyId: this.deploymentStrategy.ref,
      environmentId: this.appConfigEnvironment.ref,
    });
  }

  private getDeploymentStrategy(
    deploymentStrategy?: DeploymentStrategy,
  ): CfnDeploymentStrategy {
    switch (deploymentStrategy) {
      case DeploymentStrategy.LINEAR_50_PERCENT:
        return this.buildDefaultDeploymentStrategy();
      case DeploymentStrategy.QUICK:
        return this.buildQuickDeploymentStrategy();
      default:
        return this.buildDefaultDeploymentStrategy();
    }
  }

  private buildDefaultDeploymentStrategy(): CfnDeploymentStrategy {
    return new CfnDeploymentStrategy(this, ID_DEPLOYMENT_STRATEGY, {
      deploymentDurationInMinutes: 1,
      growthFactor: 50,
      name: "Linear50PercentEvery30Seconds",
      growthType: "LINEAR",
      replicateTo: "NONE",
    });
  }

  private buildQuickDeploymentStrategy(): CfnDeploymentStrategy {
    return new CfnDeploymentStrategy(this, ID_DEPLOYMENT_STRATEGY, {
      deploymentDurationInMinutes: 0,
      growthFactor: 100,
      name: "QuickDeployment",
      growthType: "LINEAR",
      replicateTo: "NONE",
      description: "Deploy all with no bake time",
    });
  }
}
