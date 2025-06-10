import httpClient from './httpClient';
import { ENDPOINTS } from './apiConfig';
import { setAccessToken, setRefreshToken, clearAll, saveTokens, getAccessToken } from './storage';

export const login = async (email, password) => {
  try {
    // Tạo credentials object từ email và password
    const credentials = { email, password };
    
    console.log('Login with credentials:', credentials);
    
    const response = await httpClient.post(ENDPOINTS.LOGIN, credentials, {
      withCredentials: true,
    });

    console.log('Login response status:', response.status);
    console.log('Login response data:', response.data);

    if (response.data && response.status === 200) {
      const { accessToken, user } = response.data;
      
      console.log('AccessToken received:', accessToken);
      console.log('AccessToken type:', typeof accessToken);      
      if (accessToken) {
        await saveTokens(accessToken.token);
        
        // Verify token was saved
        const savedToken = await getAccessToken();
        console.log('Token saved successfully:', savedToken ? 'Yes' : 'No');
        console.log('Saved token value:', savedToken);
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
    await httpClient.post(ENDPOINTS.LOGOUT);
    
    await clearAll();
    
    return {
      success: true,
      data: null,
      message: 'Đăng xuất thành công'
    };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Vẫn clear tokens local dù API lỗi
    await clearAll();
    
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

const authService = {
  login,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;
