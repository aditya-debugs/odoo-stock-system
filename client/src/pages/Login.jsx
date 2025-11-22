import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/authService";
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
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="back-button"
        title="Go back to home"
      >
        ←
      </button>

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
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="form-input"
                />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="form-input"
                />
                <span className="input-icon">🔒</span>
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
          </form>

          {/* Signup Link */}
          <div className="auth-footer">
            <p className="auth-link-text">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Create one now
              </Link>
            </p>
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
