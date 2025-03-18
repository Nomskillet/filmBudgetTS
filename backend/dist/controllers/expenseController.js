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
exports.updateExpense = exports.getExpenses = exports.addExpense = void 0;
const budgetService_1 = require('../services/budgetService');
const catchAsync_1 = __importDefault(require('../middlewares/catchAsync'));
const db_1 = __importDefault(require('../db'));
// Add a new expense
exports.addExpense = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const budgetId = parseInt(req.params.budgetId, 10);
    const { description, amount } = req.body;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!budgetId || !description || !amount) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    yield (0, budgetService_1.addExpenseToDB)(budgetId, description, amount);
    yield db_1.default.query(
      `UPDATE budgets SET spent = spent + $1 WHERE id = $2`,
      [amount, budgetId]
    );
    res.status(201).json({ message: 'Expense added successfully' });
  })
);
// ✅ Get all expenses for a budget
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
// Update an existing expense
exports.updateExpense = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const expenseId = parseInt(req.params.expenseId, 10);
    const { description, amount } = req.body;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (isNaN(expenseId) || !description || !amount) {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }
    const updatedExpense = yield (0, budgetService_1.updateExpenseInDB)(
      expenseId,
      description,
      amount
    );
    if (!updatedExpense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json(updatedExpense);
  })
);
