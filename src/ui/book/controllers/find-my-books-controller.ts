import { NextFunction, Request, Response } from 'express';
import { FindMyBooksUseCase } from '../../../domain/book/use-cases/find-my-books';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';

export const findMyBooksController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as unknown as { userId: number }).userId;
    const bookRepository = new PrismaBookRepository();
    const findMyBooksUseCase = new FindMyBooksUseCase(bookRepository);
    const books = await findMyBooksUseCase.execute(userId);

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};
