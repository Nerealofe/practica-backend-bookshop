import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CreateBookUseCase } from '../../../domain/book/use-cases/create-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';

const createBookValidationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  author: z.string().min(1, 'Author is required'),
});

export const createBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, price, author } = createBookValidationSchema.parse(req.body);

    const bookRepository = new PrismaBookRepository();
    const createBookUseCase = new CreateBookUseCase(bookRepository);

    const userId = (req as unknown as { userId: number }).userId;

    const newBook = await createBookUseCase.execute({
      title,
      description,
      price,
      author,
      ownerId: userId,
    });

    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
};
