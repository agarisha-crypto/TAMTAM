const Worker = require("../models/worker");
const User = require("../models/user");

// CREATE WORKER PROFILE
exports.createWorker = async (req, res) => {
  try {
    const userId = req.userId; // from authMiddleware

    // 🔒 Ensure only workers can create worker profile
    const user = await User.findById(userId);
    if (!user || user.role !== "worker") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      location,
      skills,
      availability
    } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    const normalizedSkills = skills.map(skill =>
      skill.toLowerCase().trim()
    );

    const existingProfile = await Worker.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Worker profile already exists" });
    }

    const worker = new Worker({
      userId,
      location,
      skills: normalizedSkills,
      availability,
      rating: 0,
      totalJobs: 0,
      completedJobs: 0,
      cancelledJobs: 0,
      reliabilityScore: 0
    });

    await worker.save();

  res.status(201).json({
  message: "Worker profile created successfully",
  workerId: worker._id
});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getMyWorkerProfile = async (req, res) => {
  try {

    const worker = await Worker.findOne({ userId: req.userId });

    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found" });
    }

    res.json(worker);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};