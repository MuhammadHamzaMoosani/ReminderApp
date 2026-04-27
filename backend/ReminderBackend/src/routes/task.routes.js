const express = require("express");
const auth = require("../middleware/auth");
const {
  addWorkspace,
  addTask,
  addSubtask,
  getWorkspaces,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
    getUserTaskStats, 
    getUpcomingDeadlines
} = require("../controllers/task.controller");

const router = express.Router();

// All routes now protected
router.post("/", auth, addWorkspace);
router.get("/All/:id", auth, getWorkspaces);
router.post("/:workspaceId/tasks", auth, addTask);
router.get("/:workspaceId/tasks/:taskId", auth, getTaskById);
router.put("/:workspaceId/tasks/:taskId", auth, updateTask);
router.delete("/:workspaceId/tasks/:taskId", auth, deleteTask);
router.post("/:workspaceId/tasks/:taskId/subtasks", auth, addSubtask);
router.get("/:workspaceId/stats", auth, getTaskStats);
router.get("/stats/:id", auth, getUserTaskStats);
router.get("/:userId/upcoming", auth, getUpcomingDeadlines);

module.exports = router;
