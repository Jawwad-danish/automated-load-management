import { Stack } from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { CdkStackProps } from "../cdk.stack";

export class SecretsManagerStack extends Stack {
  public readonly auth0Secret;
  public readonly loadsManagementApiKeysSecret;
  public readonly twilioApiKeysSecret;
  public readonly peruseSecret;
  public readonly filestackSecret;
  public readonly segmentWriteKeySecret;

  constructor(scope: Construct, id: string, props: CdkStackProps) {
    super(scope, id, props);

    this.auth0Secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      `${props.envProps.shortName}-auth0-creds-Secret`,
      `${props.envProps.shortName}-auth0-creds`,
    );
    this.loadsManagementApiKeysSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      `${props.envProps.shortName}-api-keys-Secret`,
      `${props.envProps.shortName}-api-keys`,
    );
    this.twilioApiKeysSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      `${props.envProps.shortName}-twilio-secret-keys`,
      `${props.envProps.shortName}-twilio-configs`,
    );

    this.peruseSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      `${props.envProps.shortName}-peruse-v2-Secret`,
      `${props.envProps.shortName}-peruse-v2`,
    );

    this.filestackSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      `${props.envProps.shortName}-filestack-secret-Secret`,
      `${props.envProps.shortName}-filestack`,
    );
    this.segmentWriteKeySecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      `${props.envProps.shortName}-segment-write-key-Secret`,
      `${props.envProps.shortName}-segment-write-key`,
    );
  }
}
