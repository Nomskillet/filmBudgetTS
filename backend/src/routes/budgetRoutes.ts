import { Router, Request, Response, NextFunction } from "express";
import {
  getBudgets,
  addBudgets, // ✅ Updated import
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController";
import validate from "../middlewares/validate";
import { createBudgetSchema, updateBudgetSchema } from "../schemas/budgetSchema";

const router = Router();


router.post("/budget", validate(createBudgetSchema), async (req, res) => {  // ✅ Corrected
  await addBudgets(req, res);
});




router.get("/budgets", (req, res) => getBudgets(req, res));  // ✅ Corrected

router.patch("/budget/:id", validate(updateBudgetSchema), updateBudget);
router.delete("/budget/:id", deleteBudget);

export default router;

