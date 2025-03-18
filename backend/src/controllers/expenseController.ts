import { Request, Response } from 'express';
import {
  addExpenseToDB,
  getExpensesFromDB,
  updateExpenseInDB,
} from '../services/budgetService';
import catchAsync from '../middlewares/catchAsync';
import pool from '../db';

// Add a new expense
export const addExpense = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const budgetId = parseInt(req.params.budgetId, 10);
  const { description, amount } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!budgetId || !description || !amount) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  await addExpenseToDB(budgetId, description, amount);

  await pool.query(`UPDATE budgets SET spent = spent + $1 WHERE id = $2`, [
    amount,
    budgetId,
  ]);

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

// Update an existing expense
export const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const expenseId = parseInt(req.params.expenseId, 10);
  const { description, amount } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (isNaN(expenseId) || !description || !amount) {
    res.status(400).json({ error: 'Invalid input data' });
    return;
  }

  const updatedExpense = await updateExpenseInDB(
    expenseId,
    description,
    amount
  );

  if (!updatedExpense) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  res.json(updatedExpense);
});
