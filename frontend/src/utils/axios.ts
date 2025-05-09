import axios from 'axios';

// 👇 Create a base Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// 👇 Automatically attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
