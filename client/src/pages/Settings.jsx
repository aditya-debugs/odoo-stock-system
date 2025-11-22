import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import usePermissions from "../hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";

const Settings = () => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("warehouses");
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modal states
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  
  // Form states
  const [warehouseForm, setWarehouseForm] = useState({
    warehouse_name: "",
    warehouse_code: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });
  
  const [locationForm, setLocationForm] = useState({
    location_name: "",
    location_code: "",
    location_type: "Internal",
    warehouse_key: "",
    parent_location_key: "",
    barcode: "",
  });

  // Redirect if not Inventory Manager
  useEffect(() => {
    if (!permissions.isInventoryManager) {
      navigate("/dashboard");
    }
  }, [permissions, navigate]);

  // Fetch warehouses
  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/warehouses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setWarehouses(data.data);
      }
    } catch (err) {
      setError("Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/locations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setLocations(data.data);
      }
    } catch (err) {
      setError("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "warehouses") {
      fetchWarehouses();
    } else {
      fetchLocations();
      fetchWarehouses(); // Needed for warehouse dropdown in location form
    }
  }, [activeTab]);

  // Warehouse handlers
  const handleWarehouseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = editingWarehouse
        ? `http://localhost:5000/api/warehouses/${editingWarehouse.warehouse_key}`
        : "http://localhost:5000/api/warehouses";
      
      const method = editingWarehouse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(warehouseForm),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setIsWarehouseModalOpen(false);
        resetWarehouseForm();
        fetchWarehouses();
      } else {
        setError(data.message || "Operation failed");
      }
    } catch (err) {
      setError("Failed to save warehouse");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateWarehouse = async (warehouseKey) => {
    if (!confirm("Are you sure you want to deactivate this warehouse?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/warehouses/${warehouseKey}/deactivate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchWarehouses();
      }
    } catch (err) {
      setError("Failed to deactivate warehouse");
    }
  };

  const handleReactivateWarehouse = async (warehouseKey) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/warehouses/${warehouseKey}/reactivate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchWarehouses();
      }
    } catch (err) {
      setError("Failed to reactivate warehouse");
    }
  };

  // Location handlers
  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = editingLocation
        ? `http://localhost:5000/api/locations/${editingLocation.location_key}`
        : "http://localhost:5000/api/locations";
      
      const method = editingLocation ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(locationForm),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setIsLocationModalOpen(false);
        resetLocationForm();
        fetchLocations();
      } else {
        setError(data.message || "Operation failed");
      }
    } catch (err) {
      setError("Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateLocation = async (locationKey) => {
    if (!confirm("Are you sure you want to deactivate this location?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/locations/${locationKey}/deactivate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchLocations();
      }
    } catch (err) {
      setError("Failed to deactivate location");
    }
  };

  const handleReactivateLocation = async (locationKey) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/locations/${locationKey}/reactivate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchLocations();
      }
    } catch (err) {
      setError("Failed to reactivate location");
    }
  };

  const resetWarehouseForm = () => {
    setWarehouseForm({
      warehouse_name: "",
      warehouse_code: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    });
    setEditingWarehouse(null);
  };

  const resetLocationForm = () => {
    setLocationForm({
      location_name: "",
      location_code: "",
      location_type: "Internal",
      warehouse_key: "",
      parent_location_key: "",
      barcode: "",
    });
    setEditingLocation(null);
  };

  const openEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse);
    setWarehouseForm({
      warehouse_name: warehouse.warehouse_name,
      warehouse_code: warehouse.warehouse_code || "",
      address: warehouse.address || "",
      city: warehouse.city || "",
      state: warehouse.state || "",
      country: warehouse.country || "",
      postal_code: warehouse.postal_code || "",
    });
    setIsWarehouseModalOpen(true);
  };

  const openEditLocation = (location) => {
    setEditingLocation(location);
    setLocationForm({
      location_name: location.location_name,
      location_code: location.location_code || "",
      location_type: location.location_type || "Internal",
      warehouse_key: location.warehouse_key || "",
      parent_location_key: location.parent_location_key || "",
      barcode: location.barcode || "",
    });
    setIsLocationModalOpen(true);
  };

  if (!permissions.isInventoryManager) {
    return null;
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p className="settings-subtitle">Manage warehouses and storage locations</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✓</span>
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === "warehouses" ? "active" : ""}`}
          onClick={() => setActiveTab("warehouses")}
        >
          🏢 Warehouses
        </button>
        <button
          className={`tab-button ${activeTab === "locations" ? "active" : ""}`}
          onClick={() => setActiveTab("locations")}
        >
          📍 Locations
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "warehouses" && (
          <div className="warehouses-section">
            <div className="section-header">
              <h2>Warehouses</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  resetWarehouseForm();
                  setIsWarehouseModalOpen(true);
                }}
              >
                + Add Warehouse
              </button>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Code</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Locations</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouses.map((warehouse) => (
                      <tr key={warehouse.warehouse_key}>
                        <td>{warehouse.warehouse_name}</td>
                        <td>{warehouse.warehouse_code || "-"}</td>
                        <td>{warehouse.city || "-"}</td>
                        <td>
                          <span className={`status-badge ${warehouse.is_active ? "active" : "inactive"}`}>
                            {warehouse.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>{warehouse.locations?.length || 0}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-edit"
                              onClick={() => openEditWarehouse(warehouse)}
                            >
                              Edit
                            </button>
                            {warehouse.is_active ? (
                              <button
                                className="btn-deactivate"
                                onClick={() => handleDeactivateWarehouse(warehouse.warehouse_key)}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                className="btn-activate"
                                onClick={() => handleReactivateWarehouse(warehouse.warehouse_key)}
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "locations" && (
          <div className="locations-section">
            <div className="section-header">
              <h2>Storage Locations</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  resetLocationForm();
                  setIsLocationModalOpen(true);
                }}
              >
                + Add Location
              </button>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Warehouse</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((location) => (
                      <tr key={location.location_key}>
                        <td>{location.location_name}</td>
                        <td>{location.location_code || "-"}</td>
                        <td>{location.location_type || "-"}</td>
                        <td>{location.warehouse?.warehouse_name || "-"}</td>
                        <td>
                          <span className={`status-badge ${location.is_active ? "active" : "inactive"}`}>
                            {location.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-edit"
                              onClick={() => openEditLocation(location)}
                            >
                              Edit
                            </button>
                            {location.is_active ? (
                              <button
                                className="btn-deactivate"
                                onClick={() => handleDeactivateLocation(location.location_key)}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                className="btn-activate"
                                onClick={() => handleReactivateLocation(location.location_key)}
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warehouse Modal */}
      {isWarehouseModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWarehouseModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}</h2>
              <button className="modal-close" onClick={() => setIsWarehouseModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleWarehouseSubmit}>
              <div className="form-group">
                <label>Warehouse Name *</label>
                <input
                  type="text"
                  value={warehouseForm.warehouse_name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, warehouse_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Warehouse Code</label>
                <input
                  type="text"
                  value={warehouseForm.warehouse_code}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, warehouse_code: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={warehouseForm.address}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={warehouseForm.city}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={warehouseForm.state}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, state: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={warehouseForm.country}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, country: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={warehouseForm.postal_code}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, postal_code: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsWarehouseModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Saving..." : editingWarehouse ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLocation ? "Edit Location" : "Add New Location"}</h2>
              <button className="modal-close" onClick={() => setIsLocationModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleLocationSubmit}>
              <div className="form-group">
                <label>Location Name *</label>
                <input
                  type="text"
                  value={locationForm.location_name}
                  onChange={(e) => setLocationForm({ ...locationForm, location_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location Code</label>
                <input
                  type="text"
                  value={locationForm.location_code}
                  onChange={(e) => setLocationForm({ ...locationForm, location_code: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Location Type</label>
                <select
                  value={locationForm.location_type}
                  onChange={(e) => setLocationForm({ ...locationForm, location_type: e.target.value })}
                >
                  <option value="Internal">Internal</option>
                  <option value="Transit">Transit</option>
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                </select>
              </div>
              <div className="form-group">
                <label>Warehouse</label>
                <select
                  value={locationForm.warehouse_key}
                  onChange={(e) => setLocationForm({ ...locationForm, warehouse_key: e.target.value })}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.filter(w => w.is_active).map((warehouse) => (
                    <option key={warehouse.warehouse_key} value={warehouse.warehouse_key}>
                      {warehouse.warehouse_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Barcode</label>
                <input
                  type="text"
                  value={locationForm.barcode}
                  onChange={(e) => setLocationForm({ ...locationForm, barcode: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsLocationModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Saving..." : editingLocation ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
