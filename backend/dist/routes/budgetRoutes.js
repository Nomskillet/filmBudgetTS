'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const budgetController_1 = require('../controllers/budgetController');
const validate_1 = __importDefault(require('../middlewares/validate'));
const budgetSchema_1 = require('../schemas/budgetSchema');
const authMiddleware_1 = __importDefault(
  require('../middlewares/authMiddleware')
);
const router = (0, express_1.Router)();
// ✅ Protect all routes with authMiddleware
router.get('/budgets', authMiddleware_1.default, budgetController_1.getBudgets);
router.post(
  '/budget',
  authMiddleware_1.default,
  (0, validate_1.default)(budgetSchema_1.createBudgetSchema),
  budgetController_1.addBudgets
);
router.patch(
  '/budget/:id',
  authMiddleware_1.default,
  (0, validate_1.default)(budgetSchema_1.updateBudgetSchema),
  budgetController_1.updateBudget
);
router.delete(
  '/budget/:id',
  authMiddleware_1.default,
  budgetController_1.deleteBudget
);
router.get(
  '/budgets/:budgetId/items',
  authMiddleware_1.default,
  budgetController_1.getBudgetItems
);
exports.default = router;
