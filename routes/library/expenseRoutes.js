import express from "express";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} from "../../controllers/library/expenceController.js";
import { expenseValidation,validateExpense } from "../../middleware/validation.js";


const router = express.Router();

router.get("/:libraryId", getExpenses);
router.post("/:libraryId", expenseValidation,validateExpense,createExpense);
router.patch("/:id", expenseValidation,validateExpense,updateExpense);
router.delete("/:id", deleteExpense);
router.get("/stats/:libraryId", getExpenseStats);

export {router as libraryExpenseRouter}
