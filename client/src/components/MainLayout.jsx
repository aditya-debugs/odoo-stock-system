import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import usePermissions from "../hooks/usePermissions";
import "../styles/layout.css";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const permissions = usePermissions(user);
  const [isOperationsExpanded, setIsOperationsExpanded] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleOperations = () => {
    setIsOperationsExpanded(!isOperationsExpanded);
  };

  return (
    <div className="main-layout">
      {/* Left Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-icon">📦</span>
            <span className="logo-text">StockMaster</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </NavLink>

          {/* Products */}
          <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon">📦</span>
            <span className="nav-text">Products</span>
          </NavLink>

          {/* Operations Submenu */}
          <div className="nav-item-group">
            <button
              className={`nav-item submenu-toggle ${isOperationsExpanded ? "expanded" : ""}`}
              onClick={toggleOperations}
            >
              <span className="nav-icon">🔄</span>
              <span className="nav-text">Operations</span>
              <span className="expand-icon">{isOperationsExpanded ? "▼" : "▶"}</span>
            </button>
            
            {isOperationsExpanded && (
              <div className="submenu">
                <NavLink to="/operations/receipts" className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}>
                  <span className="submenu-icon">📥</span>
                  <span className="submenu-text">Receipts</span>
                </NavLink>
                <NavLink to="/operations/deliveries" className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}>
                  <span className="submenu-icon">📤</span>
                  <span className="submenu-text">Delivery Orders</span>
                </NavLink>
                <NavLink to="/operations/transfers" className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}>
                  <span className="submenu-icon">🔄</span>
                  <span className="submenu-text">Internal Transfers</span>
                </NavLink>
                <NavLink to="/operations/adjustments" className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}>
                  <span className="submenu-icon">⚙️</span>
                  <span className="submenu-text">Inventory Adjustment</span>
                </NavLink>
                <NavLink to="/operations/history" className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}>
                  <span className="submenu-icon">📜</span>
                  <span className="submenu-text">Move History</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Settings - Only for Inventory Manager */}
          {permissions.isInventoryManager && (
            <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Settings</span>
            </NavLink>
          )}
        </nav>

        {/* Sidebar Footer - Profile Menu */}
        <div className="sidebar-footer">
          <div className="profile-menu">
            <button
              className="profile-trigger"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <span className="user-avatar">{user?.name?.[0] || "U"}</span>
              <div className="user-info">
                <span className="user-name">{user?.name || "User"}</span>
                <span className="user-role-badge">
                  {permissions.isInventoryManager ? "Manager" : "Staff"}
                </span>
              </div>
              <span className="menu-icon">{isProfileMenuOpen ? "▲" : "▼"}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="profile-dropdown">
                <NavLink to="/profile" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                  <span className="dropdown-icon">👤</span>
                  <span>My Profile</span>
                </NavLink>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
