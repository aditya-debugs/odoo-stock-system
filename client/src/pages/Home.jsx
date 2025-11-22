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

  const benefits = [
    {
      number: "01",
      title: "Reduce Costs",
      description: "Cut inventory costs by up to 35% with intelligent forecasting and automated reordering.",
      color: "#4f46e5"
    },
    {
      number: "02",
      title: "Save Time",
      description: "Automate routine tasks and save 20+ hours per week on inventory management.",
      color: "#06b6d4"
    },
    {
      number: "03",
      title: "Boost Efficiency",
      description: "Streamline operations with real-time visibility across your entire supply chain.",
      color: "#8b5cf6"
    },
    {
      number: "04",
      title: "Scale Easily",
      description: "Grow your business without worrying about inventory management complexity.",
      color: "#10b981"
    },
  ];

  const integrations = [
    { name: "Shopify", icon: "🛍️" },
    { name: "WooCommerce", icon: "🛒" },
    { name: "Amazon", icon: "📦" },
    { name: "QuickBooks", icon: "💼" },
    { name: "Xero", icon: "📊" },
    { name: "Salesforce", icon: "☁️" },
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

      {/* Floating Navigation Header */}
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

      {/* Modern Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-container">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-blob hero-blob-3"></div>
          <div className="hero-gradient-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              <span className="badge-icon">✨</span>
              <span className="badge-text">Next-Gen Inventory Solution</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-title-word word-1">Inventory</span>{" "}
              <span className="hero-title-word word-2">Management</span>
              <br />
              <span className="hero-title-highlight">Made Simple</span>
            </h1>

            <p className="hero-subtitle">
              Transform your supply chain with real-time tracking, intelligent analytics, and seamless automation. Trusted by leading enterprises worldwide.
            </p>

            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary-large">
                <span className="btn-text">Start Free Trial</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button className="btn-secondary-large" onClick={() => navigate("/login")}>
                <span className="btn-text">View Demo</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>

            <p className="hero-note">
              <span className="note-check">✓</span>
              No credit card • 14-day free trial
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="mockup-title">StockMaster Dashboard</div>
              </div>
              <div className="mockup-content">
                <div className="mockup-stats">
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                      <div className="stat-value">2,847</div>
                      <div className="stat-label">Total Items</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <div className="stat-value">156</div>
                      <div className="stat-label">Orders Today</div>
                    </div>
                  </div>
                </div>
                <div className="mockup-chart">
                  <div className="chart-bars">
                    <div className="chart-bar" style={{ height: "60%" }}></div>
                    <div className="chart-bar" style={{ height: "85%" }}></div>
                    <div className="chart-bar" style={{ height: "45%" }}></div>
                    <div className="chart-bar" style={{ height: "95%" }}></div>
                    <div className="chart-bar" style={{ height: "70%" }}></div>
                    <div className="chart-bar" style={{ height: "80%" }}></div>
                  </div>
                </div>
              </div>
              <div className="mockup-glow"></div>
            </div>
            
            <div className="floating-elements">
              <div className="float-card float-1">
                <div className="float-icon">🔔</div>
                <div className="float-text">Low Stock Alert</div>
              </div>
              <div className="float-card float-2">
                <div className="float-icon">✅</div>
                <div className="float-text">Order Confirmed</div>
              </div>
              <div className="float-card float-3">
                <div className="float-icon">📈</div>
                <div className="float-text">+24% Growth</div>
              </div>
            </div>
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

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-header">
          <span className="section-label">Why Choose Us</span>
          <h2>Transform Your Business</h2>
          <p>Discover how StockMaster helps businesses streamline operations and boost productivity</p>
        </div>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-number" style={{ color: benefit.color }}>{benefit.number}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
              <div className="benefit-line" style={{ background: benefit.color }}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations Section */}
      <section className="integrations-section">
        <div className="integrations-content">
          <div className="integrations-text">
            <span className="section-label">Integrations</span>
            <h2>Connects With Your Favorite Tools</h2>
            <p>Seamlessly integrate with popular e-commerce platforms, accounting software, and more. Get started in minutes with our easy setup.</p>
            <Link to="/signup" className="integration-cta">
              Explore Integrations →
            </Link>
          </div>
          
          <div className="integrations-grid">
            {integrations.map((integration, index) => (
              <div key={index} className="integration-card">
                <div className="integration-icon">{integration.icon}</div>
                <div className="integration-name">{integration.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Inventory Management?</h2>
          <p>Join thousands of businesses streamlining their operations with StockMaster</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary-large">
              <span>Start Free Trial</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/login" className="btn-secondary-large">
              <span>Sign In</span>
              <span className="btn-arrow">→</span>
            </Link>
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
