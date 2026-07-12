import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { UpdateBookUseCase } from '../../../domain/book/use-cases/update-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';

const updateBookParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
const updateBookBodySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  author: z.string().min(1).optional(),
});

export const updateBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = updateBookParamsSchema.parse(req.params);
    const { title, description, price, author } = updateBookBodySchema.parse(req.body);
    const userId = (req as Request & { userId: number }).userId;
    const bookRepository = new PrismaBookRepository();
    const updateBookUseCase = new UpdateBookUseCase(bookRepository);
    const updatedBook = await updateBookUseCase.execute({
      bookId: id,
      userId,
      title,
      description,
      price,
      author,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};
