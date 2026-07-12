export class ForbiddenOperationError extends Error {
  readonly name = 'ForbiddenOperationError';

  constructor(message: string) {
    super(message);
  }
}
