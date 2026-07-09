import { Book } from '../Book';
import { BookRepository } from '../repositories/BookRepository';

export interface CreateBookUseCaseInput {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: number;
}

export class CreateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(input: CreateBookUseCaseInput): Promise<Book> {
    if (input.price <= 0) {
      throw new Error('Book price must be greater than 0');
    }

    const book = await this.bookRepository.create({
      title: input.title,
      description: input.description,
      price: input.price,
      author: input.author,
      ownerId: input.ownerId,
    });

    return book;
  }
}
