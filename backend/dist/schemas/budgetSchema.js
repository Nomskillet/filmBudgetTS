'use strict';
// import { z } from 'zod';
Object.defineProperty(exports, '__esModule', { value: true });
exports.paramsSchema =
  exports.updateBudgetSchema =
  exports.createBudgetSchema =
    void 0;
// // ✅ Schema for an array of budgets
// export const createBudgetSchema = z.object({
//   budgets: z.array(
//     z.object({
//       title: z.string().min(3, 'Title must be at least 3 characters'),
//       budget: z
//         .number({ invalid_type_error: 'Budget must be a number' })
//         .positive('Budget must be greater than 0'),
//     })
//   ),
// });
// export const updateBudgetSchema = z.object({
//   title: z.string().optional(),
//   budget: z.number().positive('Budget must be greater than 0').optional(),
// });
const zod_1 = require('zod');
// Schema for creating a budget (POST /budget)
exports.createBudgetSchema = {
  body: zod_1.z.object({
    budgets: zod_1.z.array(
      zod_1.z.object({
        title: zod_1.z
          .string()
          .min(3, 'Title must be at least 3 characters long'),
        budget: zod_1.z.number().min(1, 'Budget must be at least $1'),
      })
    ),
  }),
};
// Schema for updating a budget
exports.updateBudgetSchema = {
  params: zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, 'Invalid budget ID'), // Ensure ID is a number
  }),
  body: zod_1.z.object({
    title: zod_1.z.string().min(3).optional(), // Title can be changed, but not removed
    budget: zod_1.z.number().min(1).optional(), // Budget can be updated, but must be at least $1
  }),
};
// Schema for validating URL params
exports.paramsSchema = {
  params: zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, 'Invalid budget ID'), // Ensure ID is a number
  }),
};
