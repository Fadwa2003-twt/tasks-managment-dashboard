const Stage = require("../models/stageModel");
const Task = require("../models/taskModel");

// Create a new stage and associate it with a task
exports.createStage = async (req, res) => {
  const { title, description, startDate, endDate, status } = req.body;
  const taskId = req.params.taskId;

  try {
    // Create a new stage
    const newStage = new Stage({
      title,
      description,
      startDate,
      endDate,
      status,
    });

    const savedStage = await newStage.save();

    // Add the stage to the task
    await Task.findByIdAndUpdate(taskId, {
      $push: { stages: savedStage._id },
    });

    res.status(201).json({
      status: "success",
      message: "Stage created successfully",
      data: savedStage,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Get all stages for a specific task
exports.getStagesByTask = async (req, res) => {
  try {
    const stages = await Stage.find({
      _id: { $in: req.params.stageIds.split(",") },
    });

    res.json({
      status: "success",
      message: "Stages retrieved successfully",
      data: stages,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Update a stage
exports.updateStage = async (req, res) => {
  try {
    const updatedStage = await Stage.findByIdAndUpdate(
      req.params.stageId,
      req.body,
      { new: true }
    );

    res.json({
      status: "success",
      message: "Stage updated successfully",
      data: updatedStage,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Delete a stage and remove it from a task
exports.deleteStage = async (req, res) => {
  const { taskId, stageId } = req.params;

  try {
    // Delete the stage
    await Stage.findByIdAndDelete(stageId);

    // Remove the stage from the task
    await Task.findByIdAndUpdate(taskId, {
      $pull: { stages: stageId },
    });

    res.json({
      status: "success",
      message: "Stage deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
