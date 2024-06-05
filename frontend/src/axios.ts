import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.BASE_URL,
});

export default API;
