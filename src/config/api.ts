import axios from 'axios';

/**
 * CONFIGURAÇÃO DA URL BASE DA API
 *
 * Em desenvolvimento web local / AI Studio, o fallback é '' ou '/api', permitindo chamadas relativas.
 * Para o APK Android (Capacitor), VITE_API_BASE_URL deve ser definida no .env.production ou nas
 * variáveis de build com a URL pública onde o backend (server.ts) está hospedado
 * (ex: https://cota-backend.onrender.com/api).
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

// Configura a URL base padrão no Axios globalmente
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
} else {
  // Fallback padrão para web/dev proxy
  axios.defaults.baseURL = '/api';
}

/**
 * Função utilitária para formatar endpoints com a API_BASE_URL
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return `/api${cleanEndpoint}`;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export default axios;
