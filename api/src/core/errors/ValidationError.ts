export class ValidationError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}
