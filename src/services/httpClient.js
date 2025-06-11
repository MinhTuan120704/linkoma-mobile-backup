import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "./apiConfig";
import {
  getAccessToken,
  setAccessToken,
  clearAll,
  saveCookie,
  getCookie,
  removeCookie,
} from "./storage";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
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

// Response interceptor
httpClient.interceptors.response.use(
  async (response) => {
    // Handle cookies from response (only during login)
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader && response.config.url.endsWith(ENDPOINTS.LOGIN)) {
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      for (const cookieStr of cookies) {
        const [nameValue] = cookieStr.split(";");
        const [name, value] = nameValue.split("=");
        if (name === "refreshToken") {
          await saveCookie(name, value, {
            secure: true,
            sameSite: "strict",
            httpOnly: true,
          });
        }
      }
    }

    // Handle new access token in response
    if (response.data?.accessToken?.token) {
      await setAccessToken(response.data.accessToken.token);
    }

    return response;
  },
  async (error) => {
    // If auth error occurs, logout user
    if (error.response?.status === 401) {
      await clearAll();
      await removeCookie("refreshToken");
    }
    return Promise.reject(error);
  }
);

export default httpClient;
