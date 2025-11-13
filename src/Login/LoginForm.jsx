import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulamos el login por ahora
    if (onLogin) {
      onLogin(formData);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="company-name">Caleda Smart</h1>
        <p className="system-description">Sistema de Gestión de Inventario</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Iniciar Sesión</h2>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-options">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              className="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              Recordarme
            </label>
          </div>
          
          <a href="#forgot-password" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button type="submit" className="btn btn-primary btn-block login-btn">
          Iniciar Sesión
        </button>
      </form>

      <footer className="login-footer">
        <p>&copy; 2025 Caleda Smart. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LoginForm;