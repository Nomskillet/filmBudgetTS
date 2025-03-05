"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetItems = exports.deleteBudget = exports.updateBudget = exports.addBudgets = exports.getBudgets = void 0;
const budgetService_1 = require("../services/budgetService");
const catchAsync_1 = __importDefault(require("../middlewares/catchAsync")); // Import catchAsync
// Get all budgets
exports.getBudgets = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const budgets = yield (0, budgetService_1.getBudgetsFromDB)();
    res.json(budgets); // ✅ Always returns an array, even if empty
}));
// Add multiple budgets
exports.addBudgets = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const budgets = req.body.budgets;
    if (!budgets || !Array.isArray(budgets) || budgets.length === 0) {
        res.status(400).json({ error: 'Invalid or missing budgets array' });
        return;
    }
    yield (0, budgetService_1.addBudgetsToDB)(budgets);
    res.status(201).json({ message: 'Budgets added successfully' });
}));
// Update budget
exports.updateBudget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { spent } = req.body;
    const updatedBudget = yield (0, budgetService_1.updateBudgetSpent)(Number(id), spent);
    res.json(updatedBudget ? [updatedBudget] : []); // Return an array, even if empty
}));
// Delete budget
exports.deleteBudget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, budgetService_1.deleteBudgetFromDB)(Number(id));
    res.status(204).send();
}));
// Get budget items for a specific budget
const getBudgetItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const budgetId = parseInt(req.params.budgetId, 10);
    if (isNaN(budgetId)) {
        res.status(400).json({ error: 'Invalid budget ID' });
        return;
    }
    const items = yield (0, budgetService_1.getBudgetItemsFromDB)(budgetId);
    res.json(items);
});
exports.getBudgetItems = getBudgetItems;
