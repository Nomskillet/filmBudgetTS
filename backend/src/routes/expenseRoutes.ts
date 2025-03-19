import { Router } from 'express';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/expenses/:budgetId', authMiddleware, getExpenses);
router.post('/budget/:budgetId/expense', authMiddleware, addExpense);
router.patch('/expense/:expenseId', authMiddleware, updateExpense);
router.delete('/expense/:expenseId', authMiddleware, deleteExpense);

export default router;
