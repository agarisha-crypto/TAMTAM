const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({

  hirerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  requiredSkills: {
    type: [String],
    required: true
  },

  budget: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  // Job lifecycle state
  status: {
    type: String,
    enum: ["open", "pending", "in-progress", "completed"],
    default: "open"
  },

  // Workers who applied
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker"
    }
  ],

  // AI suggested workers (future feature)
  matchedWorkers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker"
    }
  ],

  // Worker selected by hirer
  selectedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    default: null
  },

  // Rating given by hirer
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },

  // Optional feedback
  review: {
    type: String,
    default: ""
  },

  // Time when job actually started
  startTime: {
    type: Date,
    default: null
  },

  // Time when job completed
  completionTime: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);