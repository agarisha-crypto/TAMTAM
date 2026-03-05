import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const intent = searchParams.get("intent"); // worker or hirer

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // 🔥 Redirect Logic
        if (data.role === "worker") {
  navigate("/worker-dashboard");
}

if (data.role === "hirer") {
  navigate("/dashboard-hirer");
}
      }

    } catch (error) {
      setMessage("Server not reachable");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>

      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate(`/register?role=${intent || "worker"}`)}
        >
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
