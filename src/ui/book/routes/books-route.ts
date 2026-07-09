import { Router } from 'express';
import { authenticationMiddleware } from '../../user/middlewares/authentication-middleware';
import { createBookController } from '../controllers/create-book-controller';

export const booksRouter = Router();

booksRouter.post('/', authenticationMiddleware, createBookController);
