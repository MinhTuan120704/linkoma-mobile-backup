import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_DATA_KEY = "userData";

export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

export const setAccessToken = async (token) => {
  try {
    const tokenString =
      typeof token === "string" ? token : JSON.stringify(token);

    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokenString);
  } catch (error) {
    console.error("Error setting access token:", error);
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const setUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error setting user data:", error);
  }
};

export const removeAccessToken = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
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
    console.error("Error clearing storage:", error);
  }
};

// Function to clear all app data (use với caution)
export const clearAllAppData = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All app data cleared successfully");
  } catch (error) {
    console.error("Error clearing all app data:", error);
  }
};

export const isAuthenticated = async () => {
  try {
    const accessToken = await getAccessToken();
    return !!accessToken;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const saveTokens = async (accessToken) => {
  try {
    if (accessToken) {
      await setAccessToken(accessToken);
    }
  } catch (error) {
    console.error("Error saving access token:", error);
  }
};

export const removeAllTokens = async () => {
  try {
    await removeAccessToken();
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// Function to save both token and user data
export const saveAuthData = async (token, userData) => {
  try {
    await Promise.all([setAccessToken(token), setUserData(userData)]);
    return true;
  } catch (error) {
    console.error("Error saving auth data:", error);
    return false;
  }
};
