export class UnexpectedValueError extends Error {
  constructor(
    readonly property: string,
    readonly value: unknown,
  ) {
    super(`Unexpected value for ${value} on property ${property}`);
  }
}
