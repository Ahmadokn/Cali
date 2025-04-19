const express = require("express");
const {
  getAssignments,
  getAssignment,
  createAssignment,
  deleteAssignment,
  updateAssignment
} = require("../controllers/assignmentController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Require authentication for all assignment routes
router.use(requireAuth);

// GET all assignments
router.get("/", getAssignments);

// GET a single assignment
router.get("/:id", getAssignment);

// CREATE a new assignment
router.post("/", createAssignment);

// DELETE an assignment
router.delete("/:id", deleteAssignment);

// UPDATE an assignment
router.patch("/:id", updateAssignment);

module.exports = router;
