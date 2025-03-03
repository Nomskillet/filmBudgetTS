import pool from '../db';

export interface Budget {
  id: number;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  created_at: Date;
}

// Fetch all budgets with specific columns only
export const getBudgetsFromDB = () =>
  pool
    .query<Budget>(
      'SELECT id, title, budget, spent, (budget - spent) AS remaining, created_at FROM budgets ORDER BY created_at DESC'
    )
    .then((result) => result.rows);

//  Add multiple budgets to the database
export const addBudgetsToDB = async (
  budgets: { title: string; budget: number }[]
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // ✅ Start transaction

    for (const budget of budgets) {
      await client.query(
        'INSERT INTO budgets (title, budget) VALUES ($1, $2)',
        [budget.title, budget.budget]
      );
    }

    await client.query('COMMIT'); // ✅ Commit transaction if all inserts succeed
  } catch (err) {
    await client.query('ROLLBACK'); // ✅ Rollback if any insert fails
    throw err;
  } finally {
    client.release(); // ✅ Release client back to pool
  }
};

// Update spent amount and return specific columns
export const updateBudgetSpent = (id: number, spent: number) =>
  pool
    .query<Budget>(
      `UPDATE budgets 
       SET spent = spent + $1 
       WHERE id = $2 
       RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at`,
      [spent, id]
    )
    .then((result) => result.rows[0]);

// ✅ Delete a budget and return deleted budget details
export const deleteBudgetFromDB = (id: number) =>
  pool
    .query<Budget>(
      'DELETE FROM budgets WHERE id = $1 RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at',
      [id]
    )
    .then((result) => result.rows[0]);

// ✅ Fetch items for a specific budget
export const getBudgetItemsFromDB = (budgetId: number) =>
  pool
    .query(
      `SELECT id, budget_id, description, amount, created_at FROM budget_items WHERE budget_id = $1 ORDER BY created_at DESC`,
      [budgetId]
    )
    .then((result) => result.rows);
