import { Router } from 'express';
import { authenticationMiddleware } from '../../user/middlewares/authentication-middleware';
import { findMyBooksController } from '../controllers/find-my-books-controller';

export const meBooksRouter = Router();
meBooksRouter.get('/books', authenticationMiddleware, findMyBooksController);
