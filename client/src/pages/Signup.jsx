import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/login.css"; // Reuse login styling

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (!pwd) return 0;

    // Length criteria
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;

    // Character variety
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

    return Math.min(strength, 5);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Update password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear server error
    if (serverError) {
      setServerError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await registerUser(
        formData.name,
        formData.email,
        formData.password
      );

      if (response.success) {
        // Redirect to login with success message
        navigate("/login", {
          state: {
            message: "Account created successfully! Please sign in.",
          },
        });
      } else {
        setServerError(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setServerError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get password strength color and text
  const getPasswordStrengthInfo = () => {
    const strengthLevels = [
      { color: "#ef4444", text: "Very Weak" },
      { color: "#f97316", text: "Weak" },
      { color: "#eab308", text: "Fair" },
      { color: "#22c55e", text: "Good" },
      { color: "#16a34a", text: "Strong" },
    ];
    return strengthLevels[Math.max(0, passwordStrength - 1)] || {
      color: "#9ca3af",
      text: "Enter password",
    };
  };

  const strengthInfo = getPasswordStrengthInfo();

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

      {/* Animated Background Circles */}
      <div className="bg-circles">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>

      <div className="login-content">
        {/* Left Panel - Branding */}
        <div className="login-panel-left">
          <div className="brand-section">
            <div className="logo-circle bounce-animation">
              <span>📦</span>
            </div>
            <h1>StockMaster</h1>
            <p className="brand-tagline">Create your account</p>
            <p className="brand-description">
              Join thousands of businesses managing their inventory smarter.
              Real-time tracking, insightful analytics, and seamless workflows.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Real-time stock updates</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Advanced analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Secure & reliable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="login-panel-right">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h2>Create Account</h2>
              <p className="form-subtitle">
                Already have an account?{" "}
                <Link to="/login" className="link">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Error Banner */}
            {serverError && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`form-input ${errors.name ? "error" : ""}`}
                  disabled={loading}
                  autoComplete="name"
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`form-input ${errors.password ? "error" : ""}`}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex="-1"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`strength-bar ${
                            i < passwordStrength ? "active" : ""
                          }`}
                          style={{
                            backgroundColor:
                              i < passwordStrength
                                ? strengthInfo.color
                                : "#e5e7eb",
                          }}
                        ></div>
                      ))}
                    </div>
                    <span
                      className="strength-text"
                      style={{ color: strengthInfo.color }}
                    >
                      {strengthInfo.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`form-input ${
                      errors.confirmPassword ? "error" : ""
                    }`}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="password-toggle"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary login-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="auth-footer">
              <p className="text-muted">
                🔐 Your password is hashed and encrypted for security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
