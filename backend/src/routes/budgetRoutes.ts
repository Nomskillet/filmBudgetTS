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

const router = Router();

router.get('/budgets', getBudgets);
router.post('/budget', validate(createBudgetSchema), addBudgets);
router.patch('/budget/:id', validate(updateBudgetSchema), updateBudget);
router.delete('/budget/:id', deleteBudget);
router.get('/budgets/:budgetId/items', getBudgetItems);

export default router;
