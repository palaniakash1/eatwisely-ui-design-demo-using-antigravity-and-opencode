/**
 * =============================================================================
 * AUTHENTICATION SERVICE - Complete Guide
 * =============================================================================
 * 
 * This is the SINGLE SOURCE OF TRUTH for authentication API calls.
 * 
 * KEY CONCEPTS:
 * 
 * 1. HTTP-ONLY COOKIES (Security Best Practice)
 *    - Tokens are stored in HTTP-only cookies (set by backend)
 *    - JavaScript CANNOT access these cookies (prevents XSS attacks)
 *    - Cookies are automatically sent with every request (withCredentials: true)
 *    - We DON'T store tokens in localStorage anymore
 * 
 * 2. CSRF PROTECTION (Double-Submit Cookie Pattern)
 *    - Backend sends CSRF token in a cookie AND expects it in headers
 *    - We READ the CSRF token from cookies and send it in x-csrf-token header
 *    - This prevents Cross-Site Request Forgery attacks
 *    - CSRF token is read from document.cookie, NOT localStorage
 * 
 * 3. TOKEN REFRESH (Centralized Manager)
 *    - When API returns 401, we refresh the session
 *    - Only ONE refresh request runs at a time (prevents race conditions)
 *    - Other requests wait for the refresh to complete
 * 
 * 4. SESSION MANAGEMENT
 *    - Session is validated on app load
 *    - Private routes validate session before rendering
 *    - Logout clears server-side session and client-side state
 * =============================================================================
 */

const API_URL = '/api';
const AUTH_URL = '/api/auth';

/**
 * =============================================================================
 * TOKEN REFRESH MANAGER (Singleton Pattern)
 * =============================================================================
 * 
 * Problem: Multiple requests might trigger token refresh simultaneously
 * Solution: Only ONE refresh request runs; others wait for it
 * 
 * How it works:
 * 1. First 401 triggers refresh, sets isRefreshing = true
 * 2. Subsequent 401s add their callbacks to refreshSubscribers
 * 3. When refresh completes, all waiting requests are retried
 * 4. If refresh fails, all waiting requests get an error
 */
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach(cb => cb());
  refreshSubscribers = [];
};

const refreshSession = async () => {
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

/**
 * =============================================================================
 * CSRF TOKEN HANDLER
 * =============================================================================
 * 
 * CSRF Protection prevents malicious websites from making requests on behalf of users.
 * 
 * How it works:
 * 1. Server sends CSRF token in a cookie (HTTP-only or readable)
 * 2. Client reads token from cookies and includes in request headers
 * 3. Server validates token matches the cookie
 * 
 * IMPORTANT: We read from document.cookie, NOT localStorage!
 * This prevents XSS from stealing the CSRF token.
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

/**
 * =============================================================================
 * SESSION VALIDATOR
 * =============================================================================
 * 
 * Validates the current session by hitting the /session endpoint.
 * Returns user data if session is valid, null otherwise.
 */
export const validateSession = async () => {
  try {
    const res = await fetch(`${AUTH_URL}/session`, {
      method: 'GET',
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
    return null;
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
};

/**
 * =============================================================================
 * AUTHENTICATED FETCH WRAPPER
 * =============================================================================
 * 
 * This is the core function that handles ALL authenticated API requests.
 * 
 * Features:
 * 1. Automatically adds CSRF token to requests
 * 2. Handles 401 responses by refreshing session
 * 3. Retries the original request after refresh
 * 4. Properly handles logout on refresh failure
 */
const authenticatedFetch = async (url, options = {}) => {
  const csrfToken = getCsrfToken();
  
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

  if (response.status === 401) {
    const refreshed = await refreshSession();
    
    if (refreshed) {
      const newCsrfToken = getCsrfToken();
      headers['x-csrf-token'] = newCsrfToken;
      
      const retryResponse = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (retryResponse.ok) {
        return retryResponse;
      }
      
      if (retryResponse.status === 401) {
        window.location.href = '/sign-in?expired=true';
        throw new Error('Session expired. Please sign in again.');
      }
    }
    
    window.location.href = '/sign-in?expired=true';
    throw new Error('Session expired. Please sign in again.');
  }

  return response;
};

/**
 * =============================================================================
 * AUTH API FUNCTIONS
 * =============================================================================
 * 
 * These are the public functions for authentication operations.
 */

/**
 * SIGNUP - Create a new user account
 * 
 * Flow:
 * 1. Send user data to server
 * 2. Server validates input
 * 3. Server creates user and returns success
 * 4. Redirect to sign-in page
 */
export const signup = async (userData) => {
  const response = await authenticatedFetch(`${AUTH_URL}/signup`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return data;
};

/**
 * SIGNIN - Authenticate user
 * 
 * Flow:
 * 1. Send credentials to server
 * 2. Server validates and creates session
 * 3. Server returns user data (without password)
 * 4. Client stores user in Redux/Context
 * 
 * Security Notes:
 * - Password is hashed server-side with bcrypt
 * - Session is stored in HTTP-only cookie
 * - CSRF token is set for protection
 */
export const signin = async (email, password) => {
  const response = await authenticatedFetch(`${AUTH_URL}/signin`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signin failed');
  }

  const { password: _, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

/**
 * GOOGLE OAUTH - Sign in with Google
 * 
 * Flow:
 * 1. User clicks Google sign-in button
 * 2. Firebase opens Google popup
 * 3. After success, send Google token to our server
 * 4. Server creates/updates user and returns session
 */
export const googleSignIn = async (googleData) => {
  const response = await authenticatedFetch(`${AUTH_URL}/google`, {
    method: 'POST',
    body: JSON.stringify(googleData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Google sign-in failed');
  }

  const { password: _, ...userWithoutPassword } = data;
  return userWithoutPassword;
};

/**
 * SIGNOUT - End user session
 * 
 * Flow:
 * 1. Send signout request to server
 * 2. Server invalidates session and clears cookies
 * 3. Client clears local state
 * 4. Redirect to sign-in page
 */
export const signout = async () => {
  try {
    await authenticatedFetch(`${AUTH_URL}/signout`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * =============================================================================
 * DEFAULT EXPORT
 * =============================================================================
 */
export default {
  signup,
  signin,
  googleSignIn,
  signout,
  validateSession,
  getCsrfToken,
};
