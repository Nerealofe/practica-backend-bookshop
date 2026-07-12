import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { ForbiddenOperationError } from '../../errors/ForbiddenOperationError';
import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';

export interface BuyBookUseCaseInput {
  bookId: number;
  buyerId: number;
}

export class BuyBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(input: BuyBookUseCaseInput): Promise<Book> {
    const book = await this.bookRepository.findById(input.bookId);

    if (!book) {
      throw new EntityNotFoundError('Book', String(input.bookId));
    }
    if (book.status === 'SOLD') {
      throw new BusinessConflictError('Book already sold');
    }
    if (book.ownerId === input.buyerId) {
      throw new ForbiddenOperationError('You cannot buy your own book');
    }

    const soldAt = new Date();

    return this.bookRepository.markAsSold(book.id, soldAt);
  }
}
