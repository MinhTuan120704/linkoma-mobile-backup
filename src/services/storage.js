import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";

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
    const tokenString = typeof token === 'string' ? token : JSON.stringify(token);
    
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokenString);
  } catch (error) {
    console.error("Error setting access token:", error);
  }
};

export const removeAccessToken = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error removing access token:", error);
  }
};

export const clearAll = async () => {
  try {
    // Clear specific keys
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    
    // Clear all AsyncStorage cache (optional - uncomment nếu muốn clear toàn bộ)
    // await AsyncStorage.clear();
    
    console.log('All storage cleared successfully');
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

// Function to clear all app data (use với caution)
export const clearAllAppData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All app data cleared successfully');
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
