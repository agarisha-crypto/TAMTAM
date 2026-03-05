const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  location: {
    type: String,
    required: true
  },

  skills: {
    type: [String],
    required: true
  },

  availability: {
    type: String,
    enum: ["full-time", "part-time", "hourly"],
    required: true
  },

  rating: {
    type: Number,
    default: 0
  },

  totalJobs: {
    type: Number,
    default: 0
  },

  completedJobs: {
    type: Number,
    default: 0
  },

  cancelledJobs: {
    type: Number,
    default: 0
  },

  reliabilityScore: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Worker", WorkerSchema);