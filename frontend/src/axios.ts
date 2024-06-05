import axios from 'axios';
import { store } from './services/redux/store';

const API = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'content-type': 'Application/json',
  },
});

API.interceptors.request.use(
  async (config) => {
    const accessToken=store.getState().user.accessToken;
    console.log("accessToken", accessToken)
    if (accessToken && config.headers) {
      config.headers.Authorization= `Bearer ${accessToken}`
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
