import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Dashboard</h1>
        <Button onClick={handleLogout} variant="secondary">
          Logout
        </Button>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h2>Welcome, {user?.name || "User"}!</h2>
        <p style={{ marginTop: "1rem" }}>
          This is your dashboard. Start building your application here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
