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
exports.deleteExpense =
  exports.updateExpense =
  exports.getExpenses =
  exports.addExpense =
    void 0;
const budgetService_1 = require('../services/budgetService');
const catchAsync_1 = __importDefault(require('../middlewares/catchAsync'));
const db_1 = __importDefault(require('../db'));
// Add a new expense
exports.addExpense = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const budgetId = parseInt(req.params.budgetId, 10);
    // 💡 Now accepting metadata
    const {
      description,
      amount,
      owner,
      responsible,
      place_of_purchase,
      purchase_date,
      note,
    } = req.body;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!budgetId || !description || !amount) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    // 👉 Call service with full metadata
    yield (0, budgetService_1.addExpenseToDB)(
      budgetId,
      description,
      amount,
      owner,
      responsible,
      place_of_purchase,
      purchase_date,
      note
    );
    yield db_1.default.query(
      `UPDATE budgets SET spent = spent + $1 WHERE id = $2`,
      [amount, budgetId]
    );
    res.status(201).json({ message: 'Expense added successfully' });
  })
);
// Get all expenses for a budget
exports.getExpenses = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const budgetId = parseInt(req.params.budgetId, 10);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (isNaN(budgetId)) {
      res.status(400).json({ error: 'Invalid budget ID' });
      return;
    }
    const expenses = yield (0, budgetService_1.getExpensesFromDB)(budgetId);
    res.json(expenses);
  })
);
exports.updateExpense = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const expenseId = parseInt(req.params.expenseId, 10);
    const {
      description,
      amount,
      owner,
      responsible,
      place_of_purchase,
      purchase_date,
      note,
    } = req.body;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (isNaN(expenseId) || !description || !amount) {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }
    // Get the current expense amount before updating
    const expenseResult = yield db_1.default.query(
      `SELECT amount, budget_id FROM expenses WHERE id = $1`,
      [expenseId]
    );
    if (expenseResult.rows.length === 0) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    const { amount: oldAmount, budget_id } = expenseResult.rows[0];
    // Update the expense
    const updatedExpense = yield (0, budgetService_1.updateExpenseInDB)(
      expenseId,
      description,
      amount,
      owner,
      responsible,
      place_of_purchase,
      purchase_date,
      note
    );
    if (!updatedExpense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    // Adjust the "spent" column based on the difference in amounts
    const amountDifference = amount - oldAmount;
    yield db_1.default.query(
      `UPDATE budgets SET spent = spent + $1 WHERE id = $2`,
      [amountDifference, budget_id]
    );
    //  Send the updated expense
    res.json(updatedExpense);
  })
);
// ✅ Add a new delete function
exports.deleteExpense = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const expenseId = parseInt(req.params.expenseId, 10);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (isNaN(expenseId)) {
      res.status(400).json({ error: 'Invalid expense ID' });
      return;
    }
    //  Get the expense details (amount & budget_id)
    const expenseResult = yield db_1.default.query(
      `SELECT amount, budget_id FROM expenses WHERE id = $1`,
      [expenseId]
    );
    if (expenseResult.rows.length === 0) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    const { amount, budget_id } = expenseResult.rows[0];
    yield db_1.default.query(`DELETE FROM expenses WHERE id = $1`, [expenseId]);
    yield db_1.default.query(
      `UPDATE budgets SET spent = spent - $1 WHERE id = $2`,
      [amount, budget_id]
    );
    res.json({ message: 'Expense deleted successfully' });
  })
);
