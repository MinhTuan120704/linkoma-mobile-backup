import httpClient from './httpClient';
import { ENDPOINTS } from './apiConfig';
import { setAccessToken, setRefreshToken, clearAll, saveTokens } from './storage';

// Đăng nhập
import { saveTokens } from "./storage";
import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";

export const login = async (credentials) => {
  try {
    const response = await httpClient.post(ENDPOINTS.LOGIN, credentials, {
      withCredentials: true,
    });

    if (response.data && response.status === 200) {
      const { accessToken, user } = response.data;

      if (accessToken) {
        await saveTokens(accessToken);
      }

      return {
        success: true,
        data: { user, accessToken },
        message: "Đăng nhập thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Đăng nhập thất bại",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Có lỗi xảy ra khi đăng nhập",
    };
  }
};


// Đăng xuất
export const logout = async () => {
  try {
    await httpClient.post(ENDPOINTS.LOGOUT);
    
    await clearAll();
    
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  } catch (error) {
    console.error('Logout error:', error);
    
    await clearAll();
    
    return {
      success: true,
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
        message: response.data?.message || 'Email reset mật khẩu đã được gửi'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Gửi email thất bại'
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
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
        message: response.data?.message || 'Đặt lại mật khẩu thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Đặt lại mật khẩu thất bại'
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu'
    };
  }
};

const authService = {
  login,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;
