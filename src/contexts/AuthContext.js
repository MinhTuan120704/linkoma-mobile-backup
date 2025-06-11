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
  }, []);  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      console.log('Checking auth status...');
      const token = await getAccessToken();
      console.log('Token from storage:', token ? 'Token exists' : 'No token found');
      
      if (token) {
        console.log('Token found in storage, getting user info...');
        
        // Get user info with the token
        try {
          const userInfo = await authService.getUserInfo();
          console.log('getUserInfo response:', userInfo);
          if (userInfo.success) {
            console.log('User info retrieved successfully:', userInfo.data);
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: userInfo.data,
                token: token
              }
            });
          } else {
            console.log('Failed to get user info:', userInfo.message);
            // Token might be invalid
            dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
          }
        } catch (userError) {
          console.error('Error getting user info:', userError);
          dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
        }
      } else {
        console.log('No token found, user is not authenticated');
        dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_FAILURE });
    }
  };  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      console.log('Attempting login for:', email);
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      
      if (response.success) {
        console.log('Login successful, user:', response.data.user);
        console.log('Token type:', typeof response.data.accessToken);
        console.log('Token structure:', response.data.accessToken);
        
        const token = response.data.accessToken.token || response.data.accessToken;
        console.log('Processed token:', token);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.data.user,
            token: token
          }
        });
        
        return { 
          success: true, 
          data: response.data,
          message: response.message 
        };
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
      
      // Clear local storage - authService đã gọi clearAll() rồi
      // Không cần gọi lại ở đây
      
      // Update state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      console.log('Logout successful from AuthContext');
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, clear local data
      try {
        await clearAll();
        console.log('Cleared storage from AuthContext as fallback');
      } catch (clearError) {
        console.error('Error clearing storage in AuthContext:', clearError);
      }
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      return { success: true, message: 'Đăng xuất thành công' };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  // Refresh user info after password change
  const refreshUserInfo = async () => {
    try {
      const userInfo = await authService.getUserInfo();
      if (userInfo.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: userInfo.data,
            token: state.token
          }
        });
        return { success: true };
      } else {
        return { success: false, message: userInfo.message };
      }
    } catch (error) {
      console.error('Error refreshing user info:', error);
      return { success: false, message: error.message };
    }
  };// Update user info function
  const updateUserInfo = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Thêm userId vào userData nếu chưa có
      const dataWithUserId = {
        ...userData,
        userId: userData.userId || userData.id || state.user?.userId || state.user?.id
      };
      
      const response = await authService.updateUserInfo(dataWithUserId);
      
      if (response) {
        // Update user data in state
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.data,
            token: state.token
          }
        });
        
        return { success: true, data: response.data };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Update user info error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, message: error.message || 'Có lỗi xảy ra khi cập nhật thông tin' };
    }
  };  // Change password function - supports both regular and first login scenarios
  const changePassword = async (currentPasswordOrUserId, newPassword, isFirstLogin = false) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      let response;
      if (isFirstLogin) {
        // First login: currentPasswordOrUserId is actually userId
        response = await authService.changePassword(currentPasswordOrUserId, newPassword);
      } else {
        // Regular password change: currentPasswordOrUserId is current password
        response = await authService.changePassword(currentPasswordOrUserId, newPassword);
      }
        if (response.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Change password error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, message: error.message || 'Có lỗi xảy ra khi đổi mật khẩu' };
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
    refreshUserInfo,
    checkAuthStatus,
    updateUserInfo,
    changePassword,
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
