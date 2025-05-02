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
      `SELECT id, title, budget, spent, (budget - spent) AS remaining, created_at, owner, responsible, stage
 FROM budgets 
 WHERE user_id = $1
 ORDER BY created_at DESC`,
      [userId]
    )
    .then((result) => result.rows);

// Add multiple budgets for a specific user
export const addBudgetsToDB = async (
  budgets: {
    title: string;
    budget: number;
    owner?: string;
    responsible?: string;
    stage?: string;
  }[],
  userId: number
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const budget of budgets) {
      await client.query(
        `INSERT INTO budgets (title, budget, spent, user_id, owner, responsible, stage) 
         VALUES ($1, $2, 0, $3, $4, $5, $6)`,
        [
          budget.title,
          budget.budget,
          userId,
          budget.owner || null,
          budget.responsible || null,
          budget.stage || 'pre-production',
        ]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Update budget (title, budget, spent) for a user
export const updateBudgetInDB = async (
  id: number,
  title: string,
  budget: number,
  spent: number,
  owner: string,
  responsible: string,
  stage: string,
  userId: number
) => {
  const result = await pool.query<Budget>(
    `UPDATE budgets 
     SET title = $1, budget = $2, spent = $3, owner = $4, responsible = $5, stage = $6
     WHERE id = $7 AND user_id = $8
     RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at, owner, responsible, stage`,
    [title, budget, spent, owner, responsible, stage, id, userId]
  );

  return result.rows[0];
};

// Delete a budget only if it belongs to the user
export const deleteBudgetFromDB = (id: number, userId: number) =>
  pool
    .query<Budget>(
      `DELETE FROM budgets 
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at`,
      [id, userId]
    )
    .then((result) => result.rows[0]);

// ✅ FIXED: Fetch expenses (NOT budget_items)
export const getBudgetItemsFromDB = (budgetId: number, userId: number) =>
  pool
    .query(
      `SELECT id, title, budget, spent, (budget - spent) AS remaining, created_at, owner, responsible
      FROM budgets 
      WHERE user_id = $1
      ORDER BY created_at DESC
`,
      [budgetId, userId]
    )
    .then((result) => {
      return result.rows;
    });

// Add an expense to the database
export const addExpenseToDB = (
  budgetId: number,
  description: string,
  amount: number,
  owner: string,
  responsible: string,
  place_of_purchase: string,
  purchase_date: number, // epoch timestamp
  note: string,
  receipt_image_url: string
) =>
  pool.query(
    `INSERT INTO expenses (
  budget_id, description, amount, owner, responsible, place_of_purchase, purchase_date, note, receipt_image_url
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      budgetId,
      description,
      amount,
      owner,
      responsible,
      place_of_purchase,
      purchase_date ? new Date(purchase_date).toISOString() : null,
      note,
      receipt_image_url,
    ]
  );

// Get all expenses for a budget
export const getExpensesFromDB = (budgetId: number) =>
  pool
    .query(
      `SELECT id, description, amount, created_at, owner, responsible, place_of_purchase, purchase_date, note
       FROM expenses 
       WHERE budget_id = $1 AND deleted = FALSE
       ORDER BY created_at DESC`,
      [budgetId]
    )
    .then((result) => result.rows);

// Update an expense in the database
export const updateExpenseInDB = async (
  expenseId: number,
  description: string,
  amount: number,
  owner?: string,
  responsible?: string,
  place_of_purchase?: string,
  purchase_date?: number,
  note?: string,
  receipt_image_url?: string // ✅ NEW ARGUMENT
) => {
  const result = await pool.query(
    `UPDATE expenses 
     SET description = $1,
         amount = $2,
         owner = $3,
         responsible = $4,
         place_of_purchase = $5,
         purchase_date = $6,
         note = $7,
         receipt_image_url = $8 -- ✅ NEW FIELD
     WHERE id = $9
     RETURNING *`,
    [
      description,
      amount,
      owner,
      responsible,
      place_of_purchase,
      purchase_date ? new Date(purchase_date).toISOString() : null,
      note,
      receipt_image_url, // ✅ NEW VALUE
      expenseId,
    ]
  );

  return result.rows[0];
};
