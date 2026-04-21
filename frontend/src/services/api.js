import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ensure backend matches this
});

export const getCompanyInfo = async (symbol) => {
  const response = await api.get(`/company/${symbol}`);
  return response.data;
};

export const getPredictions = async (symbol) => {
  const response = await api.get(`/predict/${symbol}`);
  return response.data;
};

export default api;
