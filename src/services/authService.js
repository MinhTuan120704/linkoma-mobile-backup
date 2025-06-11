import httpClient from './httpClient';
import { ENDPOINTS } from './apiConfig';
import { setAccessToken, setRefreshToken, clearAll, saveTokens, getAccessToken } from './storage';

export const login = async (email, password) => {
  try {
    const credentials = { email, password };
    
    const response = await httpClient.post(ENDPOINTS.LOGIN, credentials, {
      withCredentials: true,
    });

    if (response.data && response.status === 200) {
      const { accessToken, user } = response.data;
        
      if (accessToken) {
        await saveTokens(accessToken.token);
        
      }

      return {
        success: true,
        data: { user, accessToken },
        message: "Đăng nhập thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Đăng nhập thất bại",
    };
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Có lỗi xảy ra khi đăng nhập",
    };
  }
};


// Đăng xuất
export const logout = async () => {
  try {
    // Call logout API first
    await httpClient.post(ENDPOINTS.LOGOUT);
    
    // Clear all local storage and cache
    await clearAll();
    
    console.log('Logout successful - all data cleared');
    
    return {
      success: true,
      data: null,
      message: 'Đăng xuất thành công'
    };
  } catch (error) {
    console.error('Logout API error:', error);
    
    // Vẫn clear local data dù API lỗi để đảm bảo security
    try {
      await clearAll();
      console.log('Local data cleared despite API error');
    } catch (clearError) {
      console.error('Error clearing local data:', clearError);
    }
    
    return {
      success: true,
      data: null,
      message: 'Đăng xuất thành công'
    };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await httpClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Email reset mật khẩu đã được gửi'
      };
    }
    
    return {
      success: false,
      data: null,
      message: response.data?.message || 'Gửi email thất bại'
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi email'
    };
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await httpClient.post(ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
      confirmPassword
    });
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Đặt lại mật khẩu thành công'
      };
    }
    
    return {
      success: false,
      data: null,
      message: response.data?.message || 'Đặt lại mật khẩu thất bại'
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu'
    };
  }
};

// Lấy thông tin user hiện tại
export const getUserInfo = async () => {
  try {
    const response = await httpClient.get(ENDPOINTS.USER_INFO);
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin user thành công'
      };
    }
    
    return {
      success: false,
      data: null,
      message: response.data?.message || 'Lấy thông tin user thất bại'
    };
  } catch (error) {
    console.error('Get user info error:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin user'
    };
  }
};

// Cập nhật thông tin user
export const updateUserInfo = async (userData) => {
  try {
    const response = await httpClient.put(ENDPOINTS.USERS_UPDATE, userData);
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Cập nhật thông tin thành công'
      };
    }
    
    return {
      success: false,
      data: null,
      message: response.data?.message || 'Cập nhật thông tin thất bại'
    };
  } catch (error) {
    console.error('Update user info error:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
    };
  }
};

// Đổi mật khẩu
export const changePassword = async (userId, newPassword) => {
  try {
    const response = await httpClient.post(ENDPOINTS.USERS_UPDATE, {
      userId: userId,
      password: newPassword
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Đổi mật khẩu thành công'
      };
    }
    
    return {
      success: false,
      data: null,
      message: response.data?.message || 'Đổi mật khẩu thất bại'
    };
  } catch (error) {
    console.error('Change password error:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
    };
  }
};

const authService = {
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserInfo,
  updateUserInfo,
  changePassword,
};

export default authService;
