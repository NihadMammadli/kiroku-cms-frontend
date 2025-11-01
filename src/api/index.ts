import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 1000000,
});

// Store auth context logout function to use in interceptor
let logoutCallback: (() => void) | null = null;

export const setAuthLogoutCallback = (logout: () => void) => {
  logoutCallback = logout;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if it's a network error or server error that should trigger logout
    const shouldLogout =
      // 401 Unauthorized
      error.response?.status === 401 ||
      // Network errors (no response from server)
      !error.response ||
      // Server errors (5xx)
      (error.response?.status >= 500 && error.response?.status < 600) ||
      // Connection timeout
      error.code === 'ECONNABORTED' ||
      // Network error
      error.code === 'ERR_NETWORK' ||
      // Connection refused
      error.code === 'ECONNREFUSED';

    if (shouldLogout) {
      // Clear token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.clear();

      // Use AuthContext logout if available, otherwise fallback to window.location
      if (logoutCallback) {
        logoutCallback();
      } else {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export * from './auth';
export * from './products';
export * from './logs';
