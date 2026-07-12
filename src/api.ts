import express from 'express';
import { userRouter } from './ui/user/routes/user-route';
import { errorHandlerMiddleware } from './ui/shared/middlewares/error-handler-middleware';
import { booksRouter } from './ui/book/routes/books-route';
import { meBooksRouter } from './ui/book/routes/me-books-route';

const api = express();

api.use(express.json());

api.use('/authentication', userRouter);
api.use('/books', booksRouter);

api.use(errorHandlerMiddleware);
api.use('/me', meBooksRouter);

export { api };
