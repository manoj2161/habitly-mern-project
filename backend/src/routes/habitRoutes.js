import express from "express";
import {
  createHabit,
  completedDays,
  removeCompletedDays,
  updateHabit,
  deleteHabit,
  getCompletedDates,
} from "../controllers/habitController.js";
import { authToken } from "../middleware/auth.js";
const router = express.Router();
router.post("/dashboard/habits", authToken, createHabit);
router.post("/dashboard/habits/:habitId/completion", authToken, completedDays);
router.delete(
  "/dashboard/habits/:habitId/completion",
  authToken,
  removeCompletedDays,
);
router.put("/dashboard/habits/:habitId/update", authToken, updateHabit);
router.delete("/dashboard/habits/:habitId/delete", authToken, deleteHabit);
router.get(
  "/dashboard/habits/:habitId/completion",
  authToken,
  getCompletedDates,
);
export default router;
