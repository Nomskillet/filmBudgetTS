"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budgetController_1 = require("../controllers/budgetController");
const validate_1 = __importDefault(require("../middlewares/validate"));
const budgetSchema_1 = require("../schemas/budgetSchema");
const router = (0, express_1.Router)();
router.get('/budgets', budgetController_1.getBudgets);
router.post('/budget', (0, validate_1.default)(budgetSchema_1.createBudgetSchema), budgetController_1.addBudgets);
router.patch('/budget/:id', (0, validate_1.default)(budgetSchema_1.updateBudgetSchema), budgetController_1.updateBudget);
router.delete('/budget/:id', budgetController_1.deleteBudget);
router.get('/budgets/:budgetId/items', budgetController_1.getBudgetItems);
exports.default = router;
