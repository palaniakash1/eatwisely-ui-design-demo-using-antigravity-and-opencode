/**
 * =============================================================================
 * AXIOS INSTANCE - HTTP Client with Auth Interceptors
 * =============================================================================
 * 
 * This module provides a pre-configured Axios instance with:
 * - Automatic CSRF token injection
 * - Token refresh on 401 responses
 * - Session validation on startup
 * 
 * IMPORTANT: This uses HTTP-only cookies for authentication.
 * Tokens are NOT stored in localStorage - they're handled by the server
 * via cookies set with the HttpOnly flag.
 * 
 * Security Benefits of HTTP-only Cookies:
 * 1. Cannot be accessed by JavaScript (prevents XSS attacks)
 * 2. Automatically sent with every request
 * 3. Can have SameSite restrictions to prevent CSRF
 */

import axios from 'axios';
import { store } from '../redux/store';
import { signOut } from '../redux/user/userSlice';

/**
 * Get CSRF token from cookies
 * We read from document.cookie, NOT localStorage
 */
const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf_token' || name === 'XSRF-TOKEN' || name === 'csrfToken') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // IMPORTANT: Send cookies with requests
});

// Request interceptor - Add CSRF token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token refresh management (singleton pattern)
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach(cb => cb());
  refreshSubscribers = [];
};

// Response interceptor - Handle 401 and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Call refresh endpoint - server will set new cookies
          const res = await axiosInstance.post('/auth/refresh', {}, { 
            withCredentials: true 
          });

          isRefreshing = false;
          onTokenRefreshed();
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];

          // Refresh failed - user needs to re-login
          store.dispatch(signOut());
          
          const currentPath = window.location.pathname;
          const isAuthPage = currentPath.includes('/signin') || currentPath.includes('/signup');
          
          if (!isAuthPage) {
            window.location.href = '/sign-in?expired=true';
          }
          
          return Promise.reject(refreshError);
        }
      }

      // Wait for refresh to complete, then retry
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
