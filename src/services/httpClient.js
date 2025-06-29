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

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    // Decode JWT token (assuming it's a JWT)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired (with 5 minute buffer)
    return payload.exp && payload.exp < currentTime + 300;
  } catch (error) {
    console.log("Error parsing token:", error);
    return true; // Treat invalid tokens as expired
  }
};

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
      // Check if token is expired before using it
      if (isTokenExpired(token)) {
        console.log("🔑 Token expired, clearing storage...");
        await clearAll();
        await removeCookie("refreshToken");

        // Don't add Authorization header for expired token
        // This will likely result in 401, which will be handled by response interceptor
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
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

    // Handle access token from login response only
    if (
      response.data?.accessToken?.token &&
      response.config.url.endsWith(ENDPOINTS.LOGIN)
    ) {
      await setAccessToken(response.data.accessToken.token);
      console.log("✅ Saved access token from login");
    }

    return response;
  },
  async (error) => {
    // If auth error occurs (token expired), logout user
    if (error.response?.status === 401) {
      console.log("❌ Token expired or unauthorized, logging out...");
      await clearAll();
      await removeCookie("refreshToken");
    }
    return Promise.reject(error);
  }
);

// Export utility functions for external use
export const checkTokenStatus = async () => {
  const token = await getAccessToken();

  if (!token) {
    return { hasToken: false, isExpired: true, expiresIn: 0 };
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = payload.exp ? payload.exp - currentTime : 0;
    const expired = isTokenExpired(token);

    return {
      hasToken: true,
      isExpired: expired,
      expiresIn: expiresIn,
      expiresAt: payload.exp
        ? new Date(payload.exp * 1000).toISOString()
        : null,
    };
  } catch (error) {
    return { hasToken: true, isExpired: true, expiresIn: 0 };
  }
};

export default httpClient;
