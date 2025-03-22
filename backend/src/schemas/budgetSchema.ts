// import { z } from 'zod';

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

import { z } from 'zod';

// Schema for creating a budget (POST /budget)
export const createBudgetSchema = {
  body: z.object({
    budgets: z.array(
      z.object({
        title: z.string().min(3, 'Title must be at least 3 characters long'),
        budget: z.number().min(1, 'Budget must be at least $1'),
      })
    ),
  }),
};

// Schema for updating a budget
export const updateBudgetSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid budget ID'), // Ensure ID is a number
  }),
  body: z.object({
    title: z.string().min(3).optional(), // Title can be changed, but not removed
    budget: z.number().min(1).optional(), // Budget can be updated, but must be at least $1
  }),
};

// Schema for validating URL params
export const paramsSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid budget ID'), // Ensure ID is a number
  }),
};
