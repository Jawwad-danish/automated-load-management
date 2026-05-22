import { Construct } from "constructs";
import { EnvProps } from "../../cdk.config";

export class ResourceWrapper<TResource> {
  constructor(readonly resource: TResource) {}
}

export abstract class ServiceFactory<
  TResource extends ResourceWrapper<any>,
  TBuildOptions extends object,
> {
  constructor(
    protected readonly scope: Construct,
    protected readonly envProps: EnvProps,
  ) {}

  abstract build(idSuffix: string, options: TBuildOptions): TResource;
}
