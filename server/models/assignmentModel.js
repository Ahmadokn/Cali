const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AssignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    course: { type: String, required: true },
    dueDate: { type: Date, required: true },
    dueTime:    { type: String, required: true },  // e.g. "14:30"
    description:{ type: String, required: false },
    user_id: { type: String, required: true },
    priority: {
      type: String,
      enum: ['none','low','medium','high'],
      default: 'none',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    reminder: {
      enabled: { type: Boolean, default: false },
      offsetMinutes: { type: Number, default: 0 }  // minutes before dueDate
    },
    recurrence: {
      frequency: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly'],
        default: 'none'
      },
      interval: { type: Number, default: 1 }  // e.g., every 1 week
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", AssignmentSchema);
