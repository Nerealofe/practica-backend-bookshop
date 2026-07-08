import express from 'express';
import { userRouter } from './ui/user/routes/user-route';

const api = express();
api.use(express.json());
api.use('/authentication', userRouter);
export { api };
