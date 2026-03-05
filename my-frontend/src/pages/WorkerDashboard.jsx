import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function WorkerDashboard() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");



  // ==========================
  // INITIAL LOAD
  // ==========================
  useEffect(() => {

    const init = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {

        // Ask backend if worker profile exists
        const response = await fetch(
          "http://localhost:5000/api/workers/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 404) {
          navigate("/create-worker");
          return;
        }

        const worker = await response.json();

        // Store workerId for future requests
        localStorage.setItem("workerId", worker._id);

        fetchJobs();

      } catch {
        setMessage("Server error");
      }

    };

    init();

  }, []);




  // ==========================
  // FETCH OPEN JOBS
  // ==========================
  const fetchJobs = async () => {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        "http://localhost:5000/api/jobs/open",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage("Failed to load jobs");
      } else {
        setJobs(data);
      }

    } catch {
      setMessage("Server not reachable");
    }

  };




  // ==========================
  // APPLY TO JOB
  // ==========================
  const applyJob = async (jobId) => {

    const token = localStorage.getItem("token");
    const workerId = localStorage.getItem("workerId");

    try {

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/apply/${workerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
      } else {
        setMessage("Applied successfully");
        fetchJobs();
      }

    } catch {
      setMessage("Server error");
    }

  };




  // ==========================
  // ACCEPT JOB
  // ==========================
  const acceptJob = async (jobId) => {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
      } else {
        setMessage("Job accepted");
        fetchJobs();
      }

    } catch {
      setMessage("Server error");
    }

  };




  // ==========================
  // LOGOUT
  // ==========================
  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("workerId");

    navigate("/");
  };




  return (

    <div style={{ padding: "40px" }}>

      <h2>Worker Dashboard</h2>

      <button
        onClick={fetchJobs}
        style={{ marginRight: "15px", padding: "10px" }}
      >
        Refresh Jobs
      </button>

      <button
        onClick={logout}
        style={{ padding: "10px" }}
      >
        Logout
      </button>

      <p style={{ marginTop: "20px" }}>{message}</p>



      <div style={{ marginTop: "30px" }}>

        {jobs.length === 0 && <p>No jobs available</p>}

        {jobs.map(job => (

          <div
            key={job._id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px"
            }}
          >

            <h3>{job.title}</h3>

            <p>{job.description}</p>

            <p><b>Budget:</b> ₹{job.budget}</p>

            <p><b>Location:</b> {job.location}</p>

            <p><b>Status:</b> {job.status}</p>

            <p>
              <b>Skills:</b> {job.requiredSkills.join(", ")}
            </p>



            {/* APPLY BUTTON */}
            {job.status === "open" && (

              <button
                onClick={() => applyJob(job._id)}
                style={{
                  marginTop: "10px",
                  padding: "8px 15px"
                }}
              >
                Apply
              </button>

            )}



            {/* ACCEPT JOB BUTTON */}
            {job.status === "pending" && (

              <button
                onClick={() => acceptJob(job._id)}
                style={{
                  marginTop: "10px",
                  padding: "8px 15px",
                  backgroundColor: "#4CAF50",
                  color: "white"
                }}
              >
                Accept Job
              </button>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}

export default WorkerDashboard;