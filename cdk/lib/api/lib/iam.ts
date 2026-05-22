import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { EnvProps } from "../../cdk.config";
import { ApiProps } from "../api.stack";

export const createExecRole = (
  scope: Construct,
  envProps: EnvProps,
): iam.Role => {
  // create task definition execution role (permission that fargate service requires to start the task)
  const role = new iam.Role(scope, `${envProps.shortName}-TaskExecutionRole`, {
    assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
  });
  const policy = iam.ManagedPolicy.fromManagedPolicyArn(
    scope,
    `${envProps.shortName}-task-execution-policy`,
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  );
  role.addManagedPolicy(policy);

  return role;
};

// create task role (permissions that the application requires)
export const createTaskRole = (scope: Construct, props: ApiProps): iam.Role => {
  // create custom IAM policy
  const taskPolicy = new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        resources: ["*"],
        actions: [
          "appconfig:GetEnvironment",
          "appconfig:GetHostedConfigurationVersion",
          "appconfig:GetConfiguration",
          "appconfig:GetApplication",
          "appconfig:GetConfigurationProfile",
          "appconfig:StartConfigurationSession",
          "appconfig:GetLatestConfiguration",
        ],
        // 👇 Default for `effect` is ALLOW
        effect: iam.Effect.ALLOW,
      }),
      new iam.PolicyStatement({
        resources: ["*"],
        actions: [
          "secretsmanager:GetResourcePolicy",
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret",
          "secretsmanager:ListSecretVersionIds",
          "secretsmanager:ListSecrets",
        ],
        // 👇 Default for `effect` is ALLOW
        effect: iam.Effect.ALLOW,
      }),
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["cloudwatch:ListMetrics", "cloudwatch:PutMetricData"],
        // 👇 Default for `effect` is ALLOW
        effect: iam.Effect.ALLOW,
      }),

      new iam.PolicyStatement({
        actions: ["s3:GetObject", "s3:GetObjectACL", "s3:ListBucket"],
        // 👇 Default for `effect` is ALLOW
        effect: iam.Effect.ALLOW,
        resources: [`${props.loadsEmailBucket.bucketArn}/*`],
      }),
    ],
  });
  const role = new iam.Role(scope, `${props.envProps.shortName}-TaskRole`, {
    assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    inlinePolicies: {
      TaskPolicy: taskPolicy,
    },
  });
  role.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSQSFullAccess"),
  );
  return role;
};
