import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

// ✅ Validation middleware using Zod
const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse(req.body); // Throws error if validation fails
    next(); // Proceed if valid
  } catch (err) {
    if (err instanceof ZodError) {
      // Send validation error response
      res.status(400).json({
        success: false,
        errors: err.errors,
      });
      return;
      
    }
    next(err); // Forward other errors
  }
};

export default validate;


