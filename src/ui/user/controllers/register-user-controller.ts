import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CreateUserUseCase } from '../../../domain/user/use-cases/create-user';
import { PrismaUserRepository } from '../../../infrastructure/user/repositories/PrismaUserRepository';
import { SecurityServiceImplementation } from '../../../infrastructure/user/services/SecurityServiceImplementation';

const registerUserValidationSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = registerUserValidationSchema.parse(req.body);

    const userRepository = new PrismaUserRepository();
    const securityService = new SecurityServiceImplementation();

    const createUserUseCase = new CreateUserUseCase(userRepository, securityService);

    await createUserUseCase.execute({
      email,
      password,
    });

    res.status(201).json({
      message: 'User created succesfully',
    });
  } catch (error) {
    next(error);
  }
};
