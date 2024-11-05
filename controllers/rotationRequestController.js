const RotationRequest = require("../models/rotationRequestModel");
const Rotation = require("../models/rotationModel");
const notificationService = require("../services/requestNotification");

exports.getAllRotationRequests = async (req, res) => {
  try {
    const requests = await RotationRequest.find()
      .populate("employee", "name") // Populate the employee details if needed
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching rotation requests:", error);
    res.status(500).json({ error: "Error fetching rotation requests." });
  }
};

exports.createRotationRequest = async (req, res) => {
  const employeeId = req.user._id;
  const {
    date,
    currentStartTime,
    currentEndTime,
    requestedStartTime,
    requestedEndTime,
    requestType,
  } = req.body;

  try {
    // Create the request
    const newRequest = new RotationRequest({
      employee: employeeId,
      date,
      currentStartTime,
      currentEndTime,
      requestedStartTime,
      requestedEndTime,
      requestType,
      status: "pending",
    });

    // Save the request first
    await newRequest.save();

    try {
      // Attempt to notify rotation managers
      await notificationService.notifyRotationManager(newRequest);

      res.status(201).json({
        success: true,
        message: "Rotation request submitted successfully.",
        requestId: newRequest._id,
      });
    } catch (notificationError) {
      // If notification fails, still keep the request but log the error
      console.error("Notification error:", notificationError);

      res.status(201).json({
        success: true,
        message:
          "Rotation request submitted successfully, but there was an error notifying managers.",
        requestId: newRequest._id,
        warning: "Manager notification failed",
      });
    }
  } catch (error) {
    console.error("Error creating rotation request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create rotation request",
      details: error.message,
    });
  }
};

exports.approveOrRejectRequest = async (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;

  try {
    const request = await RotationRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found." });

    if (status === "approved") {
      await applyRotationChange(request);
    }

    request.status = status;
    request.comments = comments;
    await request.save();

    res.status(200).json({ message: `Request ${status} successfully.` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Helper function to update rotation based on request
async function applyRotationChange(request) {
  const { employee, date, requestType, requestedStartTime, requestedEndTime } =
    request;
  const rotation = await Rotation.findOne({ employee });
  if (!rotation) return;

  const dayIndex = rotation.schedule.findIndex(
    (day) => day.date.toISOString() === new Date(date).toISOString()
  );
  if (dayIndex === -1) return;

  if (requestType === "edit") {
    rotation.schedule[dayIndex].startTime = requestedStartTime;
    rotation.schedule[dayIndex].endTime = requestedEndTime;
  } else if (requestType === "delete") {
    rotation.schedule.splice(dayIndex, 1);
  }

  await rotation.save();
}
