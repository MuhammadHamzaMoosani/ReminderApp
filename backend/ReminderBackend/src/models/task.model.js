const mongoose = require("mongoose");

/**
 * Task schema to manage task reminders and priorities.
 */
// Subtask schema
const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Task schema (with embedded subtasks)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  remindAt: { type: Date },
  reminded: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  colour: { type: String, default: "#FFFFFF" },
  subtasks: [subtaskSchema] // embedding subtasks
});

// Workspace schema (with embedded tasks)
const workspaceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  tasks: [taskSchema] // embedding tasks
});

const Workspace = mongoose.model("Workspace", workspaceSchema);
module.exports = Workspace;
//module.exports = mongoose.model("Task", taskSchema);
