const Project = require("../models/projectModel");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    // .populate("tasks")
    // .populate("Department")
    // .populate("employees");
    res.status(200).json({ status: "success", data: projects });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ status: "success", data: project });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    // .populate("tasks")
    // .populate("Department")
    // .populate("employees");
    if (!project) {
      return res
        .status(404)
        .json({ status: "fail", message: "Project not found" });
    }
    res.status(200).json({ status: "success", data: project });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "fail", message: "Project not found" });
    }
    res.status(200).json({ status: "success", data: project });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ status: "fail", message: "Project not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
