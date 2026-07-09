import express from 'express';
import { userRouter } from './ui/user/routes/user-route';
import { errorHandlerMiddleware } from './ui/shared/middlewares/error-handler-middleware';
import { booksRouter } from './ui/book/routes/books-route';

const api = express();

api.use(express.json());

api.use('/authentication', userRouter);
api.use('/books', booksRouter);

api.use(errorHandlerMiddleware);

export { api };
