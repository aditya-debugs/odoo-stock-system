import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import usePermissions from "../../hooks/usePermissions";

const Adjustments = () => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const whResponse = await fetch("http://localhost:5001/api/warehouses?active=true", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const whData = await whResponse.json();
        if (whData.success) setWarehouses(whData.data);

        const locResponse = await fetch("http://localhost:5001/api/locations?active=true", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const locData = await locResponse.json();
        if (locData.success) setLocations(locData.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredLocations = selectedWarehouse
    ? locations.filter((loc) => loc.warehouse_key === parseInt(selectedWarehouse))
    : locations;

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <div className="page-header">
        <h1>⚙️ Inventory Adjustment</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
          Adjust inventory quantities
        </p>
      </div>

      {permissions.canExecuteOperations && (
        <button className="btn-primary" style={{ marginTop: "1.5rem" }}>
          + Create Adjustment
        </button>
      )}

      <div style={{ marginTop: "2rem", padding: "2rem", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#475569" }}>
              Warehouse
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
            >
              <option value="">All Warehouses</option>
              {warehouses.map((wh) => (
                <option key={wh.warehouse_key} value={wh.warehouse_key}>
                  {wh.warehouse_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#475569" }}>
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
            >
              <option value="">All Locations</option>
              {filteredLocations.map((loc) => (
                <option key={loc.location_key} value={loc.location_key}>
                  {loc.location_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>
          Inventory adjustment operations will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default Adjustments;
