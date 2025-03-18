import { Router } from 'express';
import {
  addExpense,
  getExpenses,
  updateExpense,
} from '../controllers/expenseController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/expenses/:budgetId', authMiddleware, getExpenses);
router.post('/budget/:budgetId/expense', authMiddleware, addExpense);
router.patch('/expense/:expenseId', authMiddleware, updateExpense);

export default router;
