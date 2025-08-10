// Centralized Axios instance with optional base URL from environment
// Set VITE_API_BASE in your client build env (e.g. https://your-backend.example.com)
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE || '';

export const api = axios.create({ baseURL });

export function authApi(token) {
  return axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });
}

export default api;
