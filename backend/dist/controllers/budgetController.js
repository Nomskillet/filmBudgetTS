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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudget = exports.updateBudget = exports.addBudgets = exports.getBudgets = void 0;
const budgetService_1 = require("../services/budgetService");
// ✅ Get all budgets (returns an array)
const getBudgets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const budgets = yield (0, budgetService_1.getBudgetsFromDB)();
    res.json([budgets]); // 🔄 Wrap in an array
});
exports.getBudgets = getBudgets;
// ✅ Add multiple budgets (returns an array)
const addBudgets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const budgets = req.body.budgets;
    if (!budgets || !Array.isArray(budgets) || budgets.length === 0) {
        res.status(400).json([{ error: "Invalid or missing budgets array" }]); // 🔄 Wrap error in an array
        return;
    }
    yield (0, budgetService_1.addBudgetsToDB)(budgets);
    res.status(201).json([{ message: "Budgets added successfully" }]); // 🔄 Wrap success message in an array
});
exports.addBudgets = addBudgets;
// ✅ Update budget (returns an array)
const updateBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { spent } = req.body;
    const updatedBudget = yield (0, budgetService_1.updateBudgetSpent)(Number(id), spent);
    res.json([updatedBudget]); // 🔄 Wrap in an array
});
exports.updateBudget = updateBudget;
// ✅ Delete budget (returns an array with message)
const deleteBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, budgetService_1.deleteBudgetFromDB)(Number(id));
    res.status(204).json([{ message: "Budget deleted successfully" }]); // 🔄 Wrap in an array
});
exports.deleteBudget = deleteBudget;
