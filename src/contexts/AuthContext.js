import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getAccessToken,
  getUserData,
  saveAuthData,
  clearAll,
} from "../services/storage";
import authService from "../services/authService";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Action types
export const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  CHECK_AUTH_SUCCESS: "CHECK_AUTH_SUCCESS",
  CHECK_AUTH_FAILURE: "CHECK_AUTH_FAILURE",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.CHECK_AUTH_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // First effect: Initial load from AsyncStorage
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [token, userData] = await Promise.all([
          getAccessToken(),
          getUserData(),
        ]);

        console.log("Stored user data:", userData);
        console.log("Stored token:", token);

        if (token && userData) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: userData,
              token: token,
            },
          });
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
      }
    };

    loadStoredAuth();
  }, []);

  // Second effect: Keep storage in sync with state
  useEffect(() => {
    const syncStorage = async () => {
      try {
        if (state.isAuthenticated && state.user && state.token) {
          await saveAuthData(state.token, state.user);
          console.log("Synced auth data to storage");
        }
      } catch (error) {
        console.error("Error syncing to storage:", error);
      }
    };

    syncStorage();
  }, [state.isAuthenticated, state.user, state.token]);

  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await authService.login(email, password);
      console.log("Login response:", response);

      if (response.success) {
        const { user, accessToken } = response.data;
        console.log("Login user data:", user);

        // Immediately save to storage
        await saveAuthData(accessToken, user);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: user,
            token: accessToken,
          },
        });

        // Verify storage after login
        const storedUser = await getUserData();
        console.log("Stored user after login:", storedUser);

        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      } else {
        console.log("Login failed:", response.message);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message,
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Có lỗi xảy ra khi đăng nhập";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const [token, storedUser] = await Promise.all([
        getAccessToken(),
        getUserData(),
      ]);

      console.log("Checking auth - stored user:", storedUser);
      console.log("Checking auth - stored token:", token);

      if (token) {
        try {
          const userInfo = await authService.getUserInfo();
          if (userInfo.success) {
            // Update storage with latest user info
            await saveAuthData(token, userInfo.data);

            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: userInfo.data,
                token: token,
              },
            });

            return userInfo;
          } else {
            await clearAll();
            dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
          }
        } catch (userError) {
          console.error("Error getting user info:", userError);
          dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
        }
      } else if (storedUser) {
        // If we have user data but no token, use stored data and verify with API
        try {
          const userInfo = await authService.getUserInfo();
          if (userInfo.success) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: userInfo.data,
                token: token,
              },
            });
            return userInfo;
          } else {
            await clearAll();
            dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
          }
        } catch (error) {
          console.error("Error verifying stored user:", error);
          await clearAll();
          dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
        }
      } else {
        console.log("No auth data found");
        dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Call logout API
      await authService.logout();

      // Clear local storage - authService đã gọi clearAll() rồi
      // Không cần gọi lại ở đây

      // Update state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      console.log("Logout successful from AuthContext");
      return { success: true, message: "Đăng xuất thành công" };
    } catch (error) {
      console.error("Logout error:", error);

      // Even if API fails, clear local data
      try {
        await clearAll();
        console.log("Cleared storage from AuthContext as fallback");
      } catch (clearError) {
        console.error("Error clearing storage in AuthContext:", clearError);
      }

      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      return { success: true, message: "Đăng xuất thành công" };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };
  const refreshAuth = async () => {
    await checkAuthStatus();
  };
  // Update user info function
  const updateUserInfo = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await authService.updateUserInfo(userData);

      if (response) {
        // Update user data in state
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.data,
            token: state.token,
          },
        });

        return { success: true, data: response.data };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Update user info error:", error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return {
        success: false,
        message: error.message || "Có lỗi xảy ra khi cập nhật thông tin",
      };
    }
  }; // Change password function - supports both regular and first login scenarios
  const changePassword = async (
    currentPasswordOrUserId,
    newPassword,
    isFirstLogin = false
  ) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      let response;
      if (isFirstLogin) {
        // First login: currentPasswordOrUserId is actually userId
        response = await authService.changePassword(
          currentPasswordOrUserId,
          newPassword
        );
      } else {
        // Regular password change: currentPasswordOrUserId is current password
        response = await authService.changePassword(
          currentPasswordOrUserId,
          newPassword
        );
      }
      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Change password error:", error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return {
        success: false,
        message: error.message || "Có lỗi xảy ra khi đổi mật khẩu",
      };
    }
  };

  // Context value
  const value = {
    // State
    ...state,

    // Actions
    login,
    logout,
    clearError,
    refreshAuth,
    checkAuthStatus,
    updateUserInfo,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
