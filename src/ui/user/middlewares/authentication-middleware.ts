import { Request, Response, NextFunction } from 'express';
import { SecurityServiceImplementation } from '../../../infrastructure/user/services/SecurityServiceImplementation';

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: 'Token not in request' });
    return;
  }

  const sanitizedToken = token.replace('Bearer ', '');
  const securityService = new SecurityServiceImplementation();
  const decodedToken = securityService.verifyJwt(sanitizedToken);

  if (!decodedToken) {
    res.status(401).json({ error: 'Token not valid' });
    return;
  }

  req.userId = decodedToken.userId;

  next();
};
