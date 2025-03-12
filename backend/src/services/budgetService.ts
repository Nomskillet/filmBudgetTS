import pool from '../db';

export interface Budget {
  id: number;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  created_at: Date;
}

// Fetch budgets for a specific user
export const getBudgetsFromDB = (userId: number) =>
  pool
    .query<Budget>(
      `SELECT id, title, budget, spent, (budget - spent) AS remaining, created_at 
       FROM budgets 
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    )
    .then((result) => result.rows);

// Add multiple budgets for a specific user
export const addBudgetsToDB = async (
  budgets: { title: string; budget: number }[],
  userId: number
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // ✅ Start transaction

    for (const budget of budgets) {
      await client.query(
        'INSERT INTO budgets (title, budget, user_id) VALUES ($1, $2, $3)',
        [budget.title, budget.budget, userId]
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

// Update spent amount for a budget that belongs to the user
export const updateBudgetSpent = (id: number, spent: number, userId: number) =>
  pool
    .query<Budget>(
      `UPDATE budgets 
       SET spent = spent + $1 
       WHERE id = $2 AND user_id = $3
       RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at`,
      [spent, id, userId]
    )
    .then((result) => result.rows[0]);

// ✅ Delete a budget only if it belongs to the user
export const deleteBudgetFromDB = (id: number, userId: number) =>
  pool
    .query<Budget>(
      `DELETE FROM budgets 
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at`,
      [id, userId]
    )
    .then((result) => result.rows[0]);

// ✅ Fetch items for a specific budget that belongs to the user
export const getBudgetItemsFromDB = (budgetId: number, userId: number) =>
  pool
    .query(
      `SELECT id, budget_id, description, amount, created_at 
       FROM budget_items 
       WHERE budget_id = $1 AND budget_id IN 
         (SELECT id FROM budgets WHERE user_id = $2) 
       ORDER BY created_at DESC`,
      [budgetId, userId]
    )
    .then((result) => result.rows);
