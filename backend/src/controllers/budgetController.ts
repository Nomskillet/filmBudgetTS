import { Request, Response } from "express";
import {
  addBudgetToDB,
  getBudgetsFromDB,
  updateBudgetSpent,
  deleteBudgetFromDB,
  Budget,
} from "../services/budgetService";
import { catchAsync } from "../utils/catchAsync"; // Import the async wrapper

//Fetch all budgets
export const getBudgets = catchAsync(async (req: Request, res: Response) => {
  const budgets: Budget[] = await getBudgetsFromDB();
  res.json(budgets);
});

//Add a new budget
export const addBudget = catchAsync(async (req: Request, res: Response) => {
  const { title, budget }: { title: string; budget: number } = req.body;

  if (!title || budget === undefined || isNaN(budget) || budget <= 0) {
    res.status(400).json({ error: "Title is required and budget must be a positive number" });
    return;
  }

  const newBudget: Budget = await addBudgetToDB(title, budget);
  res.status(201).json(newBudget);
});

//Update spent amount
export const updateBudget = catchAsync(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const { spent }: { spent: number } = req.body;

  if (!id || spent === undefined) {
    res.status(400).json({ error: "Budget ID and spent amount are required" });
    return;
  }

  const updatedBudget = await updateBudgetSpent(id, spent);
  res.json(updatedBudget);
});

//Delete a budget
export const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);

  if (!id) {
    res.status(400).json({ error: "Budget ID is required" });
    return;
  }

  await deleteBudgetFromDB(id);
  res.status(204).send();
});
