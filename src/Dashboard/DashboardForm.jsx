import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/apiConfig';
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
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
        return;
      }
      
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');
      if (userRole) {
        setCurrentUser({ role: userRole, email: userEmail });
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
      };

      // Hacer todas las llamadas en paralelo
      const [productsRes, salesRes, refundsRes, usersRes] = await Promise.all([
        fetch(API_ENDPOINTS.products, { headers }),
        fetch(API_ENDPOINTS.sales, { headers }),
        fetch(API_ENDPOINTS.refunds, { headers }),
        fetch(API_ENDPOINTS.users, { headers })
      ]);

      // Procesar respuestas
      const products = productsRes.ok ? await productsRes.json() : [];
      const sales = salesRes.ok ? await salesRes.json() : [];
      const refunds = refundsRes.ok ? await refundsRes.json() : [];
      const users = usersRes.ok ? await usersRes.json() : [];

      // Calcular estadísticas
      const lowStockItems = products.filter(product => 
        product.quantity <= (product.minStock || 10)
      );

      const pendingRefunds = refunds.filter(refund => 
        refund.status === 'pending'
      );

      // Obtener ventas recientes (últimas 5)
      const recentSalesData = sales
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);

      // Actualizar estado
      setStats({
        totalProducts: products.length,
        totalSales: sales.length,
        totalRefunds: refunds.length,
        totalUsers: users.length,
        pendingRefunds: pendingRefunds.length,
        lowStockProducts: lowStockItems.length
      });

      setRecentSales(recentSalesData);
      setLowStockItems(lowStockItems.slice(0, 5)); // Solo mostrar 5 items

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div className={`stat-card ${color}`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

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
            <span>
              Bienvenido {currentUser?.full_name || currentUser?.email }
              {currentUser?.role && (
                <span className="user-role"> ({currentUser.role})</span>
              )}
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
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
            onClick={() => navigate('/refunds/List')}
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
            onClick={() => navigate('/refunds/List?filter=pending')}
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
              Gestionar Productos
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
              {recentSales.length > 0 ? (
                recentSales.map(sale => (
                  <div key={sale.id} className="recent-item">
                    <div className="item-info">
                      <strong>{sale.producto}</strong>
                      <span>{sale.cliente}</span>
                    </div>
                    <div className="item-meta">
                      <span className="amount">{formatCurrency(sale.total)}</span>
                      <span className="date">{formatDate(sale.fecha)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-message">
                  No hay ventas recientes
                </div>
              )}
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
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item, index) => (
                  <div key={item.id || index} className="alert-item">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-info">
                      <strong>{item.name}</strong>
                      <span>Stock: {item.quantity} {item.minStock && `(Mínimo: ${item.minStock})`}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-message">
                  ✅ Todo el stock está en niveles óptimos
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Refresh Button */}
        <div className="refresh-section">
          <button 
            className="btn-refresh"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : '🔄 Actualizar Datos'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;