const Todo = require("../models/todoModel");
const multer = require("multer");

// Setup multer (no files)
const upload = multer();

// Get all todos for a specific employee
exports.getTodosByEmployee = async (req, res) => {
  try {
    const todos = await Todo.find({ employee: req.params.employeeId });
    res.json({ status: "success", data: todos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new to-do item for an employee using multer to handle form-data
exports.createTodo = [
  upload.none(), // Use multer to parse text-based form-data
  async (req, res) => {
    const { title, description, dueDate, startDate } = req.body; // Include startDate
    console.log(req.body); // This should now display your form-data

    const employeeId = req.params.employeeId;

    try {
      const newTodo = new Todo({
        title,
        description,
        dueDate,
        startDate: new Date(startDate), // Convert the startDate to a Date object
        employee: employeeId,
      });
      const savedTodo = await newTodo.save();
      res.status(201).json({ status: "success", data: savedTodo });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

// Update a to-do item
exports.updateTodo = [
  upload.none(), // Parse text-based form-data
  async (req, res) => {
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.todoId,
        req.body,
        { new: true }
      );
      res.json({ status: "success", data: updatedTodo });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

// Delete a to-do item
exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.todoId);
    res.json({ status: "success", message: "To-do deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
