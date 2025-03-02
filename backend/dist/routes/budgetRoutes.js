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
const express_1 = require("express");
const budgetController_1 = require("../controllers/budgetController");
const validate_1 = __importDefault(require("../middlewares/validate"));
const budgetSchema_1 = require("../schemas/budgetSchema");
const router = (0, express_1.Router)();
router.post("/budget", (0, validate_1.default)(budgetSchema_1.createBudgetSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, budgetController_1.addBudgets)(req, res);
}));
router.get("/budgets", (req, res) => (0, budgetController_1.getBudgets)(req, res)); // ✅ Corrected
router.patch("/budget/:id", (0, validate_1.default)(budgetSchema_1.updateBudgetSchema), budgetController_1.updateBudget);
router.delete("/budget/:id", budgetController_1.deleteBudget);
exports.default = router;
