const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api/workers", require("./routes/workerRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

module.exports = app;