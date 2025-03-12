import { Request, Response } from 'express';
import {
  addBudgetsToDB,
  getBudgetsFromDB,
  updateBudgetSpent,
  deleteBudgetFromDB,
  getBudgetItemsFromDB,
} from '../services/budgetService';
import catchAsync from '../middlewares/catchAsync';

// Get budgets for the logged-in user
export const getBudgets = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const budgets = await getBudgetsFromDB(userId);
  res.json(budgets);
});

// Add budgets & link them to the logged-in user
export const addBudgets = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const budgets = req.body.budgets;

  if (!budgets || !Array.isArray(budgets) || budgets.length === 0) {
    res.status(400).json({ error: 'Invalid or missing budgets array' });
    return;
  }

  await addBudgetsToDB(budgets, userId);
  res.status(201).json({ message: 'Budgets added successfully' });
});

// Update a budget only if it belongs to the user
export const updateBudget = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { spent } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const updatedBudget = await updateBudgetSpent(Number(id), spent, userId);

  if (!updatedBudget) {
    res
      .status(403)
      .json({ error: 'Forbidden: Budget not found or does not belong to you' });
    return;
  }

  res.json([updatedBudget]);
});

// Delete a budget only if it belongs to the user
export const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const deletedBudget = await deleteBudgetFromDB(Number(id), userId);

  if (!deletedBudget) {
    res
      .status(403)
      .json({ error: 'Forbidden: Budget not found or does not belong to you' });
    return;
  }

  res.status(204).send();
});

// Get budget items only for a budget that belongs to the user
export const getBudgetItems = catchAsync(
  async (req: Request, res: Response) => {
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

    const items = await getBudgetItemsFromDB(budgetId, userId);
    res.json(items);
  }
);
