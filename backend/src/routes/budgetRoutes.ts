import { Router } from "express";
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController";

const router = Router();

router.get("/budgets", getBudgets);
router.post("/budget", addBudget);
router.patch("/budget/:id", updateBudget);
router.delete("/budget/:id", deleteBudget);

export default router;
