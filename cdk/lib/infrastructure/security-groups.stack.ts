import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { EnvProps } from "../cdk.config";
import { Construct } from "constructs";

export interface SecurityGroupProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  envProps: EnvProps;
}

export class SecurityGroupStack extends cdk.Stack {
  readonly fargateSecurityGroup: ec2.SecurityGroup;
  readonly bastionSecurityGroup: ec2.SecurityGroup;
  readonly auroraSecurityGroup: ec2.SecurityGroup;
  readonly albSecurityGroup: ec2.SecurityGroup;
  readonly lambdaSecurityGroup: ec2.SecurityGroup;

  constructor(
    scope: Construct,
    id: string,
    private props: SecurityGroupProps,
  ) {
    super(scope, id, props);

    this.fargateSecurityGroup = new ec2.SecurityGroup(
      this,
      `${this.props.envProps.shortName}-serviceSecurityGroup`,
      {
        vpc: props.vpc,
        description: `${this.props.envProps.shortName} API Service SG`,
      },
    );

    this.bastionSecurityGroup = new ec2.SecurityGroup(
      this,
      `${this.props.envProps.shortName}-BastionSecurityGroup`,
      {
        vpc: props.vpc,
        //securityGroupName: "bastion-sg",
        description: `${this.props.envProps.shortName} Bastion SG`,
      },
    );

    this.auroraSecurityGroup = new ec2.SecurityGroup(
      this,
      `${this.props.envProps.shortName}-AuroraSecurityGroup`,
      {
        vpc: props.vpc,
        //securityGroupName: "aurora-sg",
        allowAllOutbound: false,
        description: `${this.props.envProps.shortName} Aurora SG`,
      },
    );

    this.auroraSecurityGroup.connections.allowFrom(
      this.bastionSecurityGroup,
      ec2.Port.tcp(5432),
      "Allow DB access from bastion",
    );

    this.auroraSecurityGroup.connections.allowFrom(
      this.fargateSecurityGroup,
      ec2.Port.tcp(5432),
      "Allow DB access from service",
    );

    this.albSecurityGroup = new ec2.SecurityGroup(
      this,
      `${this.props.envProps.shortName}-AlbSecurityGroup`,
      {
        vpc: props.vpc,
        // we don't set securityGroupName because is not recommended and
        // it might prevent updating stacks that depends on it in the future
        // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SecurityGroupProps.html#securitygroupname
        // securityGroupName: 'alb-sg',
        description: `${this.props.envProps.shortName} ALB SG`,
      },
    );

    // allow 80 and 443 on IPv4 and IPv6
    for (const port of [80, 443]) {
      for (const cidr of props.envProps.allowedVpcNatIps) {
        this.albSecurityGroup.addIngressRule(
          ec2.Peer.ipv4(cidr),
          ec2.Port.tcp(port),
          `Allow traffic from other Bobtail VPCs on ${port} IPv4`,
        );
      }
    }

    this.lambdaSecurityGroup = new ec2.SecurityGroup(
      this,
      `${this.props.envProps.shortName}-LambdaSecurityGroup`,
      {
        vpc: props.vpc,
        description: `${this.props.envProps.shortName} Lambda SG`,
      },
    );
  }
}
