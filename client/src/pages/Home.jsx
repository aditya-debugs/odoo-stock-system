import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: "📊",
      title: "Real-Time Analytics",
      description:
        "Monitor inventory levels across all locations with live updates and instant insights.",
    },
    {
      icon: "🏭",
      title: "Multi-Location Support",
      description:
        "Manage inventory across multiple warehouses and distribution centers seamlessly.",
    },
    {
      icon: "📦",
      title: "Stock Management",
      description:
        "Track receipts, deliveries, transfers, and adjustments with complete audit trails.",
    },
    {
      icon: "🔐",
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with role-based access control and encrypted data.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Optimized performance for seamless operations even with large datasets.",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description:
        "Access your inventory management system from any device, anywhere, anytime.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Logistics Manager",
      company: "Global Trade Inc.",
      text: "StockMaster transformed how we manage our inventory. Real-time tracking across 5 warehouses has been a game-changer.",
      avatar: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "Operations Director",
      company: "Tech Supply Co.",
      text: "The analytics dashboard gives us insights we never had before. Inventory costs have dropped 35% in just 3 months.",
      avatar: "👨‍💼"
    },
    {
      name: "Emma Rodriguez",
      role: "CEO",
      company: "Fashion Forward",
      text: "Incredibly easy to use. Our team was productive within hours. The support team is outstanding.",
      avatar: "👩‍🦱"
    },
  ];

  return (
    <div className="home-container">
      {/* Animated Background Elements */}
      <div className="home-bg-gradient"></div>
      <div className="home-floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Navigation Header */}
      <header className="home-header">
        <nav className="home-navbar">
          <div className="navbar-brand">
            <span className="navbar-logo">📦</span>
            <span className="navbar-title">StockMaster</span>
          </div>
          <div className="navbar-actions">
            <Link to="/login" className="nav-link">
              Sign In
            </Link>
            <Link to="/signup" className="nav-button">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Animated Background Elements */}
        <div className="hero-bg-container">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-blob hero-blob-3"></div>
          <div className="hero-gradient-overlay"></div>
          <canvas id="heroCanvas" className="hero-canvas"></canvas>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            {/* Animated Badge */}
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              <span className="badge-icon">✨</span>
              <span className="badge-text">Next-Gen Inventory Solution</span>
            </div>

            {/* Advanced Title Animation */}
            <h1 className="hero-title">
              <span className="hero-title-word word-1">Inventory</span>
              <span className="hero-title-word word-2">Management</span>
              <span className="hero-title-highlight">
                Made Simple
              </span>
            </h1>

            {/* Enhanced Subtitle */}
            <p className="hero-subtitle">
              Transform your supply chain with real-time tracking, intelligent analytics, and seamless automation. Trusted by leading enterprises worldwide.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary-large btn-glow btn-magnetic">
                <span className="btn-text">Start Free Trial</span>
                <span className="btn-arrow">→</span>
                <span className="btn-shine"></span>
              </Link>
              <button className="btn-secondary-large btn-hover-split" onClick={() => navigate("/login")}>
                <span className="btn-text">View Demo</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>

            {/* Enhanced Trust Note */}
            <p className="hero-note">
              <span className="note-check">✓</span>
              No credit card • 14-day free trial • 5000+ companies trust us
            </p>
          </div>

          {/* Enhanced Hero Illustration */}
          <div className="hero-illustration">
            <div className="illustration-container">
              {/* Floating animated cards */}
              <div className="floating-card card-1">
                <div className="card-inner">
                  <div className="card-icon">�</div>
                  <div className="card-label">Real-time</div>
                </div>
              </div>

              <div className="floating-card card-2">
                <div className="card-inner">
                  <div className="card-icon">⚡</div>
                  <div className="card-label">Fast</div>
                </div>
              </div>

              <div className="floating-card card-3">
                <div className="card-inner">
                  <div className="card-icon">🔐</div>
                  <div className="card-label">Secure</div>
                </div>
              </div>

              {/* Central rotating element */}
              <div className="central-element">
                <div className="central-ring"></div>
                <div className="central-ring ring-2"></div>
                <div className="central-icon">�</div>
                <div className="central-glow"></div>
              </div>

              {/* Decorative shapes */}
              <div className="hero-shape shape-circle"></div>
              <div className="hero-shape shape-triangle"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator with animation */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to explore</span>
          <div className="scroll-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage your inventory efficiently</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ "--delay": `${index * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-hover-line"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-header">
          <h2>Loved by Teams Worldwide</h2>
          <p>See what industry leaders say about StockMaster</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card" style={{ "--delay": `${index * 0.15}s` }}>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <span className="testimonial-avatar">{testimonial.avatar}</span>
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                  <div className="testimonial-company">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Inventory Management?</h2>
          <p>Join thousands of businesses already using StockMaster</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary-large">
              <span>Create Account</span>
              <span className="btn-arrow">→</span>
            </Link>
            <a href="#features" className="btn-secondary-large">
              <span>Learn More</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About StockMaster</h4>
            <p>The modern inventory management platform for businesses of all sizes.</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li><a href="#features">Analytics</a></li>
              <li><a href="#features">Multi-Location</a></li>
              <li><a href="#features">Security</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 StockMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
