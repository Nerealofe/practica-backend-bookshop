export class EntityNotFoundError extends Error {
  readonly name = 'EntityNotFoundError';

  constructor(entity: string, id: string) {
    super(`${entity} not found with id ${id}`);
  }
}
