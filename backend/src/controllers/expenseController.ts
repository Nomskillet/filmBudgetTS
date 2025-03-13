import { Request, Response } from 'express';
import { addExpenseToDB, getExpensesFromDB } from '../services/budgetService';
import catchAsync from '../middlewares/catchAsync';

// ✅ Add a new expense
export const addExpense = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { budgetId, description, amount } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!budgetId || !description || !amount) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  await addExpenseToDB(budgetId, description, amount);
  res.status(201).json({ message: 'Expense added successfully' });
});

// ✅ Get all expenses for a budget
export const getExpenses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const budgetId = parseInt(req.params.budgetId, 10);

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (isNaN(budgetId)) {
    res.status(400).json({ error: 'Invalid budget ID' });
    return;
  }

  const expenses = await getExpensesFromDB(budgetId);
  res.json(expenses);
});
