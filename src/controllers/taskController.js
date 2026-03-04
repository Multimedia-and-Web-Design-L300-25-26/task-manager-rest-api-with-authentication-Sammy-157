import Task from "../models/Task.js";

// Create a new task

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      owner: req.user._id, // must match middleware user
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks for logged-in user

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task by ID

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};