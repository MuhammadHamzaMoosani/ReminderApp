const Workspace = require("../models/task.model");
const User = require("../models/user.model");

/**
 * Create a new workspace
 */
exports.addWorkspace = async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const workspace = await Workspace.create({ user: req.body.user_id, ...req.body });
    res.status(201).json(workspace);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Add a task inside a workspace
 */
exports.addTask = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });

    workspace.tasks.push(req.body);
    await workspace.save();

    res.status(201).json(workspace);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Add a subtask inside a task
 */
exports.addSubtask = async (req, res) => {
  try {
    const { workspaceId, taskId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });

    const task = workspace.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.subtasks.push(req.body);
    await workspace.save();

    res.status(201).json(workspace);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get all workspaces for a user
 */
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ user: req.params.id });
    res.json(workspaces);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get a single task
 */
exports.getTaskById = async (req, res) => {
  try {
    const { workspaceId, taskId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });

    const task = workspace.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Update a task
 */
exports.updateTask = async (req, res) => {
  try {
    const { workspaceId, taskId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });

    const task = workspace.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.set(req.body);
    await workspace.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete a task
 */
exports.deleteTask = async (req, res) => {
  try {
    const { workspaceId, taskId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });

    const task = workspace.tasks.id(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.remove();
    await workspace.save();

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getTaskStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });

    const tasks = workspace.tasks;

    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      pendingTasks: tasks.filter(t => !t.completed).length,
      overdueTasks: tasks.filter(t => !t.completed && t.deadline < new Date()).length,
      subtasks: {
        total: tasks.reduce((sum, t) => sum + t.subtasks.length, 0),
        completed: tasks.reduce((sum, t) => sum + t.subtasks.filter(s => s.completed).length, 0),
        pending: tasks.reduce((sum, t) => sum + t.subtasks.filter(s => !s.completed).length, 0),
      }
    };

    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getUserTaskStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const workspaces = await Workspace.find({ user: userId });

    if (!workspaces.length) {
      return res.json({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        subtasks: { total: 0, completed: 0, pending: 0 }
      });
    }

    // Flatten all tasks from all workspaces
    const allTasks = workspaces.flatMap(ws => ws.tasks);

    const stats = {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.completed).length,
      pendingTasks: allTasks.filter(t => !t.completed).length,
      overdueTasks: allTasks.filter(t => !t.completed && t.deadline < new Date()).length,
      subtasks: {
        total: allTasks.reduce((sum, t) => sum + t.subtasks.length, 0),
        completed: allTasks.reduce((sum, t) => sum + t.subtasks.filter(s => s.completed).length, 0),
        pending: allTasks.reduce((sum, t) => sum + t.subtasks.filter(s => !s.completed).length, 0),
      }
    };

    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// controller
exports.getUpcomingDeadlines = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days } = req.query; // e.g. ?days=7
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + (parseInt(days) || 7));

    const workspaces = await Workspace.find({ user: userId });
    const tasks = workspaces.flatMap(ws => ws.tasks);

    const upcoming = tasks.filter(t => 
      t.deadline && new Date(t.deadline) >= new Date() && new Date(t.deadline) <= limitDate
    ).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    res.json(upcoming);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
