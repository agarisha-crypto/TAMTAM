import { useNavigate } from "react-router-dom";

function LandingPage() {

  const navigate = useNavigate();

  const goWorker = () => {
    navigate("/login?intent=worker");
  };

  const goHirer = () => {
    navigate("/login?intent=hirer");
  };

  return (

    <div style={{ textAlign: "center", marginTop: "120px" }}>

      <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
        Instant Skill-Based Hiring
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "60px" }}>
        Find trusted workers in minutes or get hired instantly based on your skills.
      </p>


      <div>

        <button
          style={{
            padding: "18px 50px",
            fontSize: "20px",
            marginRight: "30px",
            cursor: "pointer"
          }}
          onClick={goWorker}
        >
          I Want to Work
        </button>


        <button
          style={{
            padding: "18px 50px",
            fontSize: "20px",
            cursor: "pointer"
          }}
          onClick={goHirer}
        >
          I Want to Hire
        </button>

      </div>


      {/* Small helper text */}
      <p style={{ marginTop: "40px", color: "gray" }}>
        New users can create an account after choosing their role.
      </p>

    </div>

  );
}

export default LandingPage;