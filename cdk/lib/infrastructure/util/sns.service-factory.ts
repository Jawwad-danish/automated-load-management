import * as sns from "aws-cdk-lib/aws-sns";
import { ResourceWrapper, ServiceFactory } from "./service-factory";

export interface SNSOptions {
  displayName?: string;
}

export class SNSWrapper extends ResourceWrapper<sns.Topic> {}

export class SNSFactory extends ServiceFactory<SNSWrapper, SNSOptions> {
  build(idSuffix: string, options: SNSOptions = {}): SNSWrapper {
    const displayName = options.displayName ?? idSuffix;
    const resource = new sns.Topic(
      this.scope,
      `${this.envProps.shortName}-${idSuffix}-topic`,
      {
        displayName: `${this.envProps.shortName}-${displayName}`,
      },
    );
    return new SNSWrapper(resource);
  }
}
