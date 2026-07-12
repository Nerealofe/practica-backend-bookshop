import { Router } from 'express';
import { authenticationMiddleware } from '../../user/middlewares/authentication-middleware';
import { createBookController } from '../controllers/create-book-controller';
import { findBooksController } from '../controllers/find-books-controller';
import { buyBookController } from '../controllers/buy-book-controller';
import { updateBookController } from '../controllers/update-book-controller';

export const booksRouter = Router();

booksRouter.get('/', findBooksController);
booksRouter.post('/', authenticationMiddleware, createBookController);
booksRouter.post('/:id/buy', authenticationMiddleware, buyBookController);
booksRouter.put('/:id', authenticationMiddleware, updateBookController);
