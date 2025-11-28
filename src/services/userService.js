import { API_ENDPOINTS } from "../config/apiConfig";
import { getToken } from "./authservice";

export async function fetchUsers() {
  const token = getToken();

  const response = await fetch(API_ENDPOINTS.users, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("No autorizado");

  return response.json();
}
