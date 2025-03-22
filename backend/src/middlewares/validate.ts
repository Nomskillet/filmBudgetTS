// import { Request, Response, NextFunction } from 'express';
// import { AnyZodObject, ZodError } from 'zod';

// // ✅ Validation middleware using Zod
// const validate =
//   (schema: AnyZodObject) =>
//   (req: Request, res: Response, next: NextFunction): void => {
//     try {
//       schema.parse(req.body); // Throws error if validation fails
//       next(); // Proceed if valid
//     } catch (err) {
//       if (err instanceof ZodError) {
//         // Send validation error response
//         res.status(400).json({
//           success: false,
//           errors: err.errors,
//         });
//         return;
//       }
//       next(err); // Forward other errors
//     }
//   };

// export default validate;

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// ✅ Allow validation for body, query, and params independently
const validate =
  (schema: {
    body?: AnyZodObject;
    query?: AnyZodObject;
    params?: AnyZodObject;
  }) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.query) schema.query.parse(req.query);
      if (schema.params) schema.params.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: err.flatten(),
        });
        return;
      }
      next(err);
    }
  };

export default validate;
