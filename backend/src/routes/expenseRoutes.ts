import { Router } from 'express';
import { addExpense, getExpenses } from '../controllers/expenseController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/expense', authMiddleware, addExpense); // ✅ Add a new expense
router.get('/budget/:budgetId/expenses', authMiddleware, getExpenses); // ✅ Get all expenses for a budget

export default router;
