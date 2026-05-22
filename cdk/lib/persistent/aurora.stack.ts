import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { EnvProps } from "../cdk.config";

export interface AuroraProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  auroraSecurityGroup: ec2.SecurityGroup;
  envProps: EnvProps;
}

export class AuroraStack extends cdk.Stack {
  readonly cluster: rds.DatabaseCluster;
  readonly dbSecretARN: string;

  constructor(scope: Construct, id: string, props: AuroraProps) {
    super(scope, id, props);
    const subnetGroup = new rds.SubnetGroup(
      this,
      `${props.envProps.shortName}-subnetGroup`,
      {
        description: `Subnetgroup for ${props.envProps.shortName} serverless postgres aurora database`,
        vpc: props.vpc,
        subnetGroupName: `${props.envProps.shortName}-aurora-subnetgroup`,
        vpcSubnets: {
          subnets: props.vpc.isolatedSubnets,
        },
      },
    );

    this.cluster = new rds.DatabaseCluster(
      this,
      `${props.envProps.shortName}-Database`,
      {
        defaultDatabaseName: "bobtaillm",
        clusterIdentifier: `${props.envProps.shortName}-bobtaillm-db`,
        engine: rds.DatabaseClusterEngine.auroraPostgres({
          version: rds.AuroraPostgresEngineVersion.VER_15_3,
        }),
        writer: rds.ClusterInstance.serverlessV2("writer"),
        serverlessV2MinCapacity: props.envProps.dbMinAcu,
        serverlessV2MaxCapacity: props.envProps.dbMaxAcu,
        storageEncrypted: true,
        credentials: rds.Credentials.fromGeneratedSecret("clusteradmin", {
          secretName: `${props.envProps.shortName}-BobtailLMAuroraDatabaseSecret`,
        }),
        vpc: props.vpc,
        subnetGroup: subnetGroup,
        securityGroups: [props.auroraSecurityGroup],
        backup: {
          retention: cdk.Duration.days(props.envProps.dbBackupRetentionDays),
        },
      },
    );

    this.dbSecretARN = this.cluster.secret?.secretArn || "";
    if (!this.dbSecretARN) {
      throw new Error("Could not extract DB secret ARN");
    }
  }
}
