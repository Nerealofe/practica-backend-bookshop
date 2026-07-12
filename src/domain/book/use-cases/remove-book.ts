import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { ForbiddenOperationError } from '../../errors/ForbiddenOperationError';
import { BookRepository } from '../repositories/BookRepository';
import { BusinessConflictError } from '../../errors/BusinessConflictError';

export interface RemoveBookUseCaseInput {
  bookId: number;
  userId: number;
}

export class RemoveBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(input: RemoveBookUseCaseInput): Promise<void> {
    const book = await this.bookRepository.findById(input.bookId);

    if (!book) {
      throw new EntityNotFoundError('Book', String(input.bookId));
    }

    if (book.ownerId !== input.userId) {
      throw new ForbiddenOperationError('You cannot delete a book that does not belong to you');
    }

    if (book.status === 'SOLD') {
      throw new BusinessConflictError('A sold book cannot be deleted');
    }

    await this.bookRepository.remove(input.bookId);
  }
}
