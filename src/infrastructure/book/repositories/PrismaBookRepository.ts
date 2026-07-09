import { Book } from '../../../domain/book/Book';
import { BookRepository, CreateBookParams } from '../../../domain/book/repositories/BookRepository';
import { prisma } from '../../prisma-client';

export class PrismaBookRepository implements BookRepository {
  private readonly prisma = prisma;

  async create(params: CreateBookParams): Promise<Book> {
    const prismaBook = await this.prisma.book.create({
      data: {
        title: params.title,
        description: params.description,
        price: params.price,
        author: params.author,
        ownerId: params.ownerId,
      },
    });

    return new Book({
      id: prismaBook.id,
      title: prismaBook.title,
      description: prismaBook.description,
      price: prismaBook.price,
      author: prismaBook.author,
      status: prismaBook.status,
      ownerId: prismaBook.ownerId,
      soldAt: prismaBook.soldAt,
      createdAt: prismaBook.createdAt,
    });
  }
}
