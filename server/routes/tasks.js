import express from "express";
const router = express.Router();
import {
  getTasks,
  postTask,
  putTask,
  deleteTask,
} from "../controllers/tasks.js";
import { verifyAccessToken, verifyAccessType } from "../middlewares/index.js";

// Routes beginning with /api/tasks
router.get("/", verifyAccessToken, verifyAccessType, getTasks);
router.post("/", verifyAccessToken, postTask);
router.put("/:taskId", verifyAccessToken, putTask);
router.delete("/:taskId", verifyAccessToken, deleteTask);

export default router;
