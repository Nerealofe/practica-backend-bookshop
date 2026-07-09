import { Book } from '../Book';

export interface CreateBookParams {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: number;
}

export interface BookRepository {
  create(params: CreateBookParams): Promise<Book>;
}
