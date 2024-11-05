// Libraries
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const cron = require("node-cron");
require("dotenv").config();
const app = express();
// Routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const projectRoutes = require("./routes/projectRoutes");
const activityRoutes = require("./routes/activityRoutes");
const taskRoutes = require("./routes/taskRoutes");
const todoRoutes = require("./routes/todoRoutes");
const stageRoutes = require("./routes/stageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const roleRoutes = require("./routes/roleRoutes");
const financialRoutes = require("./routes/financialRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const rotationRoutes = require("./routes/rotationRoutes");
const rotationRequestRoutes = require("./routes/rotationRequestRoutes");

const socialMediaRoutes = require("./routes/socialMediaRoutes");
// Controllers
const attendanceController = require("./controllers/attendanceController");
// Middlewares
const errorHandler = require("./middlewares/errorHandler");

app.use(express.urlencoded({ extended: true }));
// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow only specific domain
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/financials", financialRoutes);
app.use("/api/rotation", rotationRoutes);
app.use("/api/rotationRequests", rotationRequestRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/stages", stageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/attendance", attendanceRoutes);
// app.use("/api/socialMedia", socialMediaRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/uploads/chatFiles", express.static("uploads/chatFiles"));
app.use("/", (req, res) =>
  res.json({ status: "success", message: "Server is running" })
);
app.use(errorHandler);

cron.schedule("0 0 1 * *", () => {
  console.log("Running monthly attendance reset...");
  attendanceController.resetMonthlyCounters();
});
module.exports = app;
