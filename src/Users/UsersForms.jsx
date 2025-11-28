import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/apiConfig";
import "./Users.css";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(API_ENDPOINTS.users, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Error fetching users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

 


  // Calcular estadísticas basadas en tu schema
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const adminUsers = users.filter(user => user.role === 'admin').length;

  const getStatusBadge = (user) => {
    const status = user.status || 'active';
    const statusClass = status === 'active' ? 'status-active' : 'status-inactive';
    const statusText = status === 'active' ? 'Activo' : 'Inactivo';
    
    return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
  };

  const getRoleBadge = (user) => {
    const role = user.role || 'user';
    let roleClass = 'role-user';
    let roleText = 'Usuario';
    
    switch(role) {
      case 'admin':
        roleClass = 'role-admin';
        roleText = 'Administrador';
        break;
      case 'manager':
        roleClass = 'role-manager';
        roleText = 'Manager';
        break;
      default:
        roleClass = 'role-user';
        roleText = 'Usuario';
    }
    
    return <span className={`role-badge ${roleClass}`}>{roleText}</span>;
  };

  return (
    <div className="users-page">
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
      <div className="users-header">
        <div>
          <h1 className="users-title">Gestión de Usuarios</h1>
          <p className="users-subtitle">
            Administra y visualiza todos los usuarios del sistema
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="users-stats">
        <div className="stat-card">
          <h3>Total Usuarios</h3>
          <div className="value">{totalUsers}</div>
          <small>Usuarios registrados</small>
        </div>
        <div className="stat-card">
          <h3>Usuarios Activos</h3>
          <div className="value">{activeUsers}</div>
          <small>Usuarios activos en el sistema</small>
        </div>
        <div className="stat-card">
          <h3>Administradores</h3>
          <div className="value">{adminUsers}</div>
          <small>Usuarios con rol administrador</small>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <h3>No hay usuarios registrados</h3>
            <p>Los usuarios aparecerán aquí una vez se registren en el sistema</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Empresa</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>#{user.id}</strong>
                  </td>
                  <td>
                    <strong>{user.full_name || 'N/A'}</strong>
                  </td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.phone_number || 'N/A'}</td>
                  <td>{getRoleBadge(user)}</td>
                  <td>{user.company || 'N/A'}</td>
                  <td>{getStatusBadge(user)}</td>
                  <td>
                    
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

export default Users;