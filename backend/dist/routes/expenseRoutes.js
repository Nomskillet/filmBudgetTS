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
router.get(
  '/expenses/:budgetId',
  authMiddleware_1.default,
  expenseController_1.getExpenses
);
router.post(
  '/budget/:budgetId/expense',
  authMiddleware_1.default,
  expenseController_1.addExpense
);
router.patch(
  '/expense/:expenseId',
  authMiddleware_1.default,
  expenseController_1.updateExpense
);
router.delete(
  '/expense/:expenseId',
  authMiddleware_1.default,
  expenseController_1.deleteExpense
);
exports.default = router;
