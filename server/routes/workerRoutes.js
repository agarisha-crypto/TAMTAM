const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createWorker,
  getMyWorkerProfile
} = require("../controllers/workerController");


// Create worker profile
router.post("/", authMiddleware, createWorker);


// Get logged-in worker profile
router.get("/me", authMiddleware, getMyWorkerProfile);


module.exports = router;