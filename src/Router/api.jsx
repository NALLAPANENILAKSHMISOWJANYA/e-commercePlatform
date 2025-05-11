import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommbackend-1-0d3q.onrender.com',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
