const API_URL = '/api';
const AUTH_URL = '/api/auth';

const getCsrfToken = () => {
  let token = localStorage.getItem('csrfToken');
  if (!token) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrfToken' || name === 'XSRF-TOKEN' || name === 'csrf_token') {
        token = decodeURIComponent(value);
        localStorage.setItem('csrfToken', token);
        break;
      }
    }
  }
  return token;
};

export const refreshCsrfToken = async () => {
  try {
    const res = await fetch(`${AUTH_URL}/session`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.csrfToken) {
      localStorage.setItem('csrfToken', data.csrfToken);
      console.log('CSRF Token refreshed:', data.csrfToken);
      return data.csrfToken;
    }
    if (data.data?.csrfToken) {
      localStorage.setItem('csrfToken', data.data.csrfToken);
      console.log('CSRF Token refreshed from data:', data.data.csrfToken);
      return data.data.csrfToken;
    }
  } catch (error) {
    console.error('Failed to refresh CSRF token:', error);
  }
  return null;
};

const fetchWithAuth = async (url, options = {}) => {
  const csrfToken = getCsrfToken();
  console.log('CSRF Token being sent:', csrfToken);
  const headers = {
    'Content-Type': 'application/json',
    ...(csrfToken && { 'x-csrf-token': csrfToken }),
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
    if (data.message === 'Invalid CSRF token' || data.message?.includes('CSRF')) {
      console.log('CSRF Error - trying to get fresh token...');
      try {
        await fetchWithAuth(`${AUTH_URL}/session`, { method: 'GET' });
      } catch (e) {
        console.error('Failed to refresh session:', e);
      }
      const newToken = getCsrfToken();
      if (newToken) {
        headers['x-csrf-token'] = newToken;
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
    throw new Error(data.message || 'Request failed');
  }

  if (data.csrfToken) {
    localStorage.setItem('csrfToken', data.csrfToken);
    console.log('CSRF Token stored:', data.csrfToken);
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
  let csrfToken = getCsrfToken();
  if (!csrfToken) {
    await refreshCsrfToken();
    csrfToken = getCsrfToken();
  }
  
  const data = await fetchWithAuth(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });

  if (data.success && data.data) {
    return data.data;
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
  const data = await fetchWithAuth(`${API_URL}/users`, {
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
