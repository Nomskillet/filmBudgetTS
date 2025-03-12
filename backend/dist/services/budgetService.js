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
exports.getBudgetItemsFromDB =
  exports.deleteBudgetFromDB =
  exports.updateBudgetSpent =
  exports.addBudgetsToDB =
  exports.getBudgetsFromDB =
    void 0;
const db_1 = __importDefault(require('../db'));
// Fetch budgets for a specific user
const getBudgetsFromDB = (userId) =>
  db_1.default
    .query(
      `SELECT id, title, budget, spent, (budget - spent) AS remaining, created_at 
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
      yield client.query('BEGIN'); // ✅ Start transaction
      for (const budget of budgets) {
        yield client.query(
          'INSERT INTO budgets (title, budget, user_id) VALUES ($1, $2, $3)',
          [budget.title, budget.budget, userId]
        );
      }
      yield client.query('COMMIT'); // ✅ Commit transaction if all inserts succeed
    } catch (err) {
      yield client.query('ROLLBACK'); // ✅ Rollback if any insert fails
      throw err;
    } finally {
      client.release(); // ✅ Release client back to pool
    }
  });
exports.addBudgetsToDB = addBudgetsToDB;
// Update spent amount for a budget that belongs to the user
const updateBudgetSpent = (id, spent, userId) =>
  db_1.default
    .query(
      `UPDATE budgets 
       SET spent = spent + $1 
       WHERE id = $2 AND user_id = $3
       RETURNING id, title, budget, spent, (budget - spent) AS remaining, created_at`,
      [spent, id, userId]
    )
    .then((result) => result.rows[0]);
exports.updateBudgetSpent = updateBudgetSpent;
// ✅ Delete a budget only if it belongs to the user
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
// ✅ Fetch items for a specific budget that belongs to the user
const getBudgetItemsFromDB = (budgetId, userId) =>
  db_1.default
    .query(
      `SELECT id, budget_id, description, amount, created_at 
       FROM budget_items 
       WHERE budget_id = $1 AND budget_id IN 
         (SELECT id FROM budgets WHERE user_id = $2) 
       ORDER BY created_at DESC`,
      [budgetId, userId]
    )
    .then((result) => result.rows);
exports.getBudgetItemsFromDB = getBudgetItemsFromDB;
