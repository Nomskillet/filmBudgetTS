import { Request, Response } from "express";
import {
  addBudgetToDB,
  getBudgetsFromDB,
  Budget,
} from "../services/budgetService";
import { updateBudgetSpent } from "../services/budgetService";
import { deleteBudgetFromDB } from "../services/budgetService";

// Controller function to fetch all budgets
export const getBudgets = (req: Request, res: Response): void => {
  getBudgetsFromDB()
    .then((budgets: Budget[]) => res.json(budgets))
    .catch((error: Error) => {
      console.error("Error fetching budgets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

// Controller function to add a budget
export const addBudget = (req: Request, res: Response): void => {
  const { title, budget }: { title: string; budget: number } = req.body;

  if (!title || !budget) {
    res.status(400).json({ error: "Title and budget are required" });
    return;
  }

  addBudgetToDB(title, budget)
    .then((newBudget: Budget) => res.status(201).json(newBudget))
    .catch((error: Error) => {
      console.error("Error inserting budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

export const updateBudget = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);
  const { spent }: { spent: number } = req.body;

  if (!id || spent === undefined) {
    res.status(400).json({ error: "Budget ID and spent amount are required" });
    return;
  }

  updateBudgetSpent(id, spent)
    .then((updatedBudget) => res.json(updatedBudget))
    .catch((error: Error) => {
      console.error("Error updating budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

export const deleteBudget = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);

  if (!id) {
    res.status(400).json({ error: "Budget ID is required" });
    return;
  }

  deleteBudgetFromDB(id)
    .then(() => res.status(204).send()) // No content response
    .catch((error) => {
      console.error("Error deleting budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
