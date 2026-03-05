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

    // 🔒 Clear previous session
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("workerId");

    try {

      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();


      if (!response.ok) {

        setMessage(data.message || "Login failed");
        setLoading(false);
        return;

      }


      // Save session
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);


      // 🔥 Role validation (important)
      if (intent && intent !== data.role) {

        setMessage(
          `This account is registered as ${data.role}. Please login from the correct option.`
        );

        localStorage.clear();
        setLoading(false);
        return;

      }


      // Redirect based on role
      if (data.role === "worker") {

        navigate("/worker-dashboard");

      } else if (data.role === "hirer") {

        navigate("/dashboard-hirer");

      } else {

        setMessage("Unknown account type");
        localStorage.clear();

      }


    } catch (error) {

      setMessage("Server not reachable");

    }

    setLoading(false);

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

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>


      <p style={{ marginTop: "20px", color: "red" }}>
        {message}
      </p>


      <p style={{ marginTop: "25px" }}>
        Don't have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() =>
            navigate(`/register?role=${intent || "worker"}`)
          }
        >
          Register here
        </span>
      </p>

    </div>

  );

}

export default Login;
