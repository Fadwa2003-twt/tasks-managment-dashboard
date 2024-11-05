const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissions = require("../middlewares/permissionsMiddleware");

// Protect all routes
router.use(authMiddleware.protect);

// Record the start of an attendance session
router.post(
  "/start",
  // permissions.checkPermission("start_attendance"),
  attendanceController.startAttendanceSession
);

// Record the end of an attendance session
router.post(
  "/end",
  // permissions.checkPermission("end_attendance"),
  attendanceController.endAttendanceSession
);

// Get attendance summary for a specific employee
router.get(
  "/summary/:employeeId",
  // permissions.checkPermission("view_attendance"),
  attendanceController.getEmployeeAttendanceSummary
);

// Reset monthly counters for all employees
router.post(
  "/reset-monthly",
  // permissions.checkPermission("reset_attendance"),
  attendanceController.resetMonthlyAttendance
);

router.get(
  "/report",
  // permissions.checkPermission("view_all_attendance_reports"),
  attendanceController.getAllEmployeesAttendanceReport
);
module.exports = router;
