import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getAccessToken,
  getUserData,
  saveAuthData,
  clearAll,
  getCookie,
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

  // First effect: Initial load from storage
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [token, userData, refreshToken] = await Promise.all([
          getAccessToken(),
          getUserData(),
          getCookie("refreshToken"),
        ]);

        console.log("Stored user data:", userData);
        console.log("Access token exists:", !!token);
        console.log("Refresh token exists:", !!refreshToken);

        if (token && userData && refreshToken) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: userData,
              token: token,
            },
          });
        } else {
          // If any of the required auth data is missing, clear everything
          await clearAll();
          dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
        dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
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
        await saveAuthData(accessToken.token, user);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: user,
            token: accessToken.token,
          },
        });

        return {
          success: true,
          message: "Login successful",
        };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message,
        });

        return {
          success: false,
          message: response.message,
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";

      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };
  const logout = async (navigation) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      await authService.logout();
      await clearAll(); // Clear all stored data
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      if (navigation && navigation.navigateToLogin) {
        navigation.navigateToLogin();
      }
    }
  };

  // Context value
  const value = {
    // State
    ...state,

    // Actions
    login,
    logout,
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
