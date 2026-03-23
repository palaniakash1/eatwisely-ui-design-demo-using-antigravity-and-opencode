import axios from './axios.js';

const API_URL = '/fsa';

export const searchFSA = async (name, postcode = null) => {
  const params = new URLSearchParams();
  params.append('name', name);
  if (postcode) {
    params.append('postcode', postcode);
  }

  const res = await axios.get(`${API_URL}/search?${params.toString()}`);
  return res.data;
};

export const getFsaRating = async (fhrsId) => {
  const res = await axios.get(`${API_URL}/rating/${fhrsId}`);
  return res.data;
};

export const getRestaurantRating = async (restaurantId) => {
  const res = await axios.get(`${API_URL}/restaurant/${restaurantId}`);
  return res.data;
};

export const linkRestaurant = async (restaurantId, fhrsId) => {
  const res = await axios.post(`${API_URL}/restaurant/${restaurantId}/link`, { fhrsId });
  return res.data;
};

export const autoLinkRestaurant = async (restaurantId) => {
  const res = await axios.post(`${API_URL}/restaurant/${restaurantId}/auto-link`);
  return res.data;
};

export const unlinkRestaurant = async (restaurantId) => {
  const res = await axios.delete(`${API_URL}/restaurant/${restaurantId}/link`);
  return res.data;
};

export const refreshRestaurantRating = async (restaurantId) => {
  const res = await axios.post(`${API_URL}/restaurant/${restaurantId}/refresh`);
  return res.data;
};

export default {
  searchFSA,
  getFsaRating,
  getRestaurantRating,
  linkRestaurant,
  autoLinkRestaurant,
  unlinkRestaurant,
  refreshRestaurantRating
};
