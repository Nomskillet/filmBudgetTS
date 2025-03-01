import pool from "../db";

export interface Budget {
  id: number;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  created_at: Date;
}

//Fetch all budgets
export const getBudgetsFromDB = async () => {
  const result = await pool.query<Budget>("SELECT * FROM budgets ORDER BY created_at DESC");
  return result.rows;
};

//Add a budget to the database
export const addBudgetToDB = async (title: string, budget: number) => {
  const result = await pool.query<Budget>(
    "INSERT INTO budgets (title, budget, spent) VALUES ($1, $2, $3) RETURNING *",
    [title, budget, 0]
  );
  return result.rows[0];
};

//Update spent amount and calculate remaining budget
export const updateBudgetSpent = async (id: number, spent: number) => {
  const result = await pool.query<Budget>(
    `UPDATE budgets 
     SET spent = spent + $1, 
         remaining = remaining - $1 
     WHERE id = $2 
     RETURNING *`,
    [spent, id]
  );
  return result.rows[0];
};

//Delete a budget
export const deleteBudgetFromDB = async (id: number) => {
  await pool.query("DELETE FROM budgets WHERE id = $1", [id]);
};
