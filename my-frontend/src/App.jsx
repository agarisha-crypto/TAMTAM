import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterUser from "./pages/RegisterUser";
import Login from "./pages/Login";
import HirerDashboard from "./pages/HirerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import CreateWorkerProfile from "./pages/CreateWorkerProfile";
import PostJob from "./pages/PostJob";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterUser />} />

      <Route path="/create-worker" element={<CreateWorkerProfile />} />
      <Route path="/dashboard-hirer" element={<HirerDashboard />} />
      <Route path="/worker-dashboard" element={<WorkerDashboard />} />
      <Route path="/post-job" element={<PostJob />} />
    </Routes>
  );
}

export default App;
