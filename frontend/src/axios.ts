import axios from 'axios';

const API = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'content-type': 'Application/json',
  },
});

export default API;
