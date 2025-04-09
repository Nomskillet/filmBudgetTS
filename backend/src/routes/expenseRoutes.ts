import { Router } from 'express';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/expenses', authMiddleware, getExpenses);
router.get('/expenses/:budgetId', authMiddleware, getExpenses);
router.post('/budget/:budgetId/expense', authMiddleware, addExpense);
router.patch('/expenses/:budgetId/:expenseId', authMiddleware, updateExpense);

router.delete('/expenses/:budgetId/:expenseId', authMiddleware, deleteExpense);

export default router;
