import { Request, Response } from 'express';
import {
  addBudgetsToDB,
  getBudgetsFromDB,
  updateBudgetSpent,
  deleteBudgetFromDB,
  getBudgetItemsFromDB,
} from '../services/budgetService';
import catchAsync from '../middlewares/catchAsync'; // Import catchAsync

// Get all budgets
export const getBudgets = catchAsync(async (req: Request, res: Response) => {
  const budgets = await getBudgetsFromDB();
  res.json(budgets); // ✅ Always returns an array, even if empty
});

// Add multiple budgets
export const addBudgets = catchAsync(async (req: Request, res: Response) => {
  const budgets = req.body.budgets;

  if (!budgets || !Array.isArray(budgets) || budgets.length === 0) {
    res.status(400).json({ error: 'Invalid or missing budgets array' });
    return;
  }

  await addBudgetsToDB(budgets);
  res.status(201).json({ message: 'Budgets added successfully' });
});

// Update budget
export const updateBudget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { spent } = req.body;

  const updatedBudget = await updateBudgetSpent(Number(id), spent);
  res.json(updatedBudget ? [updatedBudget] : []); // Return an array, even if empty
});

// Delete budget
export const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteBudgetFromDB(Number(id));
  res.status(204).send();
});

// Get budget items for a specific budget
export const getBudgetItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  const budgetId = parseInt(req.params.budgetId, 10);

  if (isNaN(budgetId)) {
    res.status(400).json({ error: 'Invalid budget ID' });
    return;
  }

  const items = await getBudgetItemsFromDB(budgetId);
  res.json(items);
};
