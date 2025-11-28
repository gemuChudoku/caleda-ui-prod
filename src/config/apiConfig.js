const API_BASE_URL = "https://caleda-apim.azure-api.net";

export const API_ENDPOINTS = {
  // Users endpoints
  login: `${API_BASE_URL}/users/login`,
  users: `${API_BASE_URL}/users/users`,
  enter: `${API_BASE_URL}/users/users/login`,
  register: `${API_BASE_URL}/users/register`,
  
  // Products endpoints (NUEVOS)
  products: `${API_BASE_URL}/products/products`,
  createProduct: `${API_BASE_URL}/products/products`,
  getProducts: `${API_BASE_URL}/products/products`,
  getProduct: (id) => `${API_BASE_URL}/products/products`,
  updateProduct: `${API_BASE_URL}/products/products`,
  deleteProduct: (id) => `${API_BASE_URL}/products/products}`,

 // Sales endpoints
  sales: `${API_BASE_URL}/sales/sales`,
  createSale: `${API_BASE_URL}/sales/sales`,
  updateSale: (id) => `${API_BASE_URL}/sales/sales/${id}`,  // ← DEBE SER FUNCIÓN
  deleteSale: (id) => `${API_BASE_URL}/sales/sales/${id}`,

  // Sales endpoints
  refunds: `${API_BASE_URL}/refunds/refunds`,
  createRefunds: `${API_BASE_URL}/refunds/refunds`,
  updateRefunds: (id) => `${API_BASE_URL}/refunds/refunds/${id}`,  // ← DEBE SER FUNCIÓN
  deleteRefunds: (id) => `${API_BASE_URL}/refunds/refunds/${id}`
};

export default API_BASE_URL;
