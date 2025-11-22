import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import usePermissions from "../../hooks/usePermissions";
import api from "../../utils/api";

const Transfers = () => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  
  const [formData, setFormData] = useState({
    source_location_key: "",
    destination_location_key: "",
    transfer_date: new Date().toISOString().split('T')[0],
    notes: "",
    items: [],
  });

  const [currentItem, setCurrentItem] = useState({
    product_key: "",
    quantity: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transfersRes, warehousesRes, locationsRes, productsRes] = await Promise.all([
        api.get("/operations/transfers"),
        api.get("/warehouses?active=true"),
        api.get("/locations?active=true"),
        api.get("/products?active=true"),
      ]);

      setTransfers(transfersRes.data.data || []);
      setWarehouses(warehousesRes.data.data || []);
      setLocations(locationsRes.data.data || []);
      setProducts(productsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransfer = () => {
    setSelectedTransfer(null);
    setFormData({
      source_location_key: "",
      destination_location_key: "",
      transfer_date: new Date().toISOString().split('T')[0],
      notes: "",
      items: [],
    });
    setShowModal(true);
  };

  const handleAddItem = () => {
    if (!currentItem.product_key || currentItem.quantity <= 0) {
      alert("Please select a product and enter a valid quantity");
      return;
    }

    const product = products.find(p => p.product_key === parseInt(currentItem.product_key));
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...currentItem, product_name: product?.name }]
    }));
    setCurrentItem({ product_key: "", quantity: 0 });
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      alert("Please add at least one item to transfer");
      return;
    }

    if (formData.source_location_key === formData.destination_location_key) {
      alert("Source and destination locations must be different");
      return;
    }

    try {
      await api.post("/operations/transfers", formData);
      alert("Transfer created successfully! Click 'Validate' to execute the stock movement.");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error creating transfer:", error);
      alert(error.response?.data?.message || "Failed to create transfer");
    }
  };

  const handleValidate = async (transferKey) => {
    if (!confirm("Are you sure you want to validate this transfer? This will update stock quantities.")) {
      return;
    }

    try {
      await api.post(`/operations/transfers/${transferKey}/validate`);
      alert("Transfer validated successfully! Stock has been moved.");
      fetchData();
    } catch (error) {
      console.error("Error validating transfer:", error);
      alert(error.response?.data?.message || "Failed to validate transfer");
    }
  };

  const getLocationName = (locationKey) => {
    const location = locations.find(l => l.location_key === locationKey);
    return location?.location_name || "Unknown";
  };

  if (loading) {
    return <div className="loading">Loading transfers...</div>;
  }

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <div className="page-header">
        <h1>🔄 Internal Transfers</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
          Transfer stock between locations or warehouses
        </p>
      </div>

      {(permissions.canExecuteOperations || permissions.canExecuteInventory) && (
        <button onClick={handleCreateTransfer} className="btn-primary" style={{ marginTop: "1.5rem" }}>
          + Create Transfer
        </button>
      )}

      <div style={{ marginTop: "2rem", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <table className="products-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transfers.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No transfers found. Create your first transfer to get started.
                </td>
              </tr>
            ) : (
              transfers.map((transfer) => (
                <tr key={transfer.transfer_key}>
                  <td>{transfer.reference || `TRF-${transfer.transfer_key}`}</td>
                  <td>{new Date(transfer.transfer_date).toLocaleDateString()}</td>
                  <td>{getLocationName(transfer.source_location_key)}</td>
                  <td>{getLocationName(transfer.destination_location_key)}</td>
                  <td>{transfer.items?.length || 0} items</td>
                  <td>
                    <span className={`status-badge ${transfer.status === 'validated' ? 'status-ok' : 'status-warning'}`}>
                      {transfer.status || 'Draft'}
                    </span>
                  </td>
                  <td>
                    {transfer.status !== 'validated' && (permissions.canExecuteOperations || permissions.canExecuteInventory) && (
                      <button onClick={() => handleValidate(transfer.transfer_key)} className="btn-primary btn-sm">
                        Validate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Internal Transfer</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Source Location *</label>
                  <select
                    value={formData.source_location_key}
                    onChange={(e) => setFormData({ ...formData, source_location_key: e.target.value })}
                    required
                  >
                    <option value="">Select source location</option>
                    {locations.map((loc) => (
                      <option key={loc.location_key} value={loc.location_key}>
                        {loc.location_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Destination Location *</label>
                  <select
                    value={formData.destination_location_key}
                    onChange={(e) => setFormData({ ...formData, destination_location_key: e.target.value })}
                    required
                  >
                    <option value="">Select destination location</option>
                    {locations.map((loc) => (
                      <option key={loc.location_key} value={loc.location_key}>
                        {loc.location_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Transfer Date</label>
                <input
                  type="date"
                  value={formData.transfer_date}
                  onChange={(e) => setFormData({ ...formData, transfer_date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  placeholder="Optional notes about this transfer"
                />
              </div>

              <hr style={{ margin: "1.5rem 0" }} />
              
              <h3 style={{ marginBottom: "1rem" }}>Items to Transfer</h3>
              
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Product</label>
                  <select
                    value={currentItem.product_key}
                    onChange={(e) => setCurrentItem({ ...currentItem, product_key: e.target.value })}
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.product_key} value={p.product_key}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
                  <button type="button" onClick={handleAddItem} className="btn-secondary">
                    Add Item
                  </button>
                </div>
              </div>

              {formData.items.length > 0 && (
                <table className="products-table" style={{ marginTop: "1rem" }}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <button type="button" onClick={() => handleRemoveItem(index)} className="btn-danger btn-sm">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Transfer (Draft)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;
