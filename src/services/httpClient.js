import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "./apiConfig";
import { getAccessToken, setAccessToken, clearAll } from "./storage";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  async (response) => {
    const authHeader = response.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const newToken = authHeader.replace('Bearer ', '');
      await setAccessToken(newToken);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authHeader = error.response?.headers['authorization'];

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const newToken = authHeader.replace('Bearer ', '');
        await setAccessToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } else {
        await clearAll();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
