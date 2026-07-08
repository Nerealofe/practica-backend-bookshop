import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { BusinessConflictError } from '../../../domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '../../../domain/errors/EntityNotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';

export const errorHandlerMiddleware = (error: unknown, req: Request, res: Response) => {
  console.error(error);

  if (error instanceof EntityNotFoundError) {
    res.status(404).json({ error: error.message });
  } else if (error instanceof BusinessConflictError) {
    res.status(409).json({ error: error.message });
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ZodError) {
    res.status(400).json({ error: error.issues[0].message });
  } else {
    res.status(500).json({ error: String(error) });
  }
};
