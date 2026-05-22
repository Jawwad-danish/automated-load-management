import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as logs from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import { EnvProps } from "../../cdk.config";
import { Construct } from "constructs";

export const createEcsCluster = (
  scope: Construct,
  vpc: ec2.Vpc,
  envProps: EnvProps,
): ecs.Cluster => {
  return new ecs.Cluster(scope, `${envProps.shortName}-Cluster`, {
    vpc: vpc,
    clusterName: `${envProps.shortName}-cluster`,
    containerInsights: true,
    enableFargateCapacityProviders: true,
  });
};

export const createLogging = (
  scope: Construct,
  envProps: EnvProps,
): ecs.AwsLogDriver => {
  const apiServiceLogGroup = new logs.LogGroup(
    scope,
    `${envProps.shortName}-ApiServiceLogGroup`,
    {
      logGroupName: `/ecs/ApiService-${envProps.shortName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    },
  );

  const apiServiceLogDriver = new ecs.AwsLogDriver({
    logGroup: apiServiceLogGroup,
    streamPrefix: "ApiService",
  });
  return apiServiceLogDriver;
};

export const createLbService = (
  scope: Construct,
  props: {
    envProps: EnvProps;
    vpc: ec2.Vpc;
    cluster: ecs.Cluster;
    serviceSecurityGroup: ec2.SecurityGroup;
    ecrRepository: ecr.IRepository;
    executionRole: iam.Role;
    taskRole: iam.Role;
    logging: ecs.AwsLogDriver;
    loggingBucket?: s3.IBucket;
    albSecurityGroup: ec2.SecurityGroup;
  },
): {
  alb: elbv2.ApplicationLoadBalancer;
  albProtocol: string;
} => {
  // Create Task Definition
  const taskDefinition = new ecs.FargateTaskDefinition(
    scope,
    `${props.envProps.shortName}-TaskDef`,
    {
      taskRole: props.taskRole,
      executionRole: props.executionRole,
      family: `${props.envProps.shortName}-taskdef`,
    },
  );

  // Add container
  const container = taskDefinition.addContainer(
    `${props.envProps.shortName}-container`,
    {
      image: ecs.ContainerImage.fromEcrRepository(
        props.ecrRepository,
        props.envProps.apiServiceECRImageTag,
      ),
      memoryReservationMiB: 256,
      cpu: 256,
      containerName: `${props.envProps.shortName}-container`,
      logging: props.logging,
      environment: {
        NODE_ENV: props.envProps.name,
        NO_COLOR: "1",
      },
      linuxParameters: new ecs.LinuxParameters(
        scope,
        `${props.envProps.shortName}-containerLinuxParameters`,
        {
          initProcessEnabled: true,
        },
      ),
      healthCheck: {
        command: [
          "CMD-SHELL",
          "wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1",
        ],
        interval: cdk.Duration.seconds(10),
        retries: 3,
        startPeriod: cdk.Duration.seconds(10),
        timeout: cdk.Duration.seconds(5),
      },
    },
  );

  container.addPortMappings({
    containerPort: 3000,
    protocol: ecs.Protocol.TCP,
  });

  // Create Service
  const capacityProviderStrategies = props.envProps.capacityProviders.map(
    (value, index) => {
      return {
        capacityProvider: value,
        weight: index + 1,
      };
    },
  );
  if (capacityProviderStrategies.length === 0) {
    throw new Error(
      "You must specify at least on of the valid capacity proviers: FARGATE or FARGATE_SPOT",
    );
  }

  const apiService = new ecs.FargateService(
    scope,
    `${props.envProps.shortName}-Service`,
    {
      serviceName: `${props.envProps.shortName}-service`,
      cluster: props.cluster,
      desiredCount: props.envProps.desiredCount,
      taskDefinition,
      securityGroups: [props.serviceSecurityGroup],
      assignPublicIp: false,
      capacityProviderStrategies,
      circuitBreaker: {
        rollback: true,
      },
      enableECSManagedTags: true,
      healthCheckGracePeriod: cdk.Duration.seconds(30),
    },
  );

  // Create ALB
  const alb = new elbv2.ApplicationLoadBalancer(
    scope,
    `${props.envProps.shortName}-ALB`,
    {
      vpc: props.vpc,
      internetFacing: true,
      loadBalancerName: `${props.envProps.shortName}-alb`,
      deletionProtection: true,
      securityGroup: props.albSecurityGroup,
    },
  );

  const starBobtailComCert = certificatemanager.Certificate.fromCertificateArn(
    scope,
    `${props.envProps.shortName}-starbobtail.com`,
    props.envProps.certificateArn,
  );

  let albProtocol = elbv2.ApplicationProtocol.HTTP;
  let listenerProps;

  listenerProps = {
    port: 80,
    open: true,
  };

  if (starBobtailComCert) {
    albProtocol = elbv2.ApplicationProtocol.HTTPS;
    alb.addRedirect({
      sourcePort: 80,
      targetPort: 443,
      sourceProtocol: elbv2.ApplicationProtocol.HTTP,
      targetProtocol: elbv2.ApplicationProtocol.HTTPS,
    });
    listenerProps = {
      port: 443,
      open: true,
      certificates: [starBobtailComCert],
    };
  }

  const listener = alb.addListener(
    `${props.envProps.shortName}-PublicListener`,
    listenerProps,
  );

  // Attach ALB to ECS Service
  const tg = listener.addTargets(`${props.envProps.shortName}-ECS`, {
    port: 3000,
    protocol: elbv2.ApplicationProtocol.HTTP, // this is between ALB and Service
    targets: [apiService],
    // include health check (default is none)
    healthCheck: {
      protocol: elbv2.Protocol.HTTP,
      path: "/health",
      interval: cdk.Duration.seconds(10),
      healthyThresholdCount: 3,
      unhealthyThresholdCount: 3,
    },
    deregistrationDelay: cdk.Duration.seconds(30),
  });

  if (props.envProps.albLogging && props.loggingBucket) {
    alb.logAccessLogs(props.loggingBucket, `${props.envProps.shortName}-alb`);
  }

  // Autoscaling
  const scalabaleTaskCount = apiService.autoScaleTaskCount({
    minCapacity: props.envProps.minCount,
    maxCapacity: props.envProps.maxCount,
  });

  scalabaleTaskCount.scaleOnCpuUtilization(
    `${props.envProps.shortName}-cpu-scale`,
    {
      targetUtilizationPercent: 80,
    },
  );

  scalabaleTaskCount.scaleOnMemoryUtilization(
    `${props.envProps.shortName}-memory-scale`,
    {
      targetUtilizationPercent: 80,
    },
  );

  scalabaleTaskCount.scaleOnRequestCount(
    `${props.envProps.shortName}-request-count-scale`,
    {
      requestsPerTarget: 100,
      targetGroup: tg,
    },
  );

  const wafAclAppSyncArn = cdk.Fn.importValue("WAF:wafAclRegionalArn");
  new wafv2.CfnWebACLAssociation(scope, `${props.envProps.shortName}-AlbWaf`, {
    resourceArn: alb.loadBalancerArn,
    webAclArn: wafAclAppSyncArn,
  });

  return { alb, albProtocol };
};
