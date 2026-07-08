export class BusinessConflictError extends Error {
  readonly name = 'BusinessConflictError';
  constructor(message: string) {
    super(message);
  }
}
