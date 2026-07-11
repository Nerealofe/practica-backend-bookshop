import { BookRepository, FindBooksResult } from '../repositories/BookRepository';

export interface FindBooksUseCaseInput {
  page: number;
  limit: number;
  search?: string;
}

export class FindBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  async execute(input: FindBooksUseCaseInput): Promise<FindBooksResult> {
    if (input.page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (input.limit < 1) {
      throw new Error('Limit must be greater than 0');
    }

    return this.bookRepository.findMany({
      page: input.page,
      limit: input.limit,
      search: input.search,
    });
  }
}
