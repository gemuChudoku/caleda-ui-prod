import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/apiConfig';
import './RefundsForm.css';

const RefundsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sale_id: '',
    product_name: '',
    client_name: '',
    seller: '', 
    refund_date: new Date().toISOString().split('T')[0],
    quantity: 1,
    unit_price: 0,
    total_amount: 0,
    reason: '',
    status: 'pending'
  });

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    const total = formData.quantity * formData.unit_price;
    setFormData(prev => ({
      ...prev,
      total_amount: parseFloat(total.toFixed(2))
    }));
  }, [formData.quantity, formData.unit_price]);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(API_ENDPOINTS.sales, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'sale_id') {
      const selectedSale = sales.find(sale => sale.id === value);
      if (selectedSale) {
        setFormData(prev => ({
          ...prev,
          sale_id: value,
          product_name: selectedSale.producto,
          client_name: selectedSale.cliente,
          seller: selectedSale.vendedor, 
          unit_price: selectedSale.precioUnitario
        }));
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unit_price' ? 
              parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación adicional
    if (!formData.seller) {
      alert('❌ Error: El campo vendedor es requerido');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      console.log('📤 Enviando datos:', formData); // Debug
      
      const response = await fetch(API_ENDPOINTS.createRefunds, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        },
        body: JSON.stringify(formData)
      });

      console.log('📞 Response status:', response.status); // Debug

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta del servidor:', data); // Debug
        alert('✅ Devolución registrada exitosamente');
        navigate('/refunds');
      } else {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText); // Debug
        alert('❌ Error: ' + (errorText || 'No se pudo registrar la devolución'));
      }
    } catch (error) {
      console.error('Error submitting refund:', error);
      alert('❌ Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/refunds');
  };

  return (
    <div className="refunds-container">
      {/* Botón volver */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Volver al Dashboard
        </button>
      </div>

      <div className="refunds-header">
        <h1 className="company-name">Caleda Smart</h1>
        <h2 className="page-title">Registrar Nueva Devolución</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="refunds-card">
          <h3 className="card-title">Información de la Devolución</h3>
          
          {/* Fecha de Devolución */}
          <div className="form-group">
            <label className="form-label">Fecha de Devolución</label>
            <input
              type="date"
              className="form-control"
              name="refund_date"
              value={formData.refund_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Selección de Venta */}
          <div className="form-group">
            <label className="form-label" htmlFor="sale_id">Venta a Devolver *</label>
            <select 
              className="form-select" 
              id="sale_id"
              name="sale_id"
              value={formData.sale_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar venta</option>
              {sales.map(sale => (
                <option key={sale.id} value={sale.id}>
                  Venta #{sale.id} - {sale.producto} - {sale.cliente} - ${sale.total}
                </option>
              ))}
            </select>
          </div>

          {/* Información de Producto */}
          <div className="form-group">
            <label className="form-label" htmlFor="product_name">Producto *</label>
            <input
              type="text"
              className="form-control"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              placeholder="Nombre del producto"
            />
          </div>

          {/* Información del Cliente */}
          <div className="form-group">
            <label className="form-label" htmlFor="client_name">Cliente *</label>
            <input
              type="text"
              className="form-control"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              placeholder="Nombre del cliente"
            />
          </div>

          {/* Información del Vendedor */}
          <div className="form-group">
            <label className="form-label" htmlFor="seller">Vendedor *</label>
            <input
              type="text"
              className="form-control"
              id="seller"
              name="seller"
              value={formData.seller}
              onChange={handleChange}
              required
              placeholder="ID o nombre del vendedor"
            />
          </div>

          {/* Cantidad a Devolver */}
          <div className="form-group">
            <label className="form-label" htmlFor="quantity">Cantidad a Devolver *</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          {/* Precio Unitario */}
          <div className="form-group">
            <label className="form-label" htmlFor="unit_price">Precio Unitario *</label>
            <input
              type="number"
              className="form-control"
              id="unit_price"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Total (calculado automáticamente) */}
          <div className="form-group">
            <label className="form-label">Total a Reembolsar</label>
            <div className="total-display">
              ${formData.total_amount.toFixed(2)}
            </div>
            <input
              type="hidden"
              name="total_amount"
              value={formData.total_amount}
            />
          </div>

          {/* Motivo de Devolución */}
          <div className="form-group">
            <label className="form-label" htmlFor="reason">Motivo de Devolución *</label>
            <select 
              className="form-select" 
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar motivo</option>
              <option value="Producto defectuoso">Producto defectuoso</option>
              <option value="Producto incorrecto">Producto incorrecto</option>
              <option value="Cliente insatisfecho">Cliente insatisfecho</option>
              <option value="Error en el pedido">Error en el pedido</option>
              <option value="Cambio de opinión">Cambio de opinión</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          {/* Estado de la Devolución */}
          <div className="form-group">
            <label className="form-label" htmlFor="status">Estado</label>
            <select 
              className="form-select" 
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobada</option>
              <option value="rejected">Rechazada</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          {/* Información Adicional */}
          <div className="info-box">
            <div className="info-title">Información Importante</div>
            <ul className="info-list">
              <li>✅ Al seleccionar una venta, la información se completará automáticamente</li>
              <li>✅ El total se calcula automáticamente (Cantidad × Precio Unitario)</li>
              <li>✅ Verifica que la información coincida con la venta original</li>
              <li>✅ El estado "Pendiente" requiere aprobación</li>
            </ul>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="action-buttons">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Registrar Devolución'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RefundsForm;