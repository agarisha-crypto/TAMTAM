import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateWorkerProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: "",
    skills: "",
    availability: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    // If user somehow reaches here without login
    if (!token) {
      setMessage("Please login first");
      navigate("/login");
      return;
    }

    // Convert skills string → array
    const skillsArray = formData.skills
      .split(",")
      .map(skill => skill.trim().toLowerCase());

    const dataToSend = {
      ...formData,
      skills: skillsArray
    };

    try {

      const response = await fetch("http://localhost:5000/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
  setMessage(data.message || "Something went wrong");
} else {

  
  localStorage.setItem("workerId", data.workerId);

  setMessage("Worker profile created successfully");

  setTimeout(() => {
    navigate("/worker-dashboard");
  }, 1200);
}
    } catch (error) {
      setMessage("Server not reachable");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Create Worker Profile</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="location"
          placeholder="City / Area"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          onChange={handleChange}
          required
        />
        <br /><br />

        <select
          name="availability"
          onChange={handleChange}
          required
          defaultValue=""
        >
          <option value="" disabled>Select Availability</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="hourly">Hourly</option>
        </select>
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Profile"}
        </button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default CreateWorkerProfile;