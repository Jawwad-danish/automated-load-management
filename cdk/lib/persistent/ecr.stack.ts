import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";

export class EcrStack extends cdk.Stack {
  readonly ecrRepository: ecr.IRepository;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.ecrRepository = ecr.Repository.fromRepositoryName(
      this,
      `bobtail-lm-repository`,
      `bobtail-lm`,
    );
    if (!this.ecrRepository.repositoryArn) {
      this.ecrRepository = new ecr.Repository(this, `bobtail-lm-repository`, {
        repositoryName: `bobtail-lm`,
      });
    }
  }
}
