import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import usePermissions from "../hooks/usePermissions";
import api from "../utils/api";
import "../styles/products.css";

const Products = () => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductStock, setSelectedProductStock] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category_key: "",
    uom: "Pieces",
    reorder_point: 0,
    price: 0,
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filterCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterCategory) params.category_key = filterCategory;
      params.is_active = true;

      const response = await api.get("/products", { params });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories", { params: { is_active: true } });
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProductStock = async (product_key) => {
    try {
      const response = await api.get(`/products/${product_key}/stock`);
      setSelectedProductStock(response.data.data);
    } catch (error) {
      console.error("Error fetching product stock:", error);
      alert("Failed to fetch product stock");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      sku: "",
      description: "",
      category_key: "",
      uom: "Pieces",
      reorder_point: 0,
      price: 0,
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      category_key: product.category_key || "",
      uom: product.uom,
      reorder_point: product.reorder_point || 0,
      price: product.price || 0,
    });
    setShowModal(true);
  };

  const handleViewStock = async (product) => {
    setSelectedProduct(product);
    await fetchProductStock(product.product_key);
    setShowStockModal(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.product_key}`, formData);
        alert("Product updated successfully!");
      } else {
        await api.post("/products", formData);
        alert("Product created successfully!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleDeactivateProduct = async (product_key) => {
    if (!window.confirm("Are you sure you want to deactivate this product?")) return;

    try {
      await api.patch(`/products/${product_key}/deactivate`);
      alert("Product deactivated successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deactivating product:", error);
      alert("Failed to deactivate product");
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setCategoryFormData({ name: "", description: "" });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowCategoryModal(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory.category_key}`, categoryFormData);
        alert("Category updated successfully!");
      } else {
        await api.post("/categories", categoryFormData);
        alert("Category created successfully!");
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || "Failed to save category");
    }
  };

  const handleDeactivateCategory = async (category_key) => {
    if (!window.confirm("Are you sure you want to deactivate this category?")) return;

    try {
      await api.patch(`/categories/${category_key}/deactivate`);
      alert("Category deactivated successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deactivating category:", error);
      alert(error.response?.data?.message || "Failed to deactivate category");
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>📦 Product Management</h1>
        <div className="header-buttons">
          <button onClick={() => setActiveTab("products")} className={activeTab === "products" ? "tab-btn active" : "tab-btn"}>
            Products
          </button>
          <button onClick={() => setActiveTab("categories")} className={activeTab === "categories" ? "tab-btn active" : "tab-btn"}>
            Categories
          </button>
        </div>
      </div>

      {!permissions.canWriteProducts && (
        <div className="info-banner" style={{ background: "#e3f2fd", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px", color: "#1976d2" }}>
          <strong>👁️ View Only Access:</strong> You can view product information and stock availability. Contact your Inventory Manager to create or modify products.
        </div>
      )}

      {activeTab === "products" && (
        <>
          <div className="products-controls">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn-search">
                Search
              </button>
            </form>

            <div className="filter-group">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category_key} value={cat.category_key}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {permissions.canWriteProducts && (
              <button onClick={handleCreateProduct} className="btn-primary">
                + Add Product
              </button>
            )}
          </div>

          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>UoM</th>
                  <th>Total Stock</th>
                  <th>Available</th>
                  <th>Reorder Point</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.product_key} className={product.needs_reorder ? "low-stock" : ""}>
                      <td>{product.sku}</td>
                      <td>{product.name}</td>
                      <td>{product.category?.name || "—"}</td>
                      <td>{product.uom}</td>
                      <td>{product.total_stock}</td>
                      <td>{product.total_available}</td>
                      <td>{product.reorder_point || "—"}</td>
                      <td>
                        <span className={`status-badge ${product.needs_reorder ? "status-warning" : "status-ok"}`}>
                          {product.needs_reorder ? "Low Stock" : "OK"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleViewStock(product)} className="btn-secondary btn-sm">
                            Stock
                          </button>
                          {permissions.canWriteProducts && (
                            <>
                              <button onClick={() => handleEditProduct(product)} className="btn-secondary btn-sm">
                                Edit
                              </button>
                              <button onClick={() => handleDeactivateProduct(product.product_key)} className="btn-danger btn-sm">
                                Deactivate
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "categories" && (
        <>
          {permissions.canWriteProducts && (
            <div className="categories-controls">
              <button onClick={handleCreateCategory} className="btn-primary">
                + Add Category
              </button>
            </div>
          )}

          <div className="categories-grid">
            {categories.length === 0 ? (
              <div className="no-data">No categories found</div>
            ) : (
              categories.map((category) => (
                <div key={category.category_key} className="category-card">
                  <h3>{category.name}</h3>
                  <p>{category.description || "No description"}</p>
                  <div className="category-meta">
                    <span>{category.dataValues?.product_count || 0} products</span>
                  </div>
                  {permissions.canWriteProducts && (
                    <div className="category-actions">
                      <button onClick={() => handleEditCategory(category)} className="btn-secondary btn-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDeactivateCategory(category.category_key)} className="btn-danger btn-sm">
                        Deactivate
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProduct ? "Edit Product" : "Create Product"}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="modal-body">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  disabled={!!selectedProduct}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category_key} onChange={(e) => setFormData({ ...formData, category_key: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_key} value={cat.category_key}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit of Measure *</label>
                  <input
                    type="text"
                    value={formData.uom}
                    onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                    placeholder="e.g., Pieces, Kg, Liters"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Reorder Point
                    <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>
                      (Minimum stock threshold)
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.reorder_point}
                    onChange={(e) => setFormData({ ...formData, reorder_point: e.target.value })}
                    placeholder="Alert when stock falls below this"
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Unit price"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStockModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Stock for {selectedProduct.name}</h2>
              <button onClick={() => setShowStockModal(false)} className="modal-close">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Location</th>
                    <th>Total Quantity</th>
                    <th>Reserved</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProductStock.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No stock records found
                      </td>
                    </tr>
                  ) : (
                    selectedProductStock.map((stock) => (
                      <tr key={stock.stock_key}>
                        <td>{stock.location?.warehouse?.name || "—"}</td>
                        <td>{stock.location?.name || "—"}</td>
                        <td>{parseFloat(stock.quantity).toFixed(2)}</td>
                        <td>{parseFloat(stock.reserved_quantity).toFixed(2)}</td>
                        <td>{stock.available_quantity.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCategory ? "Edit Category" : "Create Category"}</h2>
              <button onClick={() => setShowCategoryModal(false)} className="modal-close">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitCategory} className="modal-body">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
