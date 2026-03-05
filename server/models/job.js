const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({

  hirerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
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

  // Job lifecycle
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

  // Worker selected by hirer
  selectedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    default: null
  },

  // Rating after completion
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },

  // Optional comment from hirer
  review: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);