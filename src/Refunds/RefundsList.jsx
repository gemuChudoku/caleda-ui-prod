import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/apiConfig";
import "./RefundsList.css";

const RefundsList = () => {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentUser] = useState(() => {
    // Obtener usuario actual del localStorage
    try {
      const userData = localStorage.getItem('userData');
      if (userData) return JSON.parse(userData);
      
      const userRole = localStorage.getItem('userRole');
      if (userRole) return { role: userRole };
      
      return null;
    } catch (error) {
      return null;
    }
  });

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'Administrador';

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(API_ENDPOINTS.refunds, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRefunds(data);
      } else {
        console.error('Error fetching refunds:', response.status);
      }
    } catch (error) {
      console.error('Error fetching refunds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRefund = (refund) => {
    console.log('Editar devolución:', refund);
    alert(`Editar devolución #${refund.id}\nEsta funcionalidad se puede implementar después.`);
  };

  const handleDeleteRefund = async (refundId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta devolución?')) {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_ENDPOINTS.deleteRefund(refundId)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
          }
        });

        if (response.ok) {
          await fetchRefunds();
          console.log('✅ Devolución eliminada exitosamente');
        } else {
          console.error('Error deleting refund:', response.status);
        }
      } catch (error) {
        console.error('Error deleting refund:', error);
      }
    }
  };

  const handleUpdateStatus = async (refundId, newStatus) => {
    try {
      const token = localStorage.getItem('jwt');
      const refundToUpdate = refunds.find(r => r.id === refundId);
      
      const response = await fetch(`${API_ENDPOINTS.updateRefund(refundId)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        },
        body: JSON.stringify({
          ...refundToUpdate,
          status: newStatus
        })
      });

      if (response.ok) {
        await fetchRefunds();
        console.log('✅ Estado actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Filtrar devoluciones por estado
  const filteredRefunds = filterStatus === "all" 
    ? refunds 
    : refunds.filter(refund => refund.status === filterStatus);

  // Calcular estadísticas
  const totalRefunds = refunds.length;
  const pendingRefunds = refunds.filter(r => r.status === 'pending').length;
  const approvedRefunds = refunds.filter(r => r.status === 'approved').length;
  const totalAmount = refunds.reduce((sum, refund) => sum + parseFloat(refund.total_amount || 0), 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pendiente' },
      approved: { class: 'status-approved', text: 'Aprobada' },
      rejected: { class: 'status-rejected', text: 'Rechazada' },
      completed: { class: 'status-completed', text: 'Completada' }
    };
    
    const config = statusConfig[status] || { class: 'status-pending', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusActions = (refund) => {
    if (!isAdmin) return null;

    switch(refund.status) {
      case 'pending':
        return (
          <div className="status-actions">
            <button 
              className="btn-status btn-approve"
              onClick={() => handleUpdateStatus(refund.id, 'approved')}
            >
              Aprobar
            </button>
            <button 
              className="btn-status btn-reject"
              onClick={() => handleUpdateStatus(refund.id, 'rejected')}
            >
              Rechazar
            </button>
          </div>
        );
      case 'approved':
        return (
          <div className="status-actions">
            <button 
              className="btn-status btn-complete"
              onClick={() => handleUpdateStatus(refund.id, 'completed')}
            >
              Completar
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="refunds-page">
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
      <div className="refunds-header">
        <div>
          <h1 className="refunds-title">Gestión de Devoluciones</h1>
          <p className="refunds-subtitle">
            Consulta y administra todas las solicitudes de devolución
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/refunds')}
        >
          + Nueva Devolución
        </button>
      </div>

      {/* Estadísticas */}
      <div className="refunds-stats">
        <div className="stat-card">
          <h3>Total Devoluciones</h3>
          <div className="value">{totalRefunds}</div>
          <small>Solicitudes registradas</small>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <div className="value">{pendingRefunds}</div>
          <small>Esperando aprobación</small>
        </div>
        <div className="stat-card">
          <h3>Aprobadas</h3>
          <div className="value">{approvedRefunds}</div>
          <small>Devoluciones autorizadas</small>
        </div>
        <div className="stat-card">
          <h3>Monto Total</h3>
          <div className="value">{formatCurrency(totalAmount)}</div>
          <small>Valor total en devoluciones</small>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filtrar por estado:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
            <option value="completed">Completadas</option>
          </select>
        </div>
        <div className="results-count">
          Mostrando {filteredRefunds.length} de {refunds.length} devoluciones
        </div>
      </div>

      {/* Tabla de Devoluciones */}
      <div className="refunds-table-container">
        {loading ? (
          <div className="loading">Cargando devoluciones...</div>
        ) : filteredRefunds.length === 0 ? (
          <div className="empty-state">
            <h3>No hay devoluciones registradas</h3>
            <p>
              {filterStatus === "all" 
                ? "Comienza registrando tu primera devolución" 
                : `No hay devoluciones con estado "${filterStatus}"`
              }
            </p>
            {filterStatus !== "all" && (
              <button 
                className="btn-primary"
                onClick={() => setFilterStatus("all")}
              >
                Ver todas las devoluciones
              </button>
            )}
          </div>
        ) : (
          <table className="refunds-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Venta</th>
                <th>Producto</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Motivo</th>
                <th>Estado</th>
                {isAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.map((refund) => (
                <tr key={refund.id} className={`refund-row status-${refund.status}`}>
                  <td>
                    <strong>#{refund.id}</strong>
                  </td>
                  <td>
                    <span className="sale-id">Venta #{refund.sale_id}</span>
                  </td>
                  <td>
                    <strong>{refund.product_name}</strong>
                  </td>
                  <td>{refund.client_name}</td>
                  <td>{refund.seller}</td>
                  <td>{formatDate(refund.refund_date)}</td>
                  <td>{refund.quantity}</td>
                  <td>
                    <strong>{formatCurrency(refund.total_amount)}</strong>
                  </td>
                  <td>
                    <span className="reason-text" title={refund.reason}>
                      {refund.reason.length > 30 
                        ? refund.reason.substring(0, 30) + '...' 
                        : refund.reason
                      }
                    </span>
                  </td>
                  <td>
                    {getStatusBadge(refund.status)}
                    {getStatusActions(refund)}
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-edit"
                          onClick={() => handleEditRefund(refund)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteRefund(refund.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      
    </div>
  );
};

export default RefundsList;