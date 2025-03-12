import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    user?: { id: number; email?: string };
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as
    | { id: number; email?: string }
    | undefined;

  if (!decoded?.id) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }

  req.user = { id: decoded.id, email: decoded.email };
  next();
};

export default authMiddleware;
