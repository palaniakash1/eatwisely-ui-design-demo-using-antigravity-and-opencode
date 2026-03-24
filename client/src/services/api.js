const API_URL = '/api/auth';

export const signup = async (userData) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  if (data.csrfToken) {
    localStorage.setItem('csrfToken', data.csrfToken);
  }

  return data;
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.csrfToken) {
    localStorage.setItem('csrfToken', data.csrfToken);
  }

  return data;
};

export const logout = async (token) => {
  const res = await fetch(`${API_URL}/signout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Logout failed');
  }

  localStorage.removeItem('csrfToken');
  return data;
};

export default { signup, login, logout };
