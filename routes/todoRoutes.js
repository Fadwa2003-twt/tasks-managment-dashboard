const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const permissions = require("../middlewares/permissionsMiddleware");
const middlewares = require("../middlewares/authMiddleware");

// Protect all routes
router.use(middlewares.protect);

// Routes for todos
router.get(
  "/employee/:employeeId/todos",
  permissions.checkPermission("view_todo"),
  todoController.getTodosByEmployee
);
router.post(
  "/employee/:employeeId/todos",
  permissions.checkPermission("create_todo"),
  todoController.createTodo
);
router.put(
  "/todos/:todoId",
  permissions.checkPermission("update_todo"),
  todoController.updateTodo
);
router.delete(
  "/todos/:todoId",
  permissions.checkPermission("delete_todo"),
  todoController.deleteTodo
);

module.exports = router;
