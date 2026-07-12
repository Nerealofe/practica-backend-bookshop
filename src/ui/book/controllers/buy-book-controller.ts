import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { BuyBookUseCase } from '../../../domain/book/use-cases/buy-book';
import { PrismaBookRepository } from '../../../infrastructure/book/repositories/PrismaBookRepository';
import { PrismaUserRepository } from '../../../infrastructure/user/repositories/PrismaUserRepository';
import { FakeEmailService } from '../../../infrastructure/shared/FakeEmailService';
import { NodemailerEmailService } from '../../../infrastructure/shared/NodemailerEmailService';
import { environmentService } from '../../../infrastructure/EnvironmentService';

const buyBookParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const buyBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = buyBookParamsSchema.parse(req.params);
    const buyerId = req.userId!;
    const bookRepository = new PrismaBookRepository();
    const userRepository = new PrismaUserRepository();

    const { NODE_ENV } = environmentService.get();
    const emailService =
      NODE_ENV === 'test' ? new FakeEmailService() : new NodemailerEmailService();

    const buyBookUseCase = new BuyBookUseCase(bookRepository, userRepository, emailService);

    const soldBook = await buyBookUseCase.execute({
      bookId: id,
      buyerId,
    });

    res.status(200).json(soldBook);
  } catch (error) {
    next(error);
  }
};
