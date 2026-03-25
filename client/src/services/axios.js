import axios from 'axios';
import { store } from '../redux/store';
import { signOut } from '../redux/user/userSlice';

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

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const handleSignOut = () => {
  store.dispatch(signOut());
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axiosInstance.post('/auth/refresh', {}, { 
            withCredentials: true 
          });

          const newToken = res.data?.token;
          if (newToken) {
            localStorage.setItem('token', newToken);
          }

          isRefreshing = false;
          onTokenRefreshed(newToken);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];

          const currentPath = window.location.pathname;
          const isAuthPage = currentPath === '/signin' || currentPath === '/signup' || currentPath === '/sign-in' || currentPath === '/sign-up';

          if (!isAuthPage) {
            handleSignOut();
            window.location.href = '/signin?expired=true';
          }
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
