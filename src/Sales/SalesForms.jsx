import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SaleForm from "./SaleForm2";
import { API_ENDPOINTS } from "../config/apiConfig";
import "./Sales.css";

const Sales = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSale, setEditingSale] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = async (newSale) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(API_ENDPOINTS.createSale, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        },
        body: JSON.stringify(newSale)
      });

      if (response.ok) {
        await fetchSales();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  const handleEditSale = (sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleUpdateSale = async (updatedSale) => {
    try {
      const token = localStorage.getItem('jwt');
      
      // ✅ CAMBIO: Usar _id en lugar de id para la URL
      const response = await fetch(`${API_ENDPOINTS.sales}/${editingSale._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        },
        body: JSON.stringify(updatedSale)
      });

      if (response.ok) {
        await fetchSales();
        setEditingSale(null);
        setShowForm(false);
      } else {
        const errorData = await response.json();
        console.error('Error en response:', errorData);
      }
    } catch (error) {
      console.error('Error updating sale:', error);
    }
  };

  // En handleDeleteSale - DEBERÍA funcionar ahora:
const handleDeleteSale = async (saleId) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
    try {
      const token = localStorage.getItem('jwt');
      
      console.log('🗑️ Eliminando venta con ID:', saleId);
      console.log('📡 URL:', `${API_ENDPOINTS.deleteSale(saleId)}`);
      
      const response = await fetch(`${API_ENDPOINTS.deleteSale(saleId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        }
      });

      console.log('📞 Status:', response.status);
      
      if (response.ok) {
        await fetchSales();
        console.log('✅ Venta eliminada exitosamente');
      } else {
        const errorText = await response.text();
        console.error('❌ Error eliminando venta:', errorText);
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  }
};

  const handleCancelForm = () => {
    setEditingSale(null);
    setShowForm(false);
  };

  // Calcular estadísticas
  const totalVentas = sales.length;
  const totalIngresos = sales.reduce((sum, sale) => sum + sale.total, 0);
  const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="sales-page">
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

      {/* Header */}
      <div className="sales-header">
        <div>
          <h1 className="sales-title">Gestión de Ventas</h1>
          <p className="sales-subtitle">
            Registra y consulta todas las transacciones de ventas
          </p>
        </div>
        <button 
          className="btn-primary2"
          onClick={() => setShowForm(true)}
        >
          + Nueva Venta
        </button>
      </div>

      {/* Estadísticas */}
      <div className="sales-stats">
        <div className="stat-card">
          <h3>Total Ventas</h3>
          <div className="value">{totalVentas}</div>
          <small>Transacciones registradas</small>
        </div>
        <div className="stat-card">
          <h3>Ingresos Totales</h3>
          <div className="value">{formatCurrency(totalIngresos)}</div>
          <small>Valor total en ventas</small>
        </div>
        <div className="stat-card">
          <h3>Promedio por Venta</h3>
          <div className="value">{formatCurrency(promedioVenta)}</div>
          <small>Valor promedio por transacción</small>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <SaleForm 
          onAddSale={handleAddSale}
          onUpdateSale={handleUpdateSale}
          editingSale={editingSale}
          onCancel={handleCancelForm}
        />
      )}

      {/* Tabla */}
      <div className="sales-table-container">
        {loading ? (
          <div className="loading">Cargando ventas...</div>
        ) : sales.length === 0 ? (
          <div className="empty-state">
            <h3>No hay ventas registradas</h3>
            <p>Comienza agregando tu primera venta</p>
          </div>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Cliente</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Vendedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>  
                  <td>
                    <strong>{sale.id}</strong>
                  </td>
                  <td>{formatDate(sale.fecha)}</td>
                  <td>{sale.producto}</td>
                  <td>{sale.cliente}</td>
                  <td>{sale.cantidad}</td>
                  <td>{formatCurrency(sale.precioUnitario)}</td>
                  <td>
                    <strong>{formatCurrency(sale.total)}</strong>
                  </td>
                  <td>{sale.vendedor}</td>
                  <td>
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => handleEditSale(sale)}
                    >
                      Editar
                    </button>
                    <button 
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteSale(sale._id)}  
                    >
                    Eliminar
                    </button>
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

export default Sales;