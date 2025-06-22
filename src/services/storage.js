import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_DATA_KEY = "userData";

export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.log("Error getting access token:", error);
    return null;
  }
};

export const setAccessToken = async (token) => {
  try {
    const tokenString =
      typeof token === "string" ? token : JSON.stringify(token);

    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokenString);
  } catch (error) {
    console.log("Error setting access token:", error);
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.log("Error getting user data:", error);
    return null;
  }
};

export const setUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.log("Error setting user data:", error);
  }
};

export const removeAccessToken = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.log("Error removing token:", error);
  }
};

export const clearAll = async () => {
  try {
    // Clear specific keys
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);

    // Clear all AsyncStorage cache (optional - uncomment nếu muốn clear toàn bộ)
    // await AsyncStorage.clear();

    console.log("All storage cleared successfully");
  } catch (error) {
    console.log("Error clearing storage:", error);
  }
};

// Function to clear all app data (use với caution)
export const clearAllAppData = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All app data cleared successfully");
  } catch (error) {
    console.log("Error clearing all app data:", error);
  }
};

export const isAuthenticated = async () => {
  try {
    const accessToken = await getAccessToken();
    return !!accessToken;
  } catch (error) {
    console.log("Error checking authentication:", error);
    return false;
  }
};

export const saveTokens = async (accessToken) => {
  try {
    if (accessToken) {
      await setAccessToken(accessToken);
    }
  } catch (error) {
    console.log("Error saving access token:", error);
  }
};

export const removeAllTokens = async () => {
  try {
    await removeAccessToken();
  } catch (error) {
    console.log("Error removing token:", error);
  }
};

// Function to save both token and user data
export const saveAuthData = async (token, userData) => {
  try {
    await Promise.all([setAccessToken(token), setUserData(userData)]);
    return true;
  } catch (error) {
    console.log("Error saving auth data:", error);
    return false;
  }
};

// Cookie helper functions with improved error handling
export const saveCookie = async (name, value, options = {}) => {
  if (!name || !value) {
    console.log("Cookie name and value are required");
    return;
  }

  try {
    const cookieOptions = {
      path: "/",
      secure: true,
      sameSite: "strict",
      ...options,
    };

    const cookieString = `${name}=${value}; ${Object.entries(cookieOptions)
      .map(([key, val]) => `${key}=${val}`)
      .join("; ")}`;

    await AsyncStorage.setItem(`cookie_${name}`, cookieString);
    console.debug(`Cookie ${name} saved successfully`);
  } catch (error) {
    console.log(`Error saving cookie ${name}:`, error);
    throw error; // Propagate error for better error handling
  }
};

export const getCookie = async (name) => {
  if (!name) {
    console.log("Cookie name is required");
    return null;
  }

  try {
    const cookieString = await AsyncStorage.getItem(`cookie_${name}`);
    if (!cookieString) {
      return null;
    }

    const value = cookieString.split(";")[0].split("=")[1];
    return value;
  } catch (error) {
    console.log(`Error getting cookie ${name}:`, error);
    return null;
  }
};

export const removeCookie = async (name) => {
  if (!name) {
    console.log("Cookie name is required");
    return;
  }

  try {
    await AsyncStorage.removeItem(`cookie_${name}`);
    console.debug(`Cookie ${name} removed successfully`);
  } catch (error) {
    console.log(`Error removing cookie ${name}:`, error);
    throw error;
  }
};
