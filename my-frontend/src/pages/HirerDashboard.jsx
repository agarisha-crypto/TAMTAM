import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function HirerDashboard() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==========================
  // FETCH HIRER JOBS
  // ==========================
  const fetchJobs = async () => {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        "http://localhost:5000/api/jobs/hirer",
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

    } catch (error) {
      setMessage("Server not reachable");
    }
  };


  // ==========================
  // SELECT WORKER
  // ==========================
  const selectWorker = async (jobId, workerId) => {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/select/${workerId}`,
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
        setMessage("Worker selected successfully");
        fetchJobs();
      }

    } catch (error) {
      setMessage("Server error");
    }
  };


  // ==========================
  // MARK JOB COMPLETE
  // ==========================
  const completeJob = async (jobId) => {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/complete`,
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
        setMessage("Job marked completed");
        fetchJobs();
      }

    } catch (error) {
      setMessage("Server error");
    }
  };


  // ==========================
  // RATE WORKER
  // ==========================
  const rateWorker = async (jobId, rating) => {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ rating })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
      } else {
        setMessage("Worker rated successfully");
        fetchJobs();
      }

    } catch (error) {
      setMessage("Server error");
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };


  return (
    <div style={{ padding: "40px" }}>

      <h2>Hirer Dashboard</h2>

      <div style={{ marginBottom: "30px" }}>

        <button
          onClick={() => navigate("/post-job")}
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          Post New Job
        </button>

        <button
          onClick={logout}
          style={{ padding: "10px 20px" }}
        >
          Logout
        </button>

      </div>


      <h3>Your Jobs</h3>

      {message && <p>{message}</p>}

      {jobs.length === 0 && <p>No jobs posted yet</p>}


      {jobs.map(job => (

        <div
          key={job._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "20px"
          }}
        >

          <h4>{job.title}</h4>

          <p>{job.description}</p>

          <p><b>Budget:</b> ₹{job.budget}</p>

          <p><b>Location:</b> {job.location}</p>

          <p><b>Status:</b> {job.status}</p>


          {/* ========================= */}
          {/* APPLICANTS */}
          {/* ========================= */}
          {job.status === "open" && job.applicants && job.applicants.length > 0 && (

            <div>

              <b>Applicants:</b>

              {job.applicants.map(worker => (

                <div key={worker._id} style={{ marginTop: "10px" }}>

                  <span>{worker.userId?.name || "Worker"}</span>

                  <button
                    onClick={() => selectWorker(job._id, worker._id)}
                    style={{
                      marginLeft: "15px",
                      padding: "5px 10px"
                    }}
                  >
                    Select Worker
                  </button>

                </div>

              ))}

            </div>

          )}


          {/* ========================= */}
          {/* SELECTED WORKER */}
          {/* ========================= */}
          {job.selectedWorker && (

            <p style={{ marginTop: "10px" }}>
              <b>Selected Worker:</b> {job.selectedWorker.userId?.name || "Worker"}
            </p>

          )}


          {/* ========================= */}
          {/* COMPLETE JOB */}
          {/* ========================= */}
          {job.status === "in-progress" && (

            <button
              onClick={() => completeJob(job._id)}
              style={{ marginTop: "10px" }}
            >
              Mark Job Completed
            </button>

          )}


          {/* ========================= */}
          {/* RATE WORKER */}
          {/* ========================= */}
          {job.status === "completed" && !job.rating && (

            <div style={{ marginTop: "10px" }}>

              <b>Rate Worker:</b>

              {[1,2,3,4,5].map(star => (

                <button
                  key={star}
                  onClick={() => rateWorker(job._id, star)}
                  style={{ marginLeft: "5px" }}
                >
                  {star}⭐
                </button>

              ))}

            </div>

          )}

        </div>

      ))}

    </div>
  );
}

export default HirerDashboard;