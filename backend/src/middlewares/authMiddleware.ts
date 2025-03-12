import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    user?: DecodedUser;
  }
}

interface DecodedUser {
  id: number;
  email?: string; // Optional in case it's not in the token
}

const JWT_SECRET = process.env.JWT_SECRET!;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser | undefined;

  if (!decoded) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }

  req.user = decoded; // ✅ Now matches the updated interface
  next();
};

export default authMiddleware;
