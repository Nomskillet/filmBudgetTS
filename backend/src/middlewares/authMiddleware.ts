import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    user?: { id: number; email?: string };
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('🔐 Incoming request headers:', req.headers);

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    console.log('❌ No token found in Authorization header');
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as
      | { id: number; email?: string }
      | undefined;

    console.log('Decoded token:', decoded);

    if (!decoded || !decoded.id) {
      console.log('Decoded token is invalid or missing ID');
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    req.user = { id: decoded.id, email: decoded.email ?? '' };
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
