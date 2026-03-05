import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function RegisterUser() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleFromURL = searchParams.get("role");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: roleFromURL || ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚨 prevent direct access without role
  useEffect(() => {
    if (!roleFromURL) {
      navigate("/");
    }
  }, [roleFromURL, navigate]);


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

    try {

      const response = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
      } else {

        setMessage("Account created successfully. Please login.");

        setTimeout(() => {
          navigate(`/login?intent=${formData.role}`);
        }, 1000);

      }

    } catch (error) {

      setMessage("Server not reachable");

    }

    setLoading(false);
  };


  return (

    <div style={{ textAlign: "center", marginTop: "80px" }}>

      <h2>
        Register as {roleFromURL === "worker" ? "Worker" : "Hirer"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>

      </form>

      <p>{message}</p>

    </div>

  );
}

export default RegisterUser;