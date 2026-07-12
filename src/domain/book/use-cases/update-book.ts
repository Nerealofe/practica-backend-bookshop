import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { ForbiddenOperationError } from '../../errors/ForbiddenOperationError';
import { Book } from '../Book';
import { BookRepository, UpdateBookParams } from '../repositories/BookRepository';

export interface UpdateBookUseCaseInput extends UpdateBookParams {
  bookId: number;
  userId: number;
}

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(input: UpdateBookUseCaseInput): Promise<Book> {
    const book = await this.bookRepository.findById(input.bookId);
    if (!book) {
      throw new EntityNotFoundError('Book', String(input.bookId));
    }
    if (book.ownerId !== input.userId) {
      throw new ForbiddenOperationError('You cannot update a book that does not belong to you');
    }

    return this.bookRepository.update(input.bookId, {
      title: input.title,
      description: input.description,
      price: input.price,
      author: input.author,
    });
  }
}
