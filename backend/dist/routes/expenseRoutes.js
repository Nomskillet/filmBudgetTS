'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const expenseController_1 = require('../controllers/expenseController');
const authMiddleware_1 = __importDefault(
  require('../middlewares/authMiddleware')
);
const router = (0, express_1.Router)();
router.post(
  '/expense',
  authMiddleware_1.default,
  expenseController_1.addExpense
); // ✅ Add a new expense
router.get(
  '/budget/:budgetId/expenses',
  authMiddleware_1.default,
  expenseController_1.getExpenses
); // ✅ Get all expenses for a budget
exports.default = router;
