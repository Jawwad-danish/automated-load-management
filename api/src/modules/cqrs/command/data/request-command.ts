import { Command } from './command';

export abstract class RequestCommand<
  TRequest,
  TResult,
> extends Command<TResult> {
  constructor(readonly request: TRequest) {
    super();
  }
}
