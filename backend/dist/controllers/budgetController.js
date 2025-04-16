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
Object.defineProperty(exports, '__esModule', { value: true });
exports.getBudgetItems =
  exports.deleteBudget =
  exports.updateBudget =
  exports.addBudgets =
  exports.getBudgets =
    void 0;
const budgetService_1 = require('../services/budgetService');
// Get budgets for the logged-in user
const getBudgets = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const budgets = yield (0, budgetService_1.getBudgetsFromDB)(userId);
    res.json(budgets);
  });
exports.getBudgets = getBudgets;
// Add budgets & link them to the logged-in user
const addBudgets = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const budgets = req.body.budgets.map((budget) => ({
      title: budget.title,
      budget: budget.budget,
      owner: budget.owner || '',
      responsible: budget.responsible || '',
      stage: budget.stage || 'pre-production',
    }));
    if (!budgets || !Array.isArray(budgets) || budgets.length === 0) {
      res.status(400).json({ error: 'Invalid or missing budgets array' });
      return;
    }
    yield (0, budgetService_1.addBudgetsToDB)(budgets, userId);
    res.status(201).json({ message: 'Budgets added successfully' });
  });
exports.addBudgets = addBudgets;
// Update a budget only if it belongs to the user
const updateBudget = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    const { title, budget } = req.body; // No longer expecting "spent" from frontend
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    // Fetch the current spent amount from the database
    const existingBudgets = yield (0, budgetService_1.getBudgetsFromDB)(userId);
    const existingBudget = existingBudgets.find((b) => b.id === Number(id));
    if (!existingBudget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }
    // Use the existing spent value when updating
    const updatedBudget = yield (0, budgetService_1.updateBudgetInDB)(
      Number(id),
      title,
      budget,
      existingBudget.spent,
      req.body.owner || '',
      req.body.responsible || '',
      req.body.stage || 'pre-production',
      userId
    );
    if (!updatedBudget) {
      res.status(403).json({
        error: 'Forbidden: Budget not found or does not belong to you',
      });
      return;
    }
    res.json([updatedBudget]);
  });
exports.updateBudget = updateBudget;
// Delete a budget only if it belongs to the user
const deleteBudget = (req, res, next) =>
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
  });
exports.deleteBudget = deleteBudget;
// Get budget items only for a budget that belongs to the user
const getBudgetItems = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Get user ID from request
    const budgetId = parseInt(req.params.budgetId, 10); // Get budget ID from URL
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
  });
exports.getBudgetItems = getBudgetItems;
