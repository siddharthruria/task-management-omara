// schema for the task

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to the User model
  },
  dueDate: { type: Date, required: true },
  taskList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskList", // reference to the TaskList model
    required: true,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
