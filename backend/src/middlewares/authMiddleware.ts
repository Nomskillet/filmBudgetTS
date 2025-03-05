import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedUser {
  id: number;
  username: string;
  email: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    req.user = decoded; // ✅ Attach user with proper type
    next(); // ✅ Call next() without returning a response
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
