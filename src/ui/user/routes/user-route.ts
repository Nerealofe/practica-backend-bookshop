import { Router, Request } from 'express';
import { registerUserController } from '../controllers/register-user-controller';
import { loginUserController } from '../controllers/login-user-controller';
import { authenticationMiddleware } from '../middlewares/authentication-middleware';

export const userRouter = Router();
userRouter.post('/signup', registerUserController);
userRouter.post('/signin', loginUserController);
userRouter.get('/me', authenticationMiddleware, (req, res) => {
  res.status(200).json({
    userId: (req as Request & { userId?: number }).userId,
  });
});
