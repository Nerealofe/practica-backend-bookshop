import { Router } from 'express';
import { registerUserController } from '../controllers/register-user-controller';

export const userRouter = Router();
userRouter.post('/signup', registerUserController);
