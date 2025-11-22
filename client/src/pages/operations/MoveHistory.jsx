import { useState, useEffect } from "react";
import api from "../../utils/api";

const MoveHistory = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    movement_type: "",
    product_key: "",
    location_key: "",
  });
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchLocations();
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.movement_type) params.append("movement_type", filters.movement_type);
      if (filters.product_key) params.append("product_key", filters.product_key);
      if (filters.location_key) params.append("location_key", filters.location_key);

      const response = await api.get(`/operations/stock-movements?${params}`);
      setMovements(response.data.data);
    } catch (error) {
      console.error("Failed to fetch movements:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products?active=true");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get("/locations?active=true");
      setLocations(response.data.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleApplyFilters = () => {
    fetchMovements();
  };

  const handleResetFilters = () => {
    setFilters({
      movement_type: "",
      product_key: "",
      location_key: "",
    });
    setTimeout(() => fetchMovements(), 100);
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case "receipt": return "📥";
      case "delivery": return "📤";
      case "transfer": return "🔄";
      case "adjustment": return "⚖️";
      default: return "📦";
    }
  };

  const getMovementColor = (type) => {
    switch (type) {
      case "receipt": return "#10b981";
      case "delivery": return "#ef4444";
      case "transfer": return "#3b82f6";
      case "adjustment": return "#f59e0b";
      default: return "#64748b";
    }
  };

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <div className="page-header">
        <h1>📜 Move History</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
          Complete audit trail of all stock movements
        </p>
      </div>

      <div style={{ marginTop: "2rem", padding: "1.5rem", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#475569" }}>
              Operation Type
            </label>
            <select
              value={filters.movement_type}
              onChange={(e) => handleFilterChange("movement_type", e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
            >
              <option value="">All Types</option>
              <option value="receipt">Receipts</option>
              <option value="delivery">Deliveries</option>
              <option value="transfer">Transfers</option>
              <option value="adjustment">Adjustments</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#475569" }}>
              Product
            </label>
            <select
              value={filters.product_key}
              onChange={(e) => handleFilterChange("product_key", e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
            >
              <option value="">All Products</option>
              {products.map((prod) => (
                <option key={prod.product_key} value={prod.product_key}>
                  {prod.product_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#475569" }}>
              Location
            </label>
            <select
              value={filters.location_key}
              onChange={(e) => handleFilterChange("location_key", e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.location_key} value={loc.location_key}>
                  {loc.location_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleApplyFilters}
            style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: "8px", background: "#3b82f6", color: "white", cursor: "pointer" }}
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            style={{ padding: "0.75rem 1.5rem", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>Loading movements...</p>
        ) : movements.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No movements found</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Date</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Type</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Reference</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Product</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>From</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>To</th>
                <th style={{ padding: "1rem", textAlign: "right", fontWeight: "600" }}>Quantity</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Validated By</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement) => (
                <tr key={movement.movement_key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "1rem" }}>
                    {new Date(movement.movement_date).toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>{getMovementIcon(movement.movement_type)}</span>
                      <span style={{ color: getMovementColor(movement.movement_type), fontWeight: "500" }}>
                        {movement.movement_type}
                      </span>
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>{movement.reference}</td>
                  <td style={{ padding: "1rem" }}>
                    <div>
                      <div style={{ fontWeight: "500" }}>{movement.product?.product_name}</div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{movement.product?.sku}</div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "#64748b" }}>
                    {movement.source?.location_name || "—"}
                  </td>
                  <td style={{ padding: "1rem", color: "#64748b" }}>
                    {movement.destination?.location_name || "—"}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right", fontWeight: "600" }}>
                    {movement.quantity} {movement.uom}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#64748b" }}>
                    {movement.validator?.username || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;
