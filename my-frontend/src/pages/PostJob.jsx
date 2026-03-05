import { useState } from "react";

function PostJob() {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    budget: "",
    location: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const jobData = {
      ...formData,
      requiredSkills: formData.requiredSkills
        .split(",")
        .map(skill => skill.trim().toLowerCase())
    };

    try {

      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
      } else {
        setMessage("Job posted successfully");
      }

    } catch (error) {
      setMessage("Server not reachable");
    }

  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Post a Job</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
          required
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Job Description"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="requiredSkills"
          placeholder="Skills (comma separated)"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="budget"
          type="number"
          placeholder="Budget"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">
          Post Job
        </button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default PostJob;