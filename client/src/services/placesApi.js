import axios from 'axios';

const API_URL = '/api/v1/places';

const placesApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

placesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const autocompleteAddress = async (input, language = 'en') => {
  const response = await placesApi.get('/autocomplete', {
    params: { input, language },
  });
  return response.data;
};

export const getPlaceDetails = async (placeId) => {
  const response = await placesApi.get(`/details/${placeId}`);
  return response.data;
};

export const searchPlaces = async (query, location = null, radius = 5000) => {
  const params = { q: query };
  if (location) {
    params.lat = location.lat;
    params.lng = location.lng;
    params.radius = radius;
  }
  const response = await placesApi.get('/search', { params });
  return response.data;
};

export default {
  autocompleteAddress,
  getPlaceDetails,
  searchPlaces,
};