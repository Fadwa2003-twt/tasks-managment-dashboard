const Activity = require("../models/activityModel");

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort("-createdAt");
    res.status(200).json({ status: "success", data: activities });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json({ status: "success", data: activity });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ status: "fail", message: "Activity not found" });
    }
    res.status(200).json({ status: "success", data: activity });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      return res
        .status(404)
        .json({ status: "fail", message: "Activity not found" });
    }
    res.status(200).json({ status: "success", data: activity });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ status: "fail", message: "Activity not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
