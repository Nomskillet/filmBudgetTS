import pool from "../db";

export interface Budget {
  id: number;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  created_at: Date;
}

// Service function to fetch all budgets
export const getBudgetsFromDB = () =>
  pool.query<Budget>("SELECT * FROM budgets").then((result) => result.rows);

// Service function to add a budget
export const addBudgetToDB = (title: string, budget: number) =>
  pool
    .query<Budget>(
      "INSERT INTO budgets (title, budget, spent) VALUES ($1, $2, $3) RETURNING *",
      [title, budget, 0]
    )
    .then((result) => result.rows[0]);

// Service function to edit budgets
export const updateBudgetSpent = (id: number, spent: number) =>
  pool
    .query<Budget>("UPDATE budgets SET spent = $1 WHERE id = $2 RETURNING *", [
      spent,
      id,
    ])
    .then((result) => result.rows[0]);

export const deleteBudgetFromDB = (id: number) =>
  pool.query("DELETE FROM budgets WHERE id = $1", [id]).then(() => null);
