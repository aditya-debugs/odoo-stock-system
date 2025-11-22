import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
          Manage your account information
        </p>
      </div>

      <div style={{ marginTop: "2rem", padding: "2rem", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", maxWidth: "600px" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#475569", fontSize: "0.9rem" }}>
            Name
          </label>
          <div style={{ padding: "0.75rem", background: "#f8fafc", borderRadius: "8px", color: "#334155" }}>
            {user?.name || "N/A"}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#475569", fontSize: "0.9rem" }}>
            Email
          </label>
          <div style={{ padding: "0.75rem", background: "#f8fafc", borderRadius: "8px", color: "#334155" }}>
            {user?.email || "N/A"}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#475569", fontSize: "0.9rem" }}>
            Role
          </label>
          <div style={{ padding: "0.75rem", background: "#f8fafc", borderRadius: "8px", color: "#334155" }}>
            {user?.Role?.role_name === "inventory_manager" ? "Inventory Manager" : "Warehouse Staff"}
          </div>
        </div>

        <p style={{ color: "#64748b", marginTop: "2rem", fontSize: "0.9rem" }}>
          Profile editing will be implemented in a future update.
        </p>
      </div>
    </div>
  );
};

export default Profile;
