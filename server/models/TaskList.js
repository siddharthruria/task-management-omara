// schema for the task list

const mongoose = require("mongoose");

const TaskListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to the user model
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // reference to the task model
    },
  ],
});

module.exports = mongoose.model("TaskList", TaskListSchema);
