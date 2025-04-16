'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.updateExpenseInDB =
  exports.getExpensesFromDB =
  exports.addExpenseToDB =
  exports.getBudgetItemsFromDB =
  exports.deleteBudgetFromDB =
  exports.updateBudgetInDB =
  exports.addBudgetsToDB =
  exports.getBudgetsFromDB =
    void 0;
const db_1 = __importDefault(require('../db'));
// Fetch budgets for a specific user
const getBudgetsFromDB = (userId) =>
  db_1.default
    .query(
      `SELECT id, title, budget, spent, (budget - spent) AS remaining, created_at, owner, responsible, stage
 FROM budgets 
 WHERE user_id = $1
 ORDER BY created_at DESC`,
      [userId]
    )
    .then((result) => result.rows);
exports.getBudgetsFromDB = getBudgetsFromDB;
// Add multiple budgets for a specific user
const addBudgetsToDB = (budgets, userId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
      yield client.query('BEGIN');
      for (const budget of budgets) {
        yield client.query(
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
      yield client.query('COMMIT');
    } catch (err) {
      yield client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  });
exports.addBudgetsToDB = addBudgetsToDB;
// Update budget (title, budget, spent) for a user
const updateBudgetInDB = (
  id,
  title,
  budget,
  spent,
  owner,
  responsible,
  stage,
  userId
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(
      `UPDATE budgets 
     SET title = $1, budget = $2, spent = $3, owner = $4, responsible = $5, stage = $6
     WHERE id = $7 AND user_id = $8
     RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at, owner, responsible, stage`,
      [title, budget, spent, owner, responsible, stage, id, userId]
    );
    return result.rows[0];
  });
exports.updateBudgetInDB = updateBudgetInDB;
// Delete a budget only if it belongs to the user
const deleteBudgetFromDB = (id, userId) =>
  db_1.default
    .query(
      `DELETE FROM budgets 
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at`,
      [id, userId]
    )
    .then((result) => result.rows[0]);
exports.deleteBudgetFromDB = deleteBudgetFromDB;
// ✅ FIXED: Fetch expenses (NOT budget_items)
const getBudgetItemsFromDB = (budgetId, userId) =>
  db_1.default
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
exports.getBudgetItemsFromDB = getBudgetItemsFromDB;
// Add an expense to the database
const addExpenseToDB = (
  budgetId,
  description,
  amount,
  owner,
  responsible,
  place_of_purchase,
  purchase_date, // epoch timestamp
  note
) =>
  db_1.default.query(
    `INSERT INTO expenses 
      (budget_id, description, amount, owner, responsible, place_of_purchase, purchase_date, note) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      budgetId,
      description,
      amount,
      owner,
      responsible,
      place_of_purchase,
      purchase_date ? new Date(purchase_date).toISOString() : null,
      note,
    ]
  );
exports.addExpenseToDB = addExpenseToDB;
// Get all expenses for a budget
const getExpensesFromDB = (budgetId) =>
  db_1.default
    .query(
      `SELECT id, description, amount, created_at, owner, responsible, place_of_purchase, purchase_date, note
       FROM expenses 
       WHERE budget_id = $1 
       ORDER BY created_at DESC`,
      [budgetId]
    )
    .then((result) => result.rows);
exports.getExpensesFromDB = getExpensesFromDB;
// Update an expense in the database
const updateExpenseInDB = (
  expenseId,
  description,
  amount,
  owner,
  responsible,
  place_of_purchase,
  purchase_date,
  note
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(
      `UPDATE expenses 
     SET description = $1,
         amount = $2,
         owner = $3,
         responsible = $4,
         place_of_purchase = $5,
         purchase_date = $6,
         note = $7
     WHERE id = $8
     RETURNING *`,
      [
        description,
        amount,
        owner,
        responsible,
        place_of_purchase,
        purchase_date ? new Date(purchase_date).toISOString() : null,
        note,
        expenseId,
      ]
    );
    return result.rows[0];
  });
exports.updateExpenseInDB = updateExpenseInDB;
