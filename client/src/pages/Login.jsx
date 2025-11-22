import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser, demoLogin } from "../services/authService";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      const userData = response.data || response;
      const { user, token } = userData;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role = "admin") => {
    setError("");
    setLoading(true);
    try {
      const response = await demoLogin({ role });
      const userData = response.data || response;
      const { user, token } = userData;
      if (!token) throw new Error("Demo login failed");
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel - Branding */}
      <div className="login-panel login-panel-left slide-in-left">
        <div className="login-branding">
          <div className="logo-icon">📦</div>
          <h1>StockMaster</h1>
          <p className="subtitle">Inventory Management System</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Real-time inventory tracking</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Seamless warehouse operations</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Multi-location management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-panel login-panel-right slide-in-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-banner fade-in">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary login-button"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Demo Buttons */}
            <div className="demo-buttons">
              <button
                type="button"
                onClick={() => handleDemo("admin")}
                disabled={loading}
                className="btn-secondary demo-btn"
                title="Login as Admin for demo"
              >
                <span>👤 Demo Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo("user")}
                disabled={loading}
                className="btn-secondary demo-btn"
                title="Login as User for demo"
              >
                <span>👥 Demo User</span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="text-muted">
              🔐 Your data is secure and encrypted in transit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
