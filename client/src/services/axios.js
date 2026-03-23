import axios from 'axios';

const getAuthToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
