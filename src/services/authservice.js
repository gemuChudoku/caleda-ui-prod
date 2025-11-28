import { API_ENDPOINTS } from "../config/apiConfig";

const APIM_KEY = "57e74324f6c74151961dfa3a7d937461";

export async function loginRequest(email, password) {
  console.log('🔐 Llamando a APIM para JWT...');
  
  const response = await fetch(API_ENDPOINTS.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": APIM_KEY
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    console.error('❌ Error en APIM:', response.status);
    throw new Error("Error en API Management");
  }

  const data = await response.json();
  console.log('✅ JWT recibido de APIM');
  
  // Solo devolvemos el token, la verificación real se hace después
  return data;
}
export const registerRequest = async (userData) => { 
  const response = await fetch(API_ENDPOINTS.register, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Ocp-Apim-Subscription-Key": APIM_KEY
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error en el registro: ${text}`);
  }

  return await response.json();
};
