import { z } from 'zod';

// ✅ Schema for an array of budgets
export const createBudgetSchema = z.object({
  budgets: z.array(
    z.object({
      title: z.string().min(3, 'Title must be at least 3 characters'),
      budget: z
        .number({ invalid_type_error: 'Budget must be a number' })
        .positive('Budget must be greater than 0'),
    })
  ),
});

export const updateBudgetSchema = z.object({
  title: z.string().optional(),
  budget: z.number().positive('Budget must be greater than 0').optional(),
});
