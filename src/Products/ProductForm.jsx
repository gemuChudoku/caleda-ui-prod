import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ onAddProduct, onUpdateProduct, editingProduct, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    supplier: "",
    category: ""
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        price: editingProduct.price || "",
        quantity: editingProduct.quantity || "",
        supplier: editingProduct.supplier || "",
        category: editingProduct.category || ""
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    };

    if (editingProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
  };

  return (
    
    <div className="product-form-container">
      <div className="form-header">
        <h2 className="product-form-title">
          {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h2>
        <p className="product-form-subtitle">
          {editingProduct ? 'Actualiza la información del producto.' : 'Completa la información del producto.'}
        </p>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría *</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="">Seleccionar categoría</option>
              <option value="Electrónicos">Electrónicos</option>
              <option value="Oficina">Oficina</option>
              <option value="Hogar">Hogar</option>
              <option value="Deportes">Deportes</option>
              <option value="Ropa">Ropa</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Limpieza">Limpieza</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Precio ($) *</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              min="0"
              step="0.01"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Cantidad *</label>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              min="0"
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="supplier">Proveedor *</label>
          <input 
            type="text" 
            id="supplier" 
            name="supplier" 
            value={formData.supplier} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-buttons">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;