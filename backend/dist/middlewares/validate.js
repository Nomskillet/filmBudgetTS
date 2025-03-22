'use strict';
// import { Request, Response, NextFunction } from 'express';
// import { AnyZodObject, ZodError } from 'zod';
Object.defineProperty(exports, '__esModule', { value: true });
const zod_1 = require('zod');
// ✅ Allow validation for body, query, and params independently
const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) schema.body.parse(req.body);
    if (schema.query) schema.query.parse(req.query);
    if (schema.params) schema.params.parse(req.params);
    next();
  } catch (err) {
    if (err instanceof zod_1.ZodError) {
      res.status(400).json({
        success: false,
        errors: err.flatten(),
      });
      return;
    }
    next(err);
  }
};
exports.default = validate;
