import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Ensure backend matches this
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
