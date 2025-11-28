import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRefunds: 0,
    totalUsers: 0,
    pendingRefunds: 0,
    lowStockProducts: 0
  });
  
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // En un entorno real, estos serían llamadas a tu API
      const mockData = {
        totalProducts: 156,
        totalSales: 892,
        totalRefunds: 23,
        totalUsers: 45,
        pendingRefunds: 5,
        lowStockProducts: 8
      };

      const mockRecentSales = [
        { id: 'VNT001', producto: 'Laptop Dell XPS', cliente: 'Juan Pérez', total: 1500, fecha: '2024-01-15' },
        { id: 'VNT002', producto: 'Mouse Inalámbrico', cliente: 'María García', total: 25, fecha: '2024-01-15' },
        { id: 'VNT003', producto: 'Teclado Mecánico', cliente: 'Carlos López', total: 80, fecha: '2024-01-14' }
      ];

      const mockLowStock = [
        { name: 'Monitor 24"', quantity: 3, minStock: 10 },
        { name: 'SSD 1TB', quantity: 5, minStock: 15 },
        { name: 'RAM 16GB', quantity: 2, minStock: 8 }
      ];

      setStats(mockData);
      setRecentSales(mockRecentSales);
      setLowStockItems(mockLowStock);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div className={`stat-card ${color}`} onClick={onClick}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard - Caleda Smart</h1>
          <div className="user-info">
            <span>Bienvenido, Usuario</span>
            <button className="btn-logout">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        
        {/* Statistics Grid */}
        <section className="stats-grid">
          <StatCard
            title="Total Productos"
            value={stats.totalProducts}
            icon="📦"
            color="blue"
            onClick={() => navigate('/products')}
          />
          <StatCard
            title="Ventas Totales"
            value={stats.totalSales}
            icon="💰"
            color="green"
            onClick={() => navigate('/sales')}
          />
          <StatCard
            title="Devoluciones"
            value={stats.totalRefunds}
            icon="🔄"
            color="orange"
            onClick={() => navigate('/refunds')}
          />
          <StatCard
            title="Usuarios Activos"
            value={stats.totalUsers}
            icon="👥"
            color="purple"
            onClick={() => navigate('/users')}
          />
          <StatCard
            title="Devoluciones Pendientes"
            value={stats.pendingRefunds}
            icon="⏳"
            color="red"
            onClick={() => navigate('/refunds?filter=pending')}
          />
          <StatCard
            title="Productos con Stock Bajo"
            value={stats.lowStockProducts}
            icon="⚠️"
            color="yellow"
            onClick={() => navigate('/products?filter=low-stock')}
          />
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <button className="action-btn primary" onClick={() => navigate('/sales')}>
              <span className="action-icon">➕</span>
              Nueva Venta
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/products')}>
              <span className="action-icon">📦</span>
              Agregar Producto
            </button>
            <button className="action-btn warning" onClick={() => navigate('/refunds')}>
              <span className="action-icon">🔄</span>
              Registrar Devolución
            </button>
            <button className="action-btn info" onClick={() => navigate('/users')}>
              <span className="action-icon">👤</span>
              Ver Usuarios
            </button>
          </div>
        </section>

        {/* Recent Activity & Alerts */}
        <div className="dashboard-sections">
          
          {/* Ventas Recientes */}
          <section className="recent-section">
            <div className="section-header">
              <h2>Ventas Recientes</h2>
              <button className="btn-view-all" onClick={() => navigate('/sales')}>
                Ver Todas →
              </button>
            </div>
            <div className="section-content">
              {recentSales.map(sale => (
                <div key={sale.id} className="recent-item">
                  <div className="item-info">
                    <strong>{sale.producto}</strong>
                    <span>{sale.cliente}</span>
                  </div>
                  <div className="item-meta">
                    <span className="amount">${sale.total}</span>
                    <span className="date">{sale.fecha}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stock Bajo */}
          <section className="alerts-section">
            <div className="section-header">
              <h2>Alertas de Stock</h2>
              <button className="btn-view-all" onClick={() => navigate('/products')}>
                Ver Todos →
              </button>
            </div>
            <div className="section-content">
              {lowStockItems.map((item, index) => (
                <div key={index} className="alert-item">
                  <div className="alert-icon">⚠️</div>
                  <div className="alert-info">
                    <strong>{item.name}</strong>
                    <span>Stock: {item.quantity} (Mínimo: {item.minStock})</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;