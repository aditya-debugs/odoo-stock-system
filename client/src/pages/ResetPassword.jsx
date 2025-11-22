import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { sendEmail, isEmailJSConfigured } from "../services/emailJSService";
import "../styles/login.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Redirect if no email is provided
    if (!emailFromState) {
      navigate("/forgot-password");
    }
  }, [emailFromState, navigate]);

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (!pwd) return 0;

    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

    return Math.min(strength, 5);
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return false;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError("Password must contain uppercase, lowercase, and numbers");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Send success email via EmailJS if configured
        if (data.emailData && isEmailJSConfigured()) {
          const emailResult = await sendEmail(data.emailData);
          if (!emailResult.success) {
            console.warn("Success email sending failed:", emailResult.error);
          }
        }
        
        setSuccess(true);
        setTimeout(() => {
          navigate("/login", {
            state: { message: "Password reset successful! Please login with your new password." },
          });
        }, 2500);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        onClick={() => navigate("/forgot-password")}
        className="back-button"
        title="Back to forgot password"
      >
        ←
      </button>

      {/* Animated Background */}
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
              <span>🔑</span>
            </div>
            <h1>Reset Password</h1>
            <p className="brand-tagline">Create a new password</p>
            <p className="brand-description">
              Enter the 6-digit code sent to your email and create a strong new password for your account.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🔢</span>
                <span>Enter 6-digit OTP code</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Strong password required</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Instant activation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="login-panel-right">
          <div className="login-form-wrapper">
            {!success ? (
              <>
                <div className="login-header">
                  <h2>Reset Your Password</h2>
                  <p className="form-subtitle">
                    Enter the code sent to {email && <strong>{email}</strong>}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="error-banner fade-in">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email Field (readonly) */}
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      readOnly
                      style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                    />
                  </div>

                  {/* OTP Field */}
                  <div className="form-group">
                    <label htmlFor="otp">Verification Code</label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtp(value);
                      }}
                      placeholder="Enter 6-digit code"
                      required
                      className="form-input otp-input"
                      disabled={loading}
                      maxLength="6"
                      autoComplete="off"
                      autoFocus
                      style={{
                        textAlign: "center",
                        fontSize: "20px",
                        letterSpacing: "8px",
                        fontFamily: "monospace",
                      }}
                    />
                    <p className="field-hint">Check your email for the verification code</p>
                  </div>

                  {/* New Password Field */}
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="form-input"
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

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="password-strength">
                        <div className="strength-bars">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`strength-bar ${i < passwordStrength ? "active" : ""}`}
                              style={{
                                backgroundColor:
                                  i < passwordStrength ? strengthInfo.color : "#e5e7eb",
                              }}
                            ></div>
                          ))}
                        </div>
                        <span className="strength-text" style={{ color: strengthInfo.color }}>
                          {strengthInfo.text}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="form-input"
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="password-toggle"
                        tabIndex="-1"
                      >
                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary login-button"
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                  <p className="auth-link-text">
                    Didn't receive the code?{" "}
                    <Link to="/forgot-password" className="auth-link">
                      Resend code
                    </Link>
                  </p>
                  <p className="text-muted">🔐 Your password will be encrypted</p>
                </div>
              </>
            ) : (
              <div className="success-state">
                <div className="success-icon">
                  <span>✅</span>
                </div>
                <h2>Password Reset Successful!</h2>
                <p className="success-message">
                  Your password has been reset successfully. You can now login with your new password.
                </p>
                <div className="redirect-info">
                  <span className="spinner"></span>
                  Redirecting to login page...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
