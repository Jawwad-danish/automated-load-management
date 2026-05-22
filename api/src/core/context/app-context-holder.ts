import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppContext, AsyncAppContext, GlobalAppContext } from './app-context';

export class AppContextHolder {
  private static storage = new AsyncLocalStorage<AppContext>();

  static get(): AppContext {
    return this.storage.getStore() ?? GlobalAppContext.INSTANCE;
  }

  static global(): AppContext {
    return GlobalAppContext.INSTANCE;
  }

  static create(req: Request, callback: (...args: any[]) => void): void {
    const correlationId: string = req.header('x-correlation-id') ?? uuidv4();
    const agent: string = req.header('agent') ?? '';
    const accessToken: string = req.header('authorization') ?? '';
    const consumer: string = req.header('client') ?? '';
    const context = new AsyncAppContext(
      correlationId,
      agent,
      consumer,
      accessToken,
    );
    this.storage.run(context, callback);
  }
}
