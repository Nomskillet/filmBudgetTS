'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const zod_1 = require('zod');
// ✅ Validation middleware using Zod
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Throws error if validation fails
    next(); // Proceed if valid
  } catch (err) {
    if (err instanceof zod_1.ZodError) {
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
exports.default = validate;
