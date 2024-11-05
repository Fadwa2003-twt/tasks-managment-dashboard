const Attendance = require("../models/attendanceModel");
const Employee = require("../models/employeeModel");
const { format, differenceInMinutes } = require("date-fns");

// Record attendance (start session)
exports.startAttendanceSession = async (req, res) => {
  try {
    const employeeId = req.body.employeeId;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    const workingDay = employee.workingDays.find(
      (day) => day.day === currentDay
    );

    if (!workingDay) {
      return res
        .status(400)
        .json({ message: "Today is not a working day for this employee." });
    }

    const expectedStartTime = new Date(
      today.toDateString() + " " + workingDay.fromToHours.from
    );
    const actualStartTime = new Date(); // Current time when employee clicks start

    // Find attendance record for the employee
    let attendance = await Attendance.findOne({ employee: employeeId });

    // Check if there is a current session that hasn't ended
    if (attendance) {
      const todayRecord = attendance.attendanceRecords.find((record) => {
        return (
          record.date.toDateString() === today.toDateString() && !record.endTime
        );
      });

      if (todayRecord) {
        return res
          .status(400)
          .json({ message: "Attendance session is already active for today." });
      }
    }

    // Calculate late hours if applicable (after 30 minutes grace period)
    let lateHours = 0;
    const gracePeriod = 30; // 30 minutes

    if (actualStartTime > expectedStartTime) {
      const lateStartTime = new Date(
        expectedStartTime.getTime() + gracePeriod * 60000
      ); // Add 30 minutes
      if (actualStartTime > lateStartTime) {
        const diffMinutes = differenceInMinutes(actualStartTime, lateStartTime);
        lateHours =
          Math.floor(diffMinutes / 60) +
          ":" +
          String(diffMinutes % 60).padStart(2, "0"); // Format as HH:MM
      }
    }

    const newAttendance = {
      date: today,
      startTime: expectedStartTime,
      actualStartTime: actualStartTime,
      lateHours: lateHours,
      status: lateHours ? "Late" : "Present",
    };

    // Create new attendance record if it doesn't exist
    if (!attendance) {
      attendance = new Attendance({
        employee: employeeId,
        attendanceRecords: [newAttendance],
      });
    } else {
      attendance.attendanceRecords.push(newAttendance);
    }

    // Update counters
    attendance.daysWorked += 1;
    attendance.totalLateHours += lateHours
      ? parseFloat(lateHours.split(":")[0]) +
        parseFloat(lateHours.split(":")[1]) / 60
      : 0; // Convert HH:MM to decimal

    await attendance.save();

    res
      .status(200)
      .json({ message: "Attendance recorded successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// End attendance session (end of the day)
exports.endAttendanceSession = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();

    const attendance = await Attendance.findOne({ employee: employeeId });
    if (!attendance) {
      return res
        .status(404)
        .json({ message: "No attendance record found for today." });
    }

    const todayRecord = attendance.attendanceRecords.find((record) => {
      return record.date.toDateString() === today.toDateString();
    });

    if (!todayRecord || todayRecord.endTime) {
      return res
        .status(400)
        .json({ message: "Attendance session not started or already ended." });
    }

    const actualEndTime = new Date();
    const workedHours =
      (actualEndTime - todayRecord.actualStartTime) / (1000 * 60 * 60); // convert ms to hours
    todayRecord.endTime = actualEndTime;
    todayRecord.workedHours = Math.round(workedHours * 100) / 100;

    attendance.totalWorkingHours += todayRecord.workedHours;

    await attendance.save();

    res
      .status(200)
      .json({ message: "Attendance session ended successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee attendance summary (for charts and analysis)
exports.getEmployeeAttendanceSummary = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    const attendance = await Attendance.findOne({
      employee: employeeId,
    }).populate("employee", "name");

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "Attendance record not found for this employee." });
    }

    res.status(200).json({
      employee: attendance.employee.name,
      daysWorked: attendance.daysWorked,
      daysAbsent: attendance.daysAbsent,
      totalWorkingHours: attendance.totalWorkingHours,
      totalLateHours: attendance.totalLateHours,
      attendanceRecords: attendance.attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get report for all employees
exports.getAllEmployeesAttendanceReport = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate(
      "employee",
      "name department position"
    );

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    const report = attendanceRecords.map((attendance) => ({
      employeeName: attendance.employee.name,
      department: attendance.employee.department,
      position: attendance.employee.position,
      daysWorked: attendance.daysWorked,
      daysAbsent: attendance.daysAbsent,
      totalWorkingHours: attendance.totalWorkingHours,
      totalLateHours: attendance.totalLateHours,
      attendanceRecords: attendance.attendanceRecords,
    }));

    res
      .status(200)
      .json({ message: "Attendance report generated successfully", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset monthly counters
exports.resetMonthlyAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();
    attendanceRecords.forEach((attendance) => {
      attendance.resetMonthlyCounters();
      attendance.save();
    });

    res.status(200).json({
      message: "Monthly attendance counters reset for all employees.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
