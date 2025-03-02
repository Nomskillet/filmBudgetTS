import { Request, Response, NextFunction } from "express";
import {
  addBudgetsToDB,
  getBudgetsFromDB,
  updateBudgetSpent,
  deleteBudgetFromDB,
  Budget,
} from "../services/budgetService";

// ✅ Get all budgets (returns an array)
export const getBudgets = async (req: Request, res: Response): Promise<void> => {
  const budgets = await getBudgetsFromDB();
  res.json([budgets]);  // 🔄 Wrap in an array
};

// ✅ Add multiple budgets (returns an array)
export const addBudgets = async (req: Request, res: Response): Promise<void> => {
  const budgets = req.body.budgets;

  if (!budgets || !Array.isArray(budgets) || budgets.length === 0) {
    res.status(400).json([{ error: "Invalid or missing budgets array" }]);  // 🔄 Wrap error in an array
    return;
  }

  await addBudgetsToDB(budgets);
  res.status(201).json([{ message: "Budgets added successfully" }]);  // 🔄 Wrap success message in an array
};

// ✅ Update budget (returns an array)
export const updateBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { spent } = req.body;
  const updatedBudget = await updateBudgetSpent(Number(id), spent);
  res.json([updatedBudget]);  // 🔄 Wrap in an array
};

// ✅ Delete budget (returns an array with message)
export const deleteBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  await deleteBudgetFromDB(Number(id));
  res.status(204).json([{ message: "Budget deleted successfully" }]);  // 🔄 Wrap in an array
};
