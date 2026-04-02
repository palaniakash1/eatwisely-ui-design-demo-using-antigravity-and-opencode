const API_URL = '/api';
const AUTH_URL = '/api/auth';

const getAuthToken = () => localStorage.getItem('token');

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const refreshAuthToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh(() => resolve());
    });
  }

  isRefreshing = true;
  
  try {
    const res = await fetch(`${AUTH_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (res.ok) {
      isRefreshing = false;
      onTokenRefreshed();
      return true;
    } else {
      isRefreshing = false;
      refreshSubscribers = [];
      return false;
    }
  } catch (error) {
    isRefreshing = false;
    refreshSubscribers = [];
    return false;
  }
};

const redirectToSignIn = () => {
  localStorage.removeItem('csrfToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (window.location.pathname !== '/sign-in') {
    window.location.href = '/sign-in';
  }
};

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

export const refreshCsrfToken = async () => {
  try {
    const res = await fetch(`${AUTH_URL}/session`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.csrfToken) {
      console.log('CSRF Token refreshed from session:', data.csrfToken);
      return data.csrfToken;
    }
    if (data.data?.csrfToken) {
      console.log('CSRF Token refreshed from session data:', data.data.csrfToken);
      return data.data.csrfToken;
    }
  } catch (error) {
    console.error('Failed to refresh CSRF token:', error);
  }
  return null;
};

const fetchWithAuth = async (url, options = {}, retryCount = 0) => {
  const csrfToken = getCsrfToken();
  const authToken = getAuthToken();
  console.log('CSRF Token from cookie:', csrfToken);
  const headers = {
    'Content-Type': 'application/json',
    ...(csrfToken && { 'x-csrf-token': csrfToken }),
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json();

  console.log('Response status:', response.status);
  console.log('Response data:', data);

  if (!response.ok) {
    if (response.status === 401) {
      console.log('Auth token expired - attempting refresh...');
      const refreshed = await refreshAuthToken();
      
      if (refreshed) {
        console.log('Token refreshed successfully, retrying request...');
        const newCsrfToken = getCsrfToken();
        headers['x-csrf-token'] = newCsrfToken;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
        const retryData = await retryResponse.json();
        if (retryResponse.ok) {
          return retryData;
        }
        if (retryResponse.status === 401) {
          console.log('Refresh succeeded but request still failed with 401');
          redirectToSignIn();
          throw new Error('Session expired. Please sign in again.');
        }
      }
      
      console.log('Token refresh failed');
      redirectToSignIn();
      throw new Error(data.message || 'Session expired. Please sign in again.');
    }

    if (data.message === 'Invalid CSRF token' || data.message === 'Invalid or missing CSRF token' || data.message?.includes('CSRF')) {
      console.log('CSRF Error - trying to get fresh token...');
      const refreshed = await refreshAuthToken();
      
      if (refreshed) {
        const newCsrfToken = getCsrfToken();
        if (newCsrfToken) {
          console.log('Retrying with new CSRF token:', newCsrfToken);
          headers['x-csrf-token'] = newCsrfToken;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
          });
          const retryData = await retryResponse.json();
          if (retryResponse.ok) {
            return retryData;
          }
        }
      }
    }
    throw new Error(data.message || 'Request failed');
  }

  if (data.csrfToken) {
    console.log('CSRF Token from response:', data.csrfToken);
  }

  return data;
};

export const validateUserCredentials = async (email, password) => {
  const data = await fetchWithAuth(`${AUTH_URL}/signin`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  await refreshCsrfToken();

  const { password: _, ...userWithoutPassword } = data;
  return { user: userWithoutPassword };
};

export const createUserInJson = async (userData) => {
  const data = await fetchWithAuth(`${AUTH_URL}/signup`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  await refreshCsrfToken();

  const { password: _, ...userWithoutPassword } = data;
  return { user: userWithoutPassword };
};

export const logoutUser = async () => {
  sessionStorage.setItem('isLoggingOut', 'true');
  try {
    await fetchWithAuth(`${AUTH_URL}/signout`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
  localStorage.removeItem('csrfToken');
  return { message: 'Logged out successfully' };
};

export const updateUserInJson = async (userId, updates) => {
  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    console.log('No CSRF token found, refreshing...');
    await refreshCsrfToken();
  }
  
  const data = await fetchWithAuth(`${API_URL}/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  if (data.success && data.user) {
    return data.user;
  }

  return data;
};

export const deleteUserFromJson = async (userId) => {
  const data = await fetchWithAuth(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
  });

  return data;
};

export const getAllUsers = async (query = {}) => {
  const params = new URLSearchParams(query);
  const data = await fetchWithAuth(`${API_URL}/users?${params}`);
  return data;
};

export const getUserById = async (userId) => {
  const data = await fetchWithAuth(`${API_URL}/users/${userId}`);
  return data;
};

export const createUser = async (userData) => {
  const data = await fetchWithAuth(`${API_URL}/admin/users`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return data;
};

export const deactivateUser = async (userId) => {
  const data = await fetchWithAuth(`${API_URL}/users/${userId}/deactivate`, {
    method: 'PATCH',
  });
  return data;
};

export const restoreUser = async (userId) => {
  const data = await fetchWithAuth(`${API_URL}/users/${userId}/restore`, {
    method: 'PATCH',
  });
  return data;
};

export default {
  validateUserCredentials,
  createUserInJson,
  logoutUser,
  updateUserInJson,
  deleteUserFromJson,
  getAllUsers,
  getUserById,
  createUser,
  deactivateUser,
  restoreUser,
};
