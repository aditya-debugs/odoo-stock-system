import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/dashboard.css";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDocType, setSelectedDocType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for demonstration
  const mockData = {
    kpis: {
      totalProducts: 1254,
      lowStockItems: 47,
      outOfStockItems: 12,
      pendingReceipts: 23,
      pendingDeliveries: 18,
      internalTransfers: 8,
    },
    warehouses: ["New York", "Los Angeles", "Chicago", "Houston"],
    categories: ["Electronics", "Clothing", "Furniture", "Food & Beverage"],
    documents: [
      {
        id: 1,
        type: "Receipt",
        status: "Waiting",
        count: 5,
        warehouse: "New York",
      },
      {
        id: 2,
        type: "Delivery",
        status: "Ready",
        count: 3,
        warehouse: "Los Angeles",
      },
      {
        id: 3,
        type: "Receipt",
        status: "Draft",
        count: 2,
        warehouse: "Chicago",
      },
      {
        id: 4,
        type: "Internal",
        status: "Done",
        count: 8,
        warehouse: "Houston",
      },
      {
        id: 5,
        type: "Adjustment",
        status: "Canceled",
        count: 1,
        warehouse: "New York",
      },
      {
        id: 6,
        type: "Delivery",
        status: "Done",
        count: 15,
        warehouse: "Chicago",
      },
    ],
  };

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return mockData.documents.filter((doc) => {
      const typeMatch =
        selectedDocType === "all" || doc.type.toLowerCase() === selectedDocType;
      const statusMatch =
        selectedStatus === "all" || doc.status.toLowerCase() === selectedStatus;
      const warehouseMatch =
        selectedWarehouse === "all" || doc.warehouse === selectedWarehouse;
      return typeMatch && statusMatch && warehouseMatch;
    });
  }, [selectedDocType, selectedStatus, selectedWarehouse]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "#94a3b8";
      case "waiting":
        return "#f59e0b";
      case "ready":
        return "#3b82f6";
      case "done":
        return "#10b981";
      case "canceled":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getDocTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "receipt":
        return "📥";
      case "delivery":
        return "📤";
      case "internal":
        return "🔄";
      case "adjustment":
        return "⚙️";
      default:
        return "📦";
    }
  };

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="dashboard-bg-circles">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-branding">
            <div className="header-logo-icon">📊</div>
            <div>
              <h1 className="header-title">StockMaster Dashboard</h1>
              <p className="header-subtitle">Inventory Overview & Operations</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-avatar">{user?.name?.[0] || "U"}</span>
            <div className="user-details">
              <p className="user-name">{user?.name || "User"}</p>
              <p className="user-role">{user?.role || "Staff"}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="logout-btn"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* KPIs Section */}
        <section className="kpis-section">
          <h2 className="section-title">Key Performance Indicators</h2>
          <div className="kpis-grid">
            <div className="kpi-card kpi-primary">
              <div className="kpi-icon">📦</div>
              <div className="kpi-content">
                <p className="kpi-label">Total Products</p>
                <p className="kpi-value">
                  <AnimatedCounter value={mockData.kpis.totalProducts} />
                </p>
                <p className="kpi-change">+2.5% from last month</p>
              </div>
            </div>

            <div className="kpi-card kpi-warning">
              <div className="kpi-icon">⚠️</div>
              <div className="kpi-content">
                <p className="kpi-label">Low Stock Items</p>
                <p className="kpi-value">
                  <AnimatedCounter value={mockData.kpis.lowStockItems} />
                </p>
                <p className="kpi-change">Requires attention</p>
              </div>
            </div>

            <div className="kpi-card kpi-danger">
              <div className="kpi-icon">❌</div>
              <div className="kpi-content">
                <p className="kpi-label">Out of Stock</p>
                <p className="kpi-value">
                  <AnimatedCounter value={mockData.kpis.outOfStockItems} />
                </p>
                <p className="kpi-change">Action needed</p>
              </div>
            </div>

            <div className="kpi-card kpi-info">
              <div className="kpi-icon">📥</div>
              <div className="kpi-content">
                <p className="kpi-label">Pending Receipts</p>
                <p className="kpi-value">
                  <AnimatedCounter value={mockData.kpis.pendingReceipts} />
                </p>
                <p className="kpi-change">Incoming stock</p>
              </div>
            </div>

            <div className="kpi-card kpi-success">
              <div className="kpi-icon">📤</div>
              <div className="kpi-content">
                <p className="kpi-label">Pending Deliveries</p>
                <p className="kpi-value">
                  <AnimatedCounter value={mockData.kpis.pendingDeliveries} />
                </p>
                <p className="kpi-change">Outgoing stock</p>
              </div>
            </div>

            <div className="kpi-card kpi-secondary">
              <div className="kpi-icon">🔄</div>
              <div className="kpi-content">
                <p className="kpi-label">Internal Transfers</p>
                <p className="kpi-value">
                  <AnimatedCounter value={mockData.kpis.internalTransfers} />
                </p>
                <p className="kpi-change">Scheduled</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <h2 className="section-title">Dynamic Filters</h2>
          <div className="filters-grid">
            {/* Document Type Filter */}
            <div className="filter-group">
              <label className="filter-label">Document Type</label>
              <div className="filter-options">
                <button
                  className={`filter-btn ${
                    selectedDocType === "all" ? "active" : ""
                  }`}
                  onClick={() => setSelectedDocType("all")}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${
                    selectedDocType === "receipt" ? "active" : ""
                  }`}
                  onClick={() => setSelectedDocType("receipt")}
                >
                  📥 Receipts
                </button>
                <button
                  className={`filter-btn ${
                    selectedDocType === "delivery" ? "active" : ""
                  }`}
                  onClick={() => setSelectedDocType("delivery")}
                >
                  📤 Delivery
                </button>
                <button
                  className={`filter-btn ${
                    selectedDocType === "internal" ? "active" : ""
                  }`}
                  onClick={() => setSelectedDocType("internal")}
                >
                  🔄 Internal
                </button>
                <button
                  className={`filter-btn ${
                    selectedDocType === "adjustment" ? "active" : ""
                  }`}
                  onClick={() => setSelectedDocType("adjustment")}
                >
                  ⚙️ Adjustments
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <div className="filter-options">
                <button
                  className={`filter-btn ${
                    selectedStatus === "all" ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus("all")}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${
                    selectedStatus === "draft" ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus("draft")}
                >
                  Draft
                </button>
                <button
                  className={`filter-btn ${
                    selectedStatus === "waiting" ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus("waiting")}
                >
                  Waiting
                </button>
                <button
                  className={`filter-btn ${
                    selectedStatus === "ready" ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus("ready")}
                >
                  Ready
                </button>
                <button
                  className={`filter-btn ${
                    selectedStatus === "done" ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus("done")}
                >
                  Done
                </button>
                <button
                  className={`filter-btn ${
                    selectedStatus === "canceled" ? "active" : ""
                  }`}
                  onClick={() => setSelectedStatus("canceled")}
                >
                  Canceled
                </button>
              </div>
            </div>

            {/* Warehouse Filter */}
            <div className="filter-group">
              <label className="filter-label">Warehouse / Location</label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Warehouses</option>
                {mockData.warehouses.map((warehouse) => (
                  <option key={warehouse} value={warehouse}>
                    {warehouse}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Product Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {mockData.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Documents List Section */}
        <section className="documents-section">
          <div className="documents-header">
            <h2 className="section-title">Filtered Operations</h2>
            <span className="documents-count">
              {filteredDocuments.length} document(s)
            </span>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="documents-table">
              <div className="table-header">
                <div className="table-cell">Type</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Count</div>
                <div className="table-cell">Warehouse</div>
                <div className="table-cell">Action</div>
              </div>
              {filteredDocuments.map((doc, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">
                    <span className="doc-type">
                      {getDocTypeIcon(doc.type)} {doc.type}
                    </span>
                  </div>
                  <div className="table-cell">
                    <span
                      className="status-badge"
                      style={{
                        borderColor: getStatusColor(doc.status),
                        color: getStatusColor(doc.status),
                      }}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="table-cell">{doc.count}</div>
                  <div className="table-cell">{doc.warehouse}</div>
                  <div className="table-cell">
                    <button className="action-btn">View</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <p className="empty-text">
                No documents found matching your filters
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
