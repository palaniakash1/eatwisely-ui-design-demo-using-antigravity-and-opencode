import axios from 'axios';

export const dashboardApi = {
  getOverview: async () => {
    const res = await axios.get('/dashboard/overview');
    return res.data;
  },

  getStats: async (days = 30) => {
    const res = await axios.get(`/dashboard/stats?days=${days}`);
    return res.data;
  },

  getAnalytics: async (type, days = 30) => {
    const res = await axios.get(`/dashboard/analytics?type=${type}&days=${days}`);
    return res.data;
  },

  getRealtime: async () => {
    const res = await axios.get('/dashboard/realtime');
    return res.data;
  }
};

export default dashboardApi;
