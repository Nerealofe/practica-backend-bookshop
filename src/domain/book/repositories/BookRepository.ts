import { Book } from '../Book';

export interface CreateBookParams {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: number;
}

export interface FindBooksCriteria {
  page: number;
  limit: number;
  search?: string;
}

export interface FindBooksResult {
  books: Book[];
  total: number;
}

export interface BookRepository {
  create(params: CreateBookParams): Promise<Book>;
  findMany(criteria: FindBooksCriteria): Promise<FindBooksResult>;
}
