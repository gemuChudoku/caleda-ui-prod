import React, { useState } from 'react';
import './RegisterForm.css';

import { useNavigate } from 'react-router-dom'; // 🔥 Importar useNavigate
import { API_ENDPOINTS } from "../config/apiConfig";


const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const navigate = useNavigate(); // 🔥 Hook para navegación
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'user', // Valor por defecto
    company: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(""); // 🔥 Estado para mensaje de éxito

  // Opciones de rol según tu sistema
  const roleOptions = [
    { value: 'user', label: 'Usuario' },
    { value: 'admin', label: 'Administrador' },
    { value: 'manager', label: 'Gestor' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const { full_name, email, phone_number, role, company, password } = formData;

    console.log('📝 Registrando usuario en backend...');

const registerResponse = await fetch(API_ENDPOINTS.register, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461",
    // Si el registro NO requiere JWT, elimina esta línea:
    // 'Authorization': `Bearer ${apimData.token}`
  },
  body: JSON.stringify({
    full_name,
    email,
    phone_number,
    role,
    company,
    password
  })
});

// Manejo de errores del backend
if (!registerResponse.ok) {
  const errorText = await registerResponse.text();
  console.error("❌ Error en registro:", errorText);
  throw new Error('No se pudo registrar el usuario');
}

// Obtener respuesta del backend
const registerData = await registerResponse.json();

console.log("✅ Usuario registrado correctamente:", registerData);

// 🔥 MOSTRAR MENSAJE DE ÉXITO
setSuccess("¡Usuario registrado exitosamente! Redirigiendo al login...");

// 🔥 REDIRIGIR DESPUÉS DE 2 SEGUNDOS
      setTimeout(() => {
        if (onRegister) {
          onRegister(registerData);
        } else {
          navigate('/login'); // 🔥 Redirigir al login

        }
      }, 2000);



  } catch (err) {
    console.error("❌ Error en registro:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="register-container">
      <div className="register-header">
        <h1 className="company-name">Caleda Smart</h1>
        <p className="system-description">Sistema de Gestión de Inventario</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Crear Cuenta</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="full_name" className="form-label">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            className="form-control"
            placeholder="Juan Pérez García"
            value={formData.full_name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo Electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="usuario@empresa.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone_number" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              className="form-control"
              placeholder="+34 123 456 789"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Rol *
            </label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="company" className="form-label">
            Empresa
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="form-control"
            placeholder="Nombre de tu empresa"
            value={formData.company}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña *
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
            disabled={loading}
          />
          <small className="password-hint">
            Mínimo 6 caracteres
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-options">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              className="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="acceptTerms" className="checkbox-label">
              Acepto los <a href="#terms" className="terms-link">términos y condiciones</a>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block register-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>

         <div className="switch-form">
    <p>
      ¿Ya tienes una cuenta?{' '}
      <button 
        type="button" 
        className="switch-link"
        onClick={() => navigate('/login')} // 🔥 Usar navigate
      >
        Iniciar Sesión
      </button>
    </p>
  </div>
      </form>

      <footer className="register-footer">
        <p>&copy; 2025 Caleda Smart. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default RegisterForm;