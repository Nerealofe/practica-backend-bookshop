import { Book } from '../../../domain/book/Book';
import {
  BookRepository,
  CreateBookParams,
  FindBooksCriteria,
  FindBooksResult,
} from '../../../domain/book/repositories/BookRepository';
import { prisma } from '../../prisma-client';
import { BookStatus } from '@prisma/client';

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

  async findMany(criteria: FindBooksCriteria): Promise<FindBooksResult> {
    const where = criteria.search
      ? {
          status: BookStatus.PUBLISHED,
          OR: [
            {
              title: {
                contains: criteria.search,
                mode: 'insensitive' as const,
              },
            },
            {
              author: {
                contains: criteria.search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {
          status: BookStatus.PUBLISHED,
        };

    const { page, limit } = criteria;

    const booksDb = await this.prisma.book.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
    });

    const booksCount = await this.prisma.book.count({
      where,
    });

    const books = booksDb.map(
      (bookDb) =>
        new Book({
          id: bookDb.id,
          title: bookDb.title,
          description: bookDb.description,
          price: bookDb.price,
          author: bookDb.author,
          status: bookDb.status,
          ownerId: bookDb.ownerId,
          soldAt: bookDb.soldAt,
          createdAt: bookDb.createdAt,
        }),
    );

    return {
      books,
      total: booksCount,
    };
  }
}
