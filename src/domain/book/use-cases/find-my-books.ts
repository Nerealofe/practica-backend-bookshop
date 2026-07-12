import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';

export class FindMyBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(userId: number): Promise<Book[]> {
    return this.bookRepository.findManyByOwnerId(userId);
  }
}
