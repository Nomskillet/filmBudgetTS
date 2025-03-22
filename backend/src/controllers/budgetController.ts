import { Request, Response, NextFunction } from 'express';
import {
  addBudgetsToDB,
  getBudgetsFromDB,
  updateBudgetInDB,
  deleteBudgetFromDB,
  getBudgetItemsFromDB,
} from '../services/budgetService';
import catchAsync from '../middlewares/catchAsync';

// Get budgets for the logged-in user
export const getBudgets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const budgets = await getBudgetsFromDB(userId);
  res.json(budgets);
};

// Add budgets & link them to the logged-in user
export const addBudgets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
};

// Update a budget only if it belongs to the user
export const updateBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, budget } = req.body; // No longer expecting "spent" from frontend

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Fetch the current spent amount from the database
  const existingBudgets = await getBudgetsFromDB(userId);
  const existingBudget = existingBudgets.find((b) => b.id === Number(id));

  if (!existingBudget) {
    res.status(404).json({ error: 'Budget not found' });
    return;
  }

  // Use the existing spent value when updating
  const updatedBudget = await updateBudgetInDB(
    Number(id),
    title,
    budget,
    existingBudget.spent, // Keep the current spent value
    userId
  );

  if (!updatedBudget) {
    res.status(403).json({
      error: 'Forbidden: Budget not found or does not belong to you',
    });
    return;
  }

  res.json([updatedBudget]);
};

// Delete a budget only if it belongs to the user
export const deleteBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const deletedBudget = await deleteBudgetFromDB(Number(id), userId);
  if (!deletedBudget) {
    res.status(403).json({
      error: 'Forbidden: Budget not found or does not belong to you',
    });
    return;
  }

  res.status(204).send();
};

// Get budget items only for a budget that belongs to the user
export const getBudgetItems = async (req: Request, res: Response) => {
  const userId = req.user?.id; // Get user ID from request
  const budgetId = parseInt(req.params.budgetId, 10); // Get budget ID from URL

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
};
