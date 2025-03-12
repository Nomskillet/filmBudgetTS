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
exports.getBudgetItems =
  exports.deleteBudget =
  exports.updateBudget =
  exports.addBudgets =
  exports.getBudgets =
    void 0;
const budgetService_1 = require('../services/budgetService');
const catchAsync_1 = __importDefault(require('../middlewares/catchAsync'));
// Get budgets for the logged-in user
exports.getBudgets = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const budgets = yield (0, budgetService_1.getBudgetsFromDB)(userId);
    res.json(budgets);
  })
);
// Add budgets & link them to the logged-in user
exports.addBudgets = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const budgets = req.body.budgets;
    if (!budgets || !Array.isArray(budgets) || budgets.length === 0) {
      res.status(400).json({ error: 'Invalid or missing budgets array' });
      return;
    }
    yield (0, budgetService_1.addBudgetsToDB)(budgets, userId);
    res.status(201).json({ message: 'Budgets added successfully' });
  })
);
// Update a budget only if it belongs to the user
exports.updateBudget = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    const { spent } = req.body;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const updatedBudget = yield (0, budgetService_1.updateBudgetSpent)(
      Number(id),
      spent,
      userId
    );
    if (!updatedBudget) {
      res.status(403).json({
        error: 'Forbidden: Budget not found or does not belong to you',
      });
      return;
    }
    res.json([updatedBudget]);
  })
);
// Delete a budget only if it belongs to the user
exports.deleteBudget = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const deletedBudget = yield (0, budgetService_1.deleteBudgetFromDB)(
      Number(id),
      userId
    );
    if (!deletedBudget) {
      res.status(403).json({
        error: 'Forbidden: Budget not found or does not belong to you',
      });
      return;
    }
    res.status(204).send();
  })
);
// Get budget items only for a budget that belongs to the user
exports.getBudgetItems = (0, catchAsync_1.default)((req, res) =>
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
    const items = yield (0, budgetService_1.getBudgetItemsFromDB)(
      budgetId,
      userId
    );
    res.json(items);
  })
);
