export class UnauthorizedError extends Error {
  readonly name = 'UnauthorizedError';

  constructor(message: string) {
    super(message);
  }
}
