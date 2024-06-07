import axios from 'axios';
import { store } from './services/redux/store';
import { newAccessTokenGenerate } from './apis/auth';
import { storeAccessToken } from './services/redux/slices/user.slice';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

const API = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'content-type': 'Application/json',
  },
});

API.interceptors.request.use(
  async (config) => {
    const accessToken = store.getState().user.accessToken;
    console.log('accessToken', accessToken);
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const config = error?.config;
//     console.log("thisismyerror", error)
//     if (error?.response?.data?.message === 'jwt expired') {
//       const refreshToken = store.getState().user.refreshToken;
//       const data={
//         refresh_token:refreshToken,
//       }
//       const result = await newAccessTokenGenerate(data);

//       if (result?.access_token) {
//         config.headers = {
//           ...config.headers,
//           authorization: `Bearer ${result?.access_token}`,
//         };
//       }

//       return axios(config);
//     }
//     return Promise.reject(error);
//   }
// )
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error?.response?.data?.message === 'jwt expired' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = store.getState().user.refreshToken;
      const data = { refresh_token: refreshToken };

      return newAccessTokenGenerate(data)
        .then((result) => {
          if (result?.access_token) {
            store.dispatch(storeAccessToken(result.access_token));
            API.defaults.headers.common['Authorization'] =
              `Bearer ${result.access_token}`;
            originalRequest.headers.Authorization = `Bearer ${result.access_token}`;
            processQueue(null, result.access_token);
            return axios(originalRequest);
          }
        })
        .catch((err) => {
          processQueue(err, null);
          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(error);
  },
);

export default API;
