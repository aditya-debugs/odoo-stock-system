import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendEmail, isEmailJSConfigured } from "../services/emailJSService";
import "../styles/login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Send email via EmailJS if configured
        if (data.emailData && isEmailJSConfigured()) {
          const emailResult = await sendEmail(data.emailData);
          if (!emailResult.success) {
            console.warn("Email sending failed, but OTP is still valid:", emailResult.error);
          }
        } else if (!isEmailJSConfigured()) {
          console.log("📧 EmailJS not configured. Check server console for OTP code.");
        }
        
        setSuccess(true);
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 2000);
      } else {
        setError(data.message || "Failed to send reset code");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Back Button */}
      <button
        onClick={() => navigate("/login")}
        className="back-button"
        title="Back to login"
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
              <span>🔒</span>
            </div>
            <h1>Reset Password</h1>
            <p className="brand-tagline">Forgot your password?</p>
            <p className="brand-description">
              No worries! Enter your email address and we'll send you a verification code to reset your password.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📧</span>
                <span>Receive OTP via email</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⏱️</span>
                <span>Code valid for 10 minutes</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔐</span>
                <span>Secure verification process</span>
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
                  <h2>Forgot Password?</h2>
                  <p className="form-subtitle">
                    Enter your email address to receive a verification code
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
                        disabled={loading}
                        autoComplete="email"
                        autoFocus
                      />
                      <span className="input-icon">✉️</span>
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
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                  <p className="auth-link-text">
                    Remember your password?{" "}
                    <Link to="/login" className="auth-link">
                      Back to login
                    </Link>
                  </p>
                  <p className="text-muted">
                    🔐 We'll never share your email with anyone
                  </p>
                </div>
              </>
            ) : (
              <div className="success-state">
                <div className="success-icon">
                  <span>✅</span>
                </div>
                <h2>Check Your Email</h2>
                <p className="success-message">
                  We've sent a verification code to <strong>{email}</strong>
                </p>
                <p className="success-note">
                  The code will expire in 10 minutes. Check your spam folder if you don't see it.
                </p>
                <div className="redirect-info">
                  <span className="spinner"></span>
                  Redirecting to verification page...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
