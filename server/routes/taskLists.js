const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const TaskList = require("../models/TaskList");
const fetchUser = require("../middleware/fetchUser");

// ------------------------------- ROUTE 1 -------------------------------

// route (/api/taskLists)

// POST -> creating a new task list

router.post(
  "/",
  fetchUser,
  [body("name", "task list name is required").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name } = req.body;
      
      let user = await TaskList.findOne({ name: req.body.name });
      if (user) {
        success = false;
        return res.status(400).json({
          success,
          error: "task list already exists",
        });
      }

      const taskList = new TaskList({
        name,
        createdBy: req.user.id, // the user who is creating the task list (admin/owner)
      });

      const savedTaskList = await taskList.save();
      res.status(201).json(savedTaskList);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "internal server error :/" });
    }
  }
);

// ------------------------------- ROUTE 2 -------------------------------

// route (/api/taskLists)

// GET -> get all task lists

router.get("/", fetchUser, async (req, res) => {
  try {
    const taskLists = await TaskList.find({ createdBy: req.user.id });
    res.status(200).json(taskLists);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "internal server error :/" });
  }
});

// ------------------------------- ROUTE 3 -------------------------------

// route (/api/taskLists/:id)

// GET -> get a specific task list by id

router.get("/:id", fetchUser, async (req, res) => {
  try {
    const taskList = await TaskList.findById(req.params.id);

    if (!taskList) {
      return res.status(404).json({ message: "task List not found" });
    }

    // ensure the user has access (is the creator or is assigned)
    if (taskList.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "access denied: not authorized" });
    }

    // authorized succesfully, send the task list
    res.status(200).json(taskList);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "internal server error :/" });
  }
});

// ------------------------------- ROUTE 4 -------------------------------

// route (/api/taskLists/:id)

// PUT -> update a task list by id

router.put("/:id", fetchUser, async (req, res) => {
  try {
    let taskList = await TaskList.findById(req.params.id);

    if (!taskList) {
      return res.status(404).json({ message: "task list not found" });
    }

    // ensuring only creator (admin/owner) can update the task list
    if (taskList.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "access denied: not authorized" });
    }

    const { name } = req.body;
    if (name) taskList.name = name;

    // name of task list updated here
    const updatedTaskList = await taskList.save();
    res.status(200).json(updatedTaskList);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "internal server error :/" });
  }
});

// ------------------------------- ROUTE 5 -------------------------------

// route (/api/taskLists/:id)

// DELETE -> delete a task list by id

router.delete("/:id", fetchUser, async (req, res) => {
  try {
    let taskList = await TaskList.findById(req.params.id);

    if (!taskList) {
      return res.status(404).json({ message: "task list not found" });
    }

    // ensuring only creator can delete the task list
    if (taskList.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "access denied: not authorized" });
    }

    // delete the task list
    await TaskList.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "task list deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "internal server error :/" });
  }
});

module.exports = router;
