import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { RemoveBookUseCase } from '../../../domain/book/use-cases/remove-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';

const removeBookParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const removeBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = removeBookParamsSchema.parse(req.params);

    const userId = (req as unknown as { userId: number }).userId;

    const bookRepository = new PrismaBookRepository();
    const removeBookUseCase = new RemoveBookUseCase(bookRepository);

    await removeBookUseCase.execute({
      bookId: id,
      userId,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
