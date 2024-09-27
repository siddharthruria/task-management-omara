const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const TaskList = require("../models/TaskList");
const fetchUser = require("../middleware/fetchUser");

// ------------------------------- ROUTE 1 -------------------------------

// route (/api/tasks/create)

// POST -> creating a new task

router.post("/create", fetchUser, async (req, res) => {
  const { title, description, dueDate, taskListId, assignedTo } = req.body;

  // validate request body
  if (!title || !description || !dueDate || !taskListId || !assignedTo) {
    return res
      .status(400)
      .json({ error: "please provide all the required fields" });
  }

  try {
    // check if the task list exists and the user is authorized to add a task
    const taskList = await TaskList.findById(taskListId);
    if (!taskList) {
      return res.status(404).json({ error: "task list not found" });
    }

    if (taskList.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "you are not authorized to add tasks to this list" });
    }

    // create the new task
    const task = new Task({
      title,
      description,
      dueDate: new Date(req.body.dueDate),
      // dueDate,
      taskList: taskListId,
      assignedTo,
      status: "not started",
    });

    await task.save();

    // push the new task ID into the task list
    taskList.tasks.push(task._id);
    await taskList.save();

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error :/" });
  }
});

// ------------------------------- ROUTE 2 -------------------------------

// route (/api/tasks/list/:taskListId)

// GET -> get all tasks in a specific task list

router.get("/list/:taskListId", fetchUser, async (req, res) => {
  const { taskListId } = req.params;

  try {
    // check if the task list exists
    const taskList = await TaskList.findById(taskListId);
    if (!taskList) {
      return res.status(404).json({ error: "task list not found" });
    }

    // ensuring the user has access to the task list
    if (taskList.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "you are not authorized to view this task list" });
    }

    // fetch tasks for the task list
    const tasks = await Task.find({ taskList: taskListId });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error :/" });
  }
});

// ------------------------------- ROUTE 3 -------------------------------

// route (/api/tasks/update/:taskId)

// PUT -> route to update a task

router.put("/update/:taskId", fetchUser, async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate, status } = req.body;

  try {
    // find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }

    // check if the user is authorized to update the task
    if (task.assignedTo.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "you are not authorized to update this task" });
    }

    // update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;

    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error :/" });
  }
});

// ------------------------------- ROUTE 4 -------------------------------

// route (/api/tasks/delete/:taskId)

// DELETE -> route to delete a task

router.delete("/delete/:taskId", fetchUser, async (req, res) => {
  const { taskId } = req.params;

  try {
    // find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }

    // check if the user is authorized to delete the task
    if (task.assignedTo.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "you are not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(taskId);

    res
      .status(200)
      .json({ success: true, message: "task deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error :/" });
  }
});

module.exports = router;
