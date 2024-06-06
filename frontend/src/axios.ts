import axios from 'axios';
import { store } from './services/redux/store';
import { newAccessTokenGenerate } from './apis/auth';

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
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    console.log("error", error?.response)
    if (error?.response?.data?.message === 'jwt expired') {
      const refreshToken = store.getState().user.refreshToken;
      const data={
        refresh_token:refreshToken,
      }
      const result = await newAccessTokenGenerate(data);
      
      if (result?.access_token) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${result?.access_token}`,
        };
      }

      return axios(config);
    }
    return Promise.reject(error);
  }
)

export default API;
