import * as dotenv from "dotenv";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export enum CapacityProviders {
  FARGATE = "FARGATE",
  FARGATE_SPOT = "FARGATE_SPOT",
}
export interface EnvProps {
  accountId: string;
  region: string;
  shortName: string; // i.e. dev
  name: string; // i.e. development - used for NODE_ENV and extracted from CDK context
  vpcCidr: string;
  capacityProviders: CapacityProviders[];
  certificateArn: string;
  apiDomainAlias: string;
  vpcLogging: boolean; // whether or not to enable VPC flow logs
  albLogging: boolean; // whether or not to enable ALB logs
  logRetentionDays: any;
  desiredCount: number;
  natGateways: number;
  apiServiceECRImageTag: string;
  allowedVpcNatIps: string[];
  minCount: number;
  maxCount: number;
  dbMinAcu: number;
  dbMaxAcu: number;
  dbBackupRetentionDays: number;
  twilioAccountSecret: string;
  peruseUrl: string;
  filestackPrincipalArn: string;
  emailRecipient: string;
  sentryEnabled: boolean;
  sentryDsn: string;
  sentrySampleRateErrors: number;
  segmentEnabled: boolean;
}

export const getEnvProps = (env: string): EnvProps => {
  dotenv.config({ path: `envs/${env}.env` });

  return {
    shortName: process.env.ENV_SHORT_NAME || "dev",
    name: env,
    accountId: process.env.AWS_ACCOUNT_ID || "",
    region: process.env.AWS_REGION || "us-east-1",
    vpcCidr: process.env.VPC_CIDR || "",
    certificateArn: process.env.CERRTIFICATE_ARN || "",
    apiDomainAlias: process.env.API_DOMAIN_ALIAS || "",
    vpcLogging: process.env.VPC_LOGGING === "true" ? true : false,
    albLogging: process.env.ALB_LOGGING === "true" ? true : false,
    logRetentionDays:
      RetentionDays[
        (process.env.LOG_RETENTION_DAYS || "THREE_DAYS") as any as RetentionDays
      ],
    capacityProviders: (
      process.env.CAPACITY_PROVIDERS || "FARGATE,FARGATE_SPOT"
    )
      .split(",")
      .filter((e) => isCapacityProvider(e))
      .map((e) => e as CapacityProviders),
    desiredCount: parseInt(process.env.DESIRED_COUNT || "1"),
    natGateways: parseInt(process.env.NAT_GATEWAYS || "1"),
    apiServiceECRImageTag: process.env.API_SERVICE_ECR_IMAGE_TAG || "latest",
    allowedVpcNatIps: [],
    minCount: parseInt(process.env.MIN_COUNT || "1"),
    maxCount: parseInt(process.env.MAX_COUNT || "1"),
    dbMinAcu: parseFloat(process.env.DB_MIN_ACU || "2"),
    dbMaxAcu: parseFloat(process.env.DB_MAX_ACU || "4"),
    dbBackupRetentionDays: parseInt(
      process.env.DB_BACKUP_RETENTION_DAYS || "1",
    ),
    peruseUrl:
      process.env.PERUSE_URL || "https://api-service.staging.peruseml.com",
    twilioAccountSecret: process.env.TWILIO_ACCOUNT_SECRET || "",
    filestackPrincipalArn: process.env.FILESTACK_PRINCIPAL_ARN || "",
    emailRecipient: process.env.EMAIL_RECIPIENT || "loads@bobtail.com",
    sentryEnabled: process.env.SENTRY_ENABLED === "true" ? true : false,
    sentryDsn: process.env.SENTRY_DSN || "",
    sentrySampleRateErrors: parseInt(
      process.env.SENTRY_SAMPLE_RATE_ERRORS || "1",
    ),
    segmentEnabled: process.env.SEGMENT_ENABLED === "true" ? true : false,
  };
};

function isCapacityProvider(value: string): value is CapacityProviders {
  return Object.values(CapacityProviders).includes(value as CapacityProviders);
}
