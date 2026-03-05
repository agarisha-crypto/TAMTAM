const Job = require("../models/job");
const User = require("../models/user");
const Worker = require("../models/worker");


// =============================
// HIRER POSTS A JOB
// =============================
exports.createJob = async (req, res) => {
  try {

    const user = await User.findById(req.userId);

    if (!user || user.role !== "hirer") {
      return res.status(403).json({
        message: "Only hirers can post jobs"
      });
    }

    const { title, description, requiredSkills, budget, location } = req.body;

    if (!title || !description || !requiredSkills || !budget || !location) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const normalizedSkills = requiredSkills.map(skill =>
      skill.toLowerCase().trim()
    );

    const job = new Job({
      hirerId: req.userId,
      title,
      description,
      requiredSkills: normalizedSkills,
      budget,
      location,
      status: "open"
    });

    await job.save();

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// =============================
// GET JOBS FOR WORKERS
// =============================
exports.getOpenJobs = async (req, res) => {
  try {

    const worker = await Worker.findOne({ userId: req.userId });

    if (!worker) {
      return res.status(404).json({
        message: "Worker profile not found"
      });
    }

    const jobs = await Job.find({

      $or: [
        { status: "open" },

        {
          selectedWorker: worker._id,
          status: { $in: ["pending", "in-progress"] }
        }

      ]

    }).populate("hirerId", "name");

    res.json(jobs);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// =============================
// WORKER APPLIES TO JOB
// =============================
exports.applyToJob = async (req, res) => {
  try {

    const { jobId } = req.params;

    const worker = await Worker.findOne({ userId: req.userId });

    if (!worker) {
      return res.status(404).json({
        message: "Worker profile not found"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (job.status !== "open") {
      return res.status(400).json({
        message: "Job is not open"
      });
    }

    const alreadyApplied = job.applicants.some(
      id => id.toString() === worker._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied"
      });
    }

    job.applicants.push(worker._id);

    await job.save();

    res.json({
      message: "Application submitted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// =============================
// HIRER VIEWS THEIR JOBS
// =============================
exports.getHirerJobs = async (req, res) => {
  try {

    const jobs = await Job.find({ hirerId: req.userId })
      .populate({
        path: "applicants",
        populate: { path: "userId", select: "name" }
      })
      .populate({
        path: "selectedWorker",
        populate: { path: "userId", select: "name" }
      });

    res.json(jobs);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// =============================
// HIRER SELECTS WORKER
// =============================
exports.selectWorker = async (req, res) => {
  try {

    const { jobId, workerId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (job.hirerId.toString() !== req.userId) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    job.selectedWorker = workerId;
    job.status = "pending";

    await job.save();

    res.json({
      message: "Worker selected",
      job
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// =============================
// WORKER ACCEPTS JOB
// =============================
exports.acceptJob = async (req, res) => {
  try {

    const { jobId } = req.params;

    const worker = await Worker.findOne({ userId: req.userId });

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (!job.selectedWorker ||
        job.selectedWorker.toString() !== worker._id.toString()) {

      return res.status(403).json({
        message: "You are not selected for this job"
      });
    }

    if (job.status !== "pending") {
      return res.status(400).json({
        message: "Job cannot be accepted"
      });
    }

    job.status = "in-progress";
    job.startTime = new Date();

    await job.save();

    res.json({
      message: "Job accepted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// =============================
// HIRER COMPLETES JOB
// =============================
exports.completeJob = async (req, res) => {
  try {

    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    if (job.hirerId.toString() !== req.userId) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    job.status = "completed";
    job.completionTime = new Date();

    await job.save();

    res.json({
      message: "Job completed"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// =============================
// HIRER RATES WORKER
// =============================
exports.rateWorker = async (req, res) => {
  try {

    const { jobId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    job.rating = rating;
    await job.save();

    const worker = await Worker.findById(job.selectedWorker);

    if (worker) {

      worker.completedJobs += 1;
      worker.totalJobs += 1;

      const completionRate =
        worker.completedJobs / worker.totalJobs;

      const ratingScore = rating / 5;

      worker.reliabilityScore =
        (0.6 * completionRate + 0.4 * ratingScore) * 100;

      await worker.save();
    }

    res.json({
      message: "Worker rated successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};