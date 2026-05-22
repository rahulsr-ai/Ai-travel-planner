import axios from 'axios';
import type {InternalAxiosRequestConfig} from "axios"


const API = axios.create({ 
  baseURL: import.meta.env.VITE_BASE_URL
});

// Request interceptor to attach token on every request 
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;