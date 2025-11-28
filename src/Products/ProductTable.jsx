import React from "react";
import "./ProductTable.css";

const ProductTable = ({ products = [], loading, onEditProduct, onDeleteProduct, onAdjustQuantity }) => {
  if (loading) {
    return (
      <div className="product-table-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  const getQuantityStatus = (quantity) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity < 10) return "low-stock";
    return "in-stock";
  };

  const getQuantityText = (quantity) => {
    if (quantity === 0) return "Sin Stock";
    if (quantity < 10) return `Bajo (${quantity})`;
    return quantity;
  };

  return (
    <div className="product-table-container">
      <div className="table-header">
        <div>
          <h2 className="table-title">Lista de Productos</h2>
          <p className="table-subtitle">
            {products.length} producto{products.length !== 1 ? 's' : ''} en inventario
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  <div className="empty-state">
                    <span className="empty-icon">📦</span>
                    <p>No hay productos registrados</p>
                    <small>Agrega tu primer producto para comenzar</small>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="product-row">
                  <td className="product-name">
                    <strong>{product.name}</strong>
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td className="price-cell">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td>
                    <div className="quantity-controls">
                      <span className={`quantity-status ${getQuantityStatus(product.quantity)}`}>
                        {getQuantityText(product.quantity)}
                      </span>
                      <div className="quantity-buttons">
                        <button 
                          className="btn-quantity decrease"
                          onClick={() => onAdjustQuantity(product.id, -1)}
                          disabled={product.quantity <= 0}
                          title="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="quantity-value">{product.quantity}</span>
                        <button 
                          className="btn-quantity increase"
                          onClick={() => onAdjustQuantity(product.id, 1)}
                          title="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>{product.supplier}</td>
                  <td className="actions">
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => onEditProduct(product)}
                        title="Editar producto"
                      >
                        <span className="btn-icon">✏️</span>
                        <span className="btn-text">Editar</span>
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => onDeleteProduct(product.id)}
                        title="Eliminar producto"
                      >
                        <span className="btn-icon">🗑️</span>
                        <span className="btn-text">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;