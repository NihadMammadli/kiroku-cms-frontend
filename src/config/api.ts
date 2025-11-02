import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 1000000,
  withCredentials: true,
});

// Store CSRF token in memory
let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

// Helper function to get CSRF token from cookie
const getCSRFTokenFromCookie = (): string | null => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

// Helper function to fetch CSRF token from API
const fetchCSRFToken = async (): Promise<string> => {
  // If already fetching, return the existing promise
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  // Create new fetch promise
  csrfTokenPromise = (async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || '/api'}/auth/csrf/`,
        {
        withCredentials: true,
        }
      );
      const token = response.data.csrf_token;
      csrfToken = token;
      return token;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      throw error;
    } finally {
      csrfTokenPromise = null;
    }
  })();

  return csrfTokenPromise;
};

// Helper function to get CSRF token (from cookie, memory, or fetch)
const getCSRFToken = async (): Promise<string | null> => {
  // Check cookie first
  const cookieToken = getCSRFTokenFromCookie();
  if (cookieToken) {
    csrfToken = cookieToken;
    return cookieToken;
  }

  // Check memory
  if (csrfToken) {
    return csrfToken;
  }

  // Fetch from API
  try {
    return await fetchCSRFToken();
  } catch (error) {
    console.error('Could not obtain CSRF token:', error);
    return null;
  }
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  async (config) => {
    // Get CSRF token
    const token = await getCSRFToken();

    // Add CSRF token header if token exists
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
