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

  // 💡 Now accepting metadata
  const {
    description,
    amount,
    owner,
    responsible,
    place_of_purchase,
    purchase_date,
    note,
    receipt_image_url,
  } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!budgetId || !description || !amount) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // 👉 Call service with full metadata
  await addExpenseToDB(
    budgetId,
    description,
    amount,
    owner,
    responsible,
    place_of_purchase,
    purchase_date,
    note,
    receipt_image_url
  );

  await pool.query(`UPDATE budgets SET spent = spent + $1 WHERE id = $2`, [
    amount,
    budgetId,
  ]);

  res.status(201).json({ message: 'Expense added successfully' });
});

// Get all expenses for a budget
export const getExpenses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const budgetIdParam = req.params.budgetId;

  if (budgetIdParam) {
    const budgetId = parseInt(budgetIdParam, 10);
    if (isNaN(budgetId)) {
      res.status(400).json({ error: 'Invalid budget ID' });
      return;
    }

    const expenses = await getExpensesFromDB(budgetId);
    return res.json(expenses);
  }

  // ✅ No budgetId param: fetch all expenses
  const allExpenses = await pool.query('SELECT * FROM expenses');
  res.json(allExpenses.rows);
});

export const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const expenseId = parseInt(req.params.expenseId, 10);
  const {
    description,
    amount,
    owner,
    responsible,
    place_of_purchase,
    purchase_date,
    note,
    receipt_image_url,
  } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (isNaN(expenseId) || !description || !amount) {
    res.status(400).json({ error: 'Invalid input data' });
    return;
  }

  // Get the current expense amount before updating
  const expenseResult = await pool.query(
    `SELECT amount, budget_id FROM expenses WHERE id = $1`,
    [expenseId]
  );

  if (expenseResult.rows.length === 0) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  const { amount: oldAmount, budget_id } = expenseResult.rows[0];

  // Update the expense
  const updatedExpense = await updateExpenseInDB(
    expenseId,
    description,
    amount,
    owner,
    responsible,
    place_of_purchase,
    purchase_date,
    note,
    receipt_image_url
  );

  if (!updatedExpense) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  // Adjust the "spent" column based on the difference in amounts
  const amountDifference = amount - oldAmount;

  await pool.query(`UPDATE budgets SET spent = spent + $1 WHERE id = $2`, [
    amountDifference,
    budget_id,
  ]);

  //  Send the updated expense
  res.json(updatedExpense);
});

// ✅ Add a new delete function
export const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const expenseId = parseInt(req.params.expenseId, 10);

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (isNaN(expenseId)) {
    res.status(400).json({ error: 'Invalid expense ID' });
    return;
  }

  //  Get the expense details (amount & budget_id)
  const expenseResult = await pool.query(
    `SELECT amount, budget_id FROM expenses WHERE id = $1`,
    [expenseId]
  );

  if (expenseResult.rows.length === 0) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  const { amount, budget_id } = expenseResult.rows[0];

  await pool.query(`UPDATE expenses SET deleted = TRUE WHERE id = $1`, [
    expenseId,
  ]);

  await pool.query(`UPDATE budgets SET spent = spent - $1 WHERE id = $2`, [
    amount,
    budget_id,
  ]);

  res.json({ message: 'Expense deleted successfully' });
});
