import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import { API_ENDPOINTS } from "../config/apiConfig";
import { useNavigate } from "react-router-dom";
import "./Products.css";



const Products = () => {
  const navigate = useNavigate(); // ⬅️ AÑADE ESTE HOOK
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(API_ENDPOINTS.products, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(API_ENDPOINTS.createProduct, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        await fetchProducts(); // Recargar lista
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_ENDPOINTS.updateProduct}/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"

        },
        body: JSON.stringify(updatedProduct)
      });

      if (response.ok) {
        await fetchProducts(); // Recargar lista
        setEditingProduct(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_ENDPOINTS.deleteProduct}/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
          }
        });

        if (response.ok) {
          await fetchProducts(); // Recargar lista
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleAdjustQuantity = async (productId, adjustment) => {
    try {
      const product = products.find(p => p.id === productId);
      const newQuantity = Math.max(0, product.quantity + adjustment);
      
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_ENDPOINTS.updateProduct}/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Ocp-Apim-Subscription-Key": "57e74324f6c74151961dfa3a7d937461"
        },
        body: JSON.stringify({ 
          ...product, 
          quantity: newQuantity 
        })
      });

      if (response.ok) {
        await fetchProducts(); // Recargar lista
      }
    } catch (error) {
      console.error('Error adjusting quantity:', error);
    }
  };

  const handleCancelForm = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  return (


    
    <div className="products-page">

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


      <div className="products-header">
        <div>
          <h1 className="products-title">Gestión de Productos</h1>
          <p className="products-subtitle">
            Registra y administra los productos del inventario.
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Agregar Producto
        </button>
      </div>

      {showForm && (
        <ProductForm 
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          editingProduct={editingProduct}
          onCancel={handleCancelForm}
        />
      )}

      <ProductTable 
        products={products}
        loading={loading}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onAdjustQuantity={handleAdjustQuantity}
      />
    </div>
  );
};

export default Products;