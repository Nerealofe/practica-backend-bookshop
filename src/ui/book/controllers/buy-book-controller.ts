import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { BuyBookUseCase } from '../../../domain/book/use-cases/buy-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';

const buyBookParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const buyBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = buyBookParamsSchema.parse(req.params);
    const buyerId = (req as unknown as { userId: number }).userId;

    const bookRepository = new PrismaBookRepository();
    const buyBookUseCase = new BuyBookUseCase(bookRepository);

    const soldBook = await buyBookUseCase.execute({
      bookId: id,
      buyerId,
    });

    res.status(200).json(soldBook);
  } catch (error) {
    next(error);
  }
};
