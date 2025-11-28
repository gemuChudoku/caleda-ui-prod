import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom'; // 🔥 Importar useNavigate
import { loginRequest } from '../services/authservice';
import { API_ENDPOINTS } from "../config/apiConfig";

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate(); // 🔥 Hook para navegación
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 Agregamos loading state

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
    setLoading(true); // 🔥 Iniciar loading

    try {
      const { email, password } = formData;

      console.log('🔄 Iniciando proceso de login...');

      // 🔥 PASO 1: Login contra APIM para obtener JWT
      const apimData = await loginRequest(email, password);
      console.log('✅ JWT obtenido de APIM');

      // 🔥 PASO 2: Verificar credenciales REALES en el backend
      console.log('🔄 Verificando credenciales en backend...');
      const backendResponse = await fetch(API_ENDPOINTS.enter, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461",
          // Opcional: enviar el JWT si tu backend lo necesita
          'Authorization': `Bearer ${apimData.token}`
        },
        body: JSON.stringify({ email, password })
      });

      if (!backendResponse.ok) {
        throw new Error('Credenciales incorrectas en el backend');
      }

      const backendData = await backendResponse.json();
      console.log('✅ Credenciales verificadas en backend:', backendData.user);

      // Combinar datos de ambos pasos
      const completeData = {
        token: apimData.token,
        user: backendData.user,
        backendResponse: backendData
      };

      // Guardar token en localStorage
      localStorage.setItem('jwt', apimData.token);
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      console.log('✅ Login COMPLETO - Redirigiendo...');

      // Ejecutar callback de login
      if (onLogin) {
        onLogin(completeData);
      } else {
        // Redirección por defecto si no hay callback
        navigate('/dashboard');
      }

    } catch (err) {
      console.error('❌ Error en login:', err);
      
      // Limpiar token en caso de error
      localStorage.removeItem('jwt');
      
      // Mostrar error específico
      if (err.message.includes('Credenciales incorrectas')) {
        setError("Credenciales incorrectas");
      } else if (err.message.includes('Error en API Management')) {
        setError("Error de conexión con el servidor");
      } else {
        setError("Credenciales incorrectas o error en el servidor");
      }
    } finally {
      setLoading(false); // 🔥 Detener loading
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

        {error && <p className="error-message">{error}</p>}

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
            disabled={loading} // 🔥 Deshabilitar durante loading
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
            disabled={loading} // 🔥 Deshabilitar durante loading
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
              disabled={loading} // 🔥 Deshabilitar durante loading
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              Recordarme
            </label>
          </div>
          
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block login-btn"
          disabled={loading} // 🔥 Deshabilitar durante loading
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Verificando...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>


        {/* 🔥 AGREGAR ESTA SECCIÓN - Botón para ir al registro */}
        <div className="switch-form">
    <p>
      ¿No tienes una cuenta?{' '}
      <button 
        type="button" 
        className="switch-link"
        onClick={() => navigate('/register')} // 🔥 Usar navigate
      >
        Crear Cuenta
      </button>
    </p>
  </div>
      </form>

          

      <footer className="login-footer">
        <p>&copy; 2025 Caleda Smart. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LoginForm;