import React, { useState, useEffect } from "react";
import "./SaleForm2.css";

const SaleForm = ({ onAddSale, onUpdateSale, editingSale, onCancel }) => {
  const [formData, setFormData] = useState({
    id: "",
    fecha: "",
    producto: "",
    cantidad: 1,
    precioUnitario: 0,
    total: 0,
    cliente: "",
    vendedor: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcular total automáticamente
  useEffect(() => {
    if (editingSale) {
      setFormData({
        ...editingSale,
        fecha: editingSale.fecha.split('T')[0] // Formatear fecha para input type="date"
      });
    } else {
      // Generar ID automático para nueva venta
      const newId = `VNT${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({
        ...prev,
        id: newId,
        fecha: new Date().toISOString().split('T')[0]
      }));
    }
  }, [editingSale]);

  // Calcular total cuando cambia cantidad o precio
  useEffect(() => {
  const cantidadNum = Number(formData.cantidad || 0);
  const precioNum = Number(formData.precioUnitario || 0);

  const total = cantidadNum * precioNum;

  setFormData(prev => ({
    ...prev,
    total
  }));
}, [formData.cantidad, formData.precioUnitario]);


  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value   // mantener STRING
  }));
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Preparar los datos para enviar
      const saleData = {
        ...formData,
        fecha: new Date(formData.fecha).toISOString() // Convertir a formato ISO
      };

      if (editingSale) {
        await onUpdateSale(saleData);
      } else {
        await onAddSale(saleData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>{editingSale ? 'Editar Venta' : 'Nueva Venta'}</h2>
          <button className="btn-close" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="sale-form">
          <div className="form-grid">
            <div className="form-group">
              <label>ID Venta *</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                disabled={!!editingSale}
              />
            </div>

            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Producto *</label>
              <input
                type="text"
                name="producto"
                value={formData.producto}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div className="form-group">
              <label>Cliente *</label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Nombre del cliente"
                required
              />
            </div>

            <div className="form-group">
              <label>Cantidad *</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Precio Unitario *</label>
              <input
                type="number"
                name="precioUnitario"
                value={formData.precioUnitario}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Vendedor *</label>
              <input
                type="text"
                name="vendedor"
                value={formData.vendedor}
                onChange={handleChange}
                placeholder="Nombre del vendedor"
                required
              />
            </div>

            <div className="form-group total-display">
              <label>Total</label>
              <div className="total-amount">
                ${formData.total.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : (editingSale ? 'Actualizar Venta' : 'Crear Venta')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;