const Task = require("../models/taskModel");
const Project = require("../models/projectModel"); // Ensure the Project model is imported
const Activity = require("../models/activityModel");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("project").populate("assignedTo");
    res.status(200).json({ status: "success", data: tasks });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.createTask = async (req, res) => {
  const {
    title,
    description,
    deadline,
    status,
    priority,
    project,
    assignedTo,
  } = req.body;

  try {
    if (project) {
      const projectExists = await Project.findById(project);
      if (!projectExists) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid project ID" });
      }
    }

    // Create a new task
    const task = await Task.create({
      title,
      description,
      deadline,
      status,
      priority,
      project,
      assignedTo,
      createdBy: req.user._id, // Assuming req.user contains authenticated user info
    });

    // Log the activity
    const newActivity = new Activity({
      action: "Created",
      model: "Task",
      entityId: task._id,
      description: `Task "${task.title}" was created.`,
      performedBy: req.user._id,
    });
    await newActivity.save();

    res.status(201).json({ status: "success", data: task });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project")
      .populate("assignedTo"); // Updated to reflect the correct field name
    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found" });
    }
    res.status(200).json({ status: "success", data: task });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const originalTask = await Task.findById(req.params.id);
    if (!originalTask) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found" });
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Log the activity with field changes
    const fieldsChanged = Object.keys(req.body)
      .map((field) => `${field}: ${req.body[field]}`)
      .join(", ");
    const updatedActivity = new Activity({
      action: "Updated",
      model: "Task",
      entityId: updatedTask._id,
      description: `Task "${updatedTask.title}" was updated. Fields changed: ${fieldsChanged}`,
      performedBy: req.user._id,
    });
    await updatedActivity.save();

    res.status(200).json({ status: "success", data: updatedTask });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ status: "fail", message: "Task not found" });
    }

    // Log the activity
    const deleteActivity = new Activity({
      action: "Deleted",
      model: "Task",
      entityId: task._id,
      description: `Task "${task.title}" was deleted.`,
      performedBy: req.user._id,
    });
    await deleteActivity.save();

    res
      .status(204)
      .json({ status: "success", data: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
