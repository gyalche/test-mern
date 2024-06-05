import axios from 'axios';

const API = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  baseURL:'http://localhost:8000/api/v1',
  headers: {
    'content-type': 'Application/json'
  }
});

export default API;
