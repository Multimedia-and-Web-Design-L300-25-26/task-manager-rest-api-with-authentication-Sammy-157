import express from "express";
import { createTask, getTasks, deleteTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// POST /api/tasks → create a new task
router.post("/", createTask);

// GET /api/tasks → get all tasks for logged-in user
router.get("/", getTasks);

// DELETE /api/tasks/:id → delete a task
router.delete("/:id", deleteTask);

export default router;