import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getAccessToken, clearAll } from '../services/storage';
import authService from '../services/authService';

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
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CHECK_AUTH_SUCCESS: 'CHECK_AUTH_SUCCESS',
  CHECK_AUTH_FAILURE: 'CHECK_AUTH_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
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

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const token = await getAccessToken();
      
      if (token) {
        console.log('Token found in storage, user is authenticated');
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_SUCCESS,
          payload: { token }
        });
      } else {
        console.log('No token found, user is not authenticated');
        dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.login(email, password);
      
      if (response.success) {
        console.log('Login successful:', response.data);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.data.user,
            token: response.data.accessToken
          }
        });
        return { success: true, data: response.data };
      } else {
        console.log('Login failed:', response.message);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Có lỗi xảy ra khi đăng nhập';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Call logout API
      await authService.logout();
      
      // Clear local storage
      await clearAll();
      
      // Update state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      console.log('Logout successful');
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, clear local data
      await clearAll();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      return { success: true, message: 'Đăng xuất thành công' };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
