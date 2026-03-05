const express = require("express");
const router = express.Router();

const {
  createJob,
  getOpenJobs,
  applyToJob,
  getHirerJobs,
  selectWorker,
  acceptJob,
  completeJob,
  rateWorker
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");


// ==============================
// HIRER POSTS A JOB
// ==============================
router.post("/", authMiddleware, createJob);


// ==============================
// WORKERS FETCH AVAILABLE JOBS
// ==============================
router.get("/open", authMiddleware, getOpenJobs);


// ==============================
// WORKER APPLIES TO JOB
// (workerId removed for security)
// ==============================
router.post("/:jobId/apply", authMiddleware, applyToJob);


// ==============================
// HIRER VIEWS THEIR JOBS
// ==============================
router.get("/hirer", authMiddleware, getHirerJobs);


// ==============================
// HIRER SELECTS A WORKER
// ==============================
router.post("/:jobId/select/:workerId", authMiddleware, selectWorker);


// ==============================
// WORKER ACCEPTS JOB
// ==============================
router.post("/:jobId/accept", authMiddleware, acceptJob);


// ==============================
// HIRER MARKS JOB COMPLETE
// ==============================
router.post("/:jobId/complete", authMiddleware, completeJob);


// ==============================
// HIRER RATES WORKER
// ==============================
router.post("/:jobId/rate", authMiddleware, rateWorker);


module.exports = router;