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
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
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
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing storage:", error);
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
