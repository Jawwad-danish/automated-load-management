import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cdk from "aws-cdk-lib";
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";
import { EnvProps } from "../cdk.config";
import {
  createExecRole,
  createTaskRole,
  createEcsCluster,
  createLbService,
  createLogging,
} from ".";

export interface ApiProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  ecrRepository: ecr.IRepository;
  serviceSecurityGroup: ec2.SecurityGroup;
  loggingBucket?: s3.IBucket;
  envProps: EnvProps;
  albSecurityGroup: ec2.SecurityGroup;
  loadsEmailBucket: s3.IBucket;
}

export class ApiStack extends cdk.Stack {
  readonly cluster: Cluster;
  readonly securityGroup: ec2.SecurityGroup;
  readonly loadBalancerUrl: string;

  constructor(
    scope: Construct,
    id: string,
    private props: ApiProps,
  ) {
    super(scope, id, props);

    // Create VPC and Fargate Cluster
    // NOTE: Limit AZs to avoid reaching resource quotas
    const cluster = createEcsCluster(this, props.vpc, props.envProps);

    const executionRole = createExecRole(this, props.envProps);
    const taskRole = createTaskRole(this, props);

    // Instantiate Fargate Service with just cluster and image
    const logging = createLogging(this, props.envProps);
    createLbService(this, {
      envProps: props.envProps,
      cluster,
      vpc: props.vpc,
      serviceSecurityGroup: props.serviceSecurityGroup,
      ecrRepository: props.ecrRepository,
      executionRole,
      taskRole,
      logging,
      loggingBucket: props.loggingBucket,
      albSecurityGroup: props.albSecurityGroup,
    });
  }
}
