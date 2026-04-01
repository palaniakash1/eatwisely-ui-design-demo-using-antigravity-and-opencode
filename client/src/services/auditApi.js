const API_URL = '/api';

const getAuthToken = () => localStorage.getItem('token');

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

const fetchWithAuth = async (url, options = {}) => {
  const csrfToken = getCsrfToken();
  const authToken = getAuthToken();
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

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch audit logs');
  }

  if (data.csrfToken) {
    localStorage.setItem('csrfToken', data.csrfToken);
  }

  return data;
};

export const fetchAuditLogs = async (query = {}) => {
  const params = new URLSearchParams();
  
  if (query.entityType) params.append('entityType', query.entityType);
  if (query.action) params.append('action', query.action);
  if (query.actorId) params.append('actorId', query.actorId);
  if (query.page) params.append('page', query.page);
  if (query.limit) params.append('limit', query.limit);

  const data = await fetchWithAuth(`${API_URL}/auditlogs?${params}`);
  return data;
};

export const mapAuditLogToDisplay = (log) => {
  const actorName = log.actorId?.userName || log.actorRole || 'System';
  let details = '';
  
  if (log.action === 'CREATE') {
    details = log.after ? `Created ${log.entityType}: ${JSON.stringify(log.after).slice(0, 50)}...` : '';
  } else if (log.action === 'UPDATE') {
    details = log.after ? `Updated ${log.entityType}` : '';
  } else if (log.action === 'DELETE') {
    details = log.before ? `Deleted ${log.entityType}: ${JSON.stringify(log.before).slice(0, 50)}...` : '';
  } else if (log.action === 'LOGIN') {
    details = 'User logged in successfully';
  } else if (log.action === 'LOGOUT') {
    details = 'User logged out';
  } else if (log.action === 'LOGIN_FAILED') {
    details = 'Login attempt failed';
  } else if (log.action === 'STATUS_CHANGE') {
    details = log.after ? `Changed status to ${JSON.stringify(log.after.status || log.after)}` : '';
  } else {
    details = log.after ? JSON.stringify(log.after).slice(0, 100) : '';
  }

  return {
    _id: log._id,
    action: log.action,
    user: actorName,
    details: details,
    ipAddress: log.ipAddress || 'N/A',
    timestamp: log.createdAt,
    entityType: log.entityType,
    entityId: log.entityId,
  };
};

export default {
  fetchAuditLogs,
  mapAuditLogToDisplay,
};
