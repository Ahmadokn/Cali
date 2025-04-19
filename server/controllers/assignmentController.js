const mongoose = require("mongoose");
const Assignment = require("../models/assignmentModel");

// Get all assignments
const getAssignments = async (req, res) => {
  const user_id = req.user._id;
  const assignments = await Assignment.find({ user_id }).sort({ dueDate: 1 });
  res.status(200).json(assignments);
};

// Get a single assignment
const getAssignment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such assignment" });
  }
  const assignment = await Assignment.findById(id);
  if (!assignment) {
    return res.status(404).json({ error: "No such assignment" });
  }
  res.status(200).json(assignment);
};

// Create new assignment
const createAssignment = async (req, res) => {
  const { title, course, dueDate, priority } = req.body;
  let emptyFields = [];
  if (!title) emptyFields.push("title");
  if (!course) emptyFields.push("course");
  if (!dueDate) emptyFields.push("dueDate");
  if (!priority) emptyFields.push("priority");
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  try {
    const user_id = req.user._id;
    const assignment = await Assignment.create({
      title,
      course,
      dueDate,
      priority,
      user_id
    });
    res.status(200).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an assignment
const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such assignment" });
  }
  const assignment = await Assignment.findOneAndDelete({ _id: id });
  if (!assignment) {
    return res.status(404).json({ error: "No such assignment" });
  }
  res.status(200).json(assignment);
};

// Update an assignment
const updateAssignment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such assignment" });
  }
  const assignment = await Assignment.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );
  if (!assignment) {
    return res.status(404).json({ error: "No such assignment" });
  }
  res.status(200).json(assignment);
};

module.exports = {
  getAssignments,
  getAssignment,
  createAssignment,
  deleteAssignment,
  updateAssignment
};
