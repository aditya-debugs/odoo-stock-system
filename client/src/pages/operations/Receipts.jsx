import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import usePermissions from "../../hooks/usePermissions";
import api from "../../utils/api";

const Receipts = () => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const [receipts, setReceipts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [formData, setFormData] = useState({
    supplier_name: "",
    destination_location_key: "",
    receipt_date: new Date().toISOString().split("T")[0],
    notes: "",
    lines: [],
  });

  useEffect(() => {
    fetchReceipts();
    fetchLocations();
    fetchProducts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/operations/receipts");
      setReceipts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
      alert("Failed to load receipts");
    } finally {
      setLoading(false);
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

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products?active=true");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleOpenModal = (receipt = null) => {
    if (receipt) {
      setEditingReceipt(receipt);
      setFormData({
        supplier_name: receipt.supplier_name || "",
        destination_location_key: receipt.destination_location_key,
        receipt_date: receipt.receipt_date.split("T")[0],
        notes: receipt.notes || "",
        lines: receipt.lines.map(line => ({
          product_key: line.product_key,
          quantity: line.quantity,
        })),
      });
    } else {
      setEditingReceipt(null);
      setFormData({
        supplier_name: "",
        destination_location_key: "",
        receipt_date: new Date().toISOString().split("T")[0],
        notes: "",
        lines: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReceipt(null);
  };

  const handleAddLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { product_key: "", quantity: 0 }],
    });
  };

  const handleRemoveLine = (index) => {
    setFormData({
      ...formData,
      lines: formData.lines.filter((_, i) => i !== index),
    });
  };

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...formData.lines];
    updatedLines[index][field] = value;
    setFormData({ ...formData, lines: updatedLines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.destination_location_key) {
      alert("Please select a destination location");
      return;
    }

    if (formData.lines.length === 0) {
      alert("Please add at least one product line");
      return;
    }

    try {
      if (editingReceipt) {
        await api.put(`/operations/receipts/${editingReceipt.receipt_key}`, formData);
        alert("Receipt updated successfully");
      } else {
        await api.post("/operations/receipts", formData);
        alert("Receipt created successfully");
      }
      handleCloseModal();
      fetchReceipts();
    } catch (error) {
      console.error("Failed to save receipt:", error);
      alert(error.response?.data?.message || "Failed to save receipt");
    }
  };

  const handleValidate = async (receiptKey) => {
    if (!confirm("Are you sure you want to validate this receipt? This will update stock quantities.")) {
      return;
    }

    try {
      await api.post(`/operations/receipts/${receiptKey}/validate`);
      alert("Receipt validated successfully");
      fetchReceipts();
    } catch (error) {
      console.error("Failed to validate receipt:", error);
      alert(error.response?.data?.message || "Failed to validate receipt");
    }
  };

  const handleDelete = async (receiptKey) => {
    if (!confirm("Are you sure you want to delete this receipt?")) {
      return;
    }

    try {
      await api.delete(`/operations/receipts/${receiptKey}`);
      alert("Receipt deleted successfully");
      fetchReceipts();
    } catch (error) {
      console.error("Failed to delete receipt:", error);
      alert(error.response?.data?.message || "Failed to delete receipt");
    }
  };

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <div className="page-header">
        <h1>📥 Receipts</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
          Manage incoming stock receipts from suppliers
        </p>
      </div>

      {permissions.canExecuteOperations && (
        <button className="btn-primary" style={{ marginTop: "1.5rem" }} onClick={() => handleOpenModal()}>
          + Create Receipt
        </button>
      )}

      <div style={{ marginTop: "2rem", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>Loading receipts...</p>
        ) : receipts.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No receipts found. Create your first receipt!</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Receipt ID</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Supplier</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Destination</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Date</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Items</th>
                <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.receipt_key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "1rem" }}>{receipt.receipt_id}</td>
                  <td style={{ padding: "1rem" }}>{receipt.supplier_name || "N/A"}</td>
                  <td style={{ padding: "1rem" }}>{receipt.destination?.location_name}</td>
                  <td style={{ padding: "1rem" }}>{new Date(receipt.receipt_date).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      background: receipt.status === "validated" ? "#dcfce7" : "#fef3c7",
                      color: receipt.status === "validated" ? "#166534" : "#92400e",
                    }}>
                      {receipt.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>{receipt.lines?.length || 0}</td>
                  <td style={{ padding: "1rem" }}>
                    {receipt.status === "draft" && permissions.canExecuteOperations && (
                      <>
                        <button
                          onClick={() => handleOpenModal(receipt)}
                          style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: "6px", background: "white", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleValidate(receipt.receipt_key)}
                          style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", border: "none", borderRadius: "6px", background: "#10b981", color: "white", cursor: "pointer" }}
                        >
                          Validate
                        </button>
                        <button
                          onClick={() => handleDelete(receipt.receipt_key)}
                          style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "6px", background: "#ef4444", color: "white", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {receipt.status === "validated" && (
                      <span style={{ color: "#10b981", fontSize: "1.25rem" }}>✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "12px", width: "90%", maxWidth: "800px", maxHeight: "90vh", overflow: "auto", padding: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>{editingReceipt ? "Edit Receipt" : "Create Receipt"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Supplier Name</label>
                <input
                  type="text"
                  value={formData.supplier_name}
                  onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  placeholder="Enter supplier name"
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Destination Location *</label>
                <select
                  value={formData.destination_location_key}
                  onChange={(e) => setFormData({ ...formData, destination_location_key: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
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

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Receipt Date</label>
                <input
                  type="date"
                  value={formData.receipt_date}
                  onChange={(e) => setFormData({ ...formData, receipt_date: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px", minHeight: "80px" }}
                  placeholder="Additional notes"
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <label style={{ fontWeight: "600" }}>Products</label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "6px", background: "#3b82f6", color: "white", cursor: "pointer" }}
                  >
                    + Add Product
                  </button>
                </div>

                {formData.lines.map((line, index) => (
                  <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 150px 50px", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <select
                      value={line.product_key}
                      onChange={(e) => handleLineChange(index, "product_key", e.target.value)}
                      style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((prod) => (
                        <option key={prod.product_key} value={prod.product_key}>
                          {prod.product_name} ({prod.sku})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={line.quantity || ""}
                      onChange={(e) => handleLineChange(index, "quantity", parseFloat(e.target.value) || 0)}
                      style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                      placeholder="Quantity"
                      min="0"
                      step="0.01"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(index)}
                      style={{ padding: "0.5rem", border: "none", borderRadius: "6px", background: "#ef4444", color: "white", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{ padding: "0.75rem 1.5rem", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: "8px", background: "#3b82f6", color: "white", cursor: "pointer" }}
                >
                  {editingReceipt ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;
