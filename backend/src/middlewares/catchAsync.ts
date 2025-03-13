import { Request, Response, NextFunction } from 'express';

// ✅ Ensure the return type is correct
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

export default catchAsync;
