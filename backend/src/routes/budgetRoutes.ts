import { Router } from 'express';
import {
  getBudgets,
  addBudgets,
  updateBudget,
  deleteBudget,
  getBudgetItems,
} from '../controllers/budgetController';
import validate from '../middlewares/validate';
import {
  createBudgetSchema,
  updateBudgetSchema,
} from '../schemas/budgetSchema';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// ✅ Protect all routes with authMiddleware
router.get('/budgets', authMiddleware, getBudgets);
router.post(
  '/budget',
  authMiddleware,
  validate(createBudgetSchema),
  addBudgets
);
router.patch(
  '/budget/:id',
  authMiddleware,
  validate(updateBudgetSchema),
  updateBudget
);
router.delete('/budget/:id', authMiddleware, deleteBudget);
router.get('/budgets/:budgetId/items', authMiddleware, getBudgetItems);

export default router;
