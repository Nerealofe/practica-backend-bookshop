import { Router } from 'express';
import { authenticationMiddleware } from '../../user/middlewares/authentication-middleware';
import { createBookController } from '../controllers/create-book-controller';
import { findBooksController } from '../controllers/find-books-controller';

export const booksRouter = Router();

booksRouter.get('/', findBooksController);
booksRouter.post('/', authenticationMiddleware, createBookController);
