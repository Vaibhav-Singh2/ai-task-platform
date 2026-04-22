import { Router } from "express";

import {
  createTask,
  getTaskById,
  getTasks,
  updateTask,
  streamTasks,
} from "@/controllers/tasks.js";
import { isAuthenticated } from "@/middlewares/auth.js";

const router = Router();

router.use(isAuthenticated);

router.get("/stream", streamTasks);
router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);

export default router;
