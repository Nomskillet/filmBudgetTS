"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBudgetSchema = exports.createBudgetSchema = void 0;
const zod_1 = require("zod");
// ✅ Schema for an array of budgets
exports.createBudgetSchema = zod_1.z.object({
    budgets: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
        budget: zod_1.z
            .number({ invalid_type_error: 'Budget must be a number' })
            .positive('Budget must be greater than 0'),
    })),
});
exports.updateBudgetSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    budget: zod_1.z.number().positive('Budget must be greater than 0').optional(),
});
