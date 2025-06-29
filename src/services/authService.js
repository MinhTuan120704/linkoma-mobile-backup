import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";
import { clearAll, removeCookie } from "./storage";
import { Alert } from "react-native";

export const login = async (email, password) => {
  try {
    const credentials = { email, password };

    const response = await httpClient.post(ENDPOINTS.LOGIN, credentials, {
      withCredentials: true, // Important for receiving cookies
    });

    if (response.data && response.status === 200) {
      const { accessToken, user } = response.data;

      if (!accessToken?.token) {
        throw new Error("No access token received");
      }

      // Token is automatically saved by httpClient response interceptor
      // No need to manually save here

      // Validate user data
      if (!user?.role) {
        throw new Error("User role not specified");
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
    console.log("Login error:", error);
    Alert.alert(
      "Lỗi đăng nhập",
      error.response?.data?.message || "Đăng nhập thất bại",
      [{ text: "OK" }]
    );
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Đăng nhập thất bại",
    };
  }
};

export const logout = async () => {
  try {
    // Call logout endpoint to invalidate refresh token on server
    await httpClient.post(ENDPOINTS.LOGOUT, {}, { withCredentials: true });
  } catch (error) {
    console.log("Logout API error:", error);
    // Don't show alert for logout errors as it's not critical
  } finally {
    // Clean up local storage regardless of API call success
    await clearAll();
    await removeCookie("refreshToken");
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await httpClient.post(ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.data?.message || "Email reset mật khẩu đã được gửi",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Gửi email thất bại",
    };
  } catch (error) {
    console.log("Forgot password error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi gửi email",
      [{ text: "OK" }]
    );
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Có lỗi xảy ra khi gửi email",
    };
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await httpClient.post(ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
      confirmPassword,
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.data?.message || "Đặt lại mật khẩu thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Đặt lại mật khẩu thất bại",
    };
  } catch (error) {
    console.log("Reset password error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu",
      [{ text: "OK" }]
    );
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu",
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
        message: "Lấy thông tin user thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Lấy thông tin user thất bại",
    };
  } catch (error) {
    console.log("Get user info error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin user",
      [{ text: "OK" }]
    );
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin user",
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
        message: response.data?.message || "Cập nhật thông tin thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Cập nhật thông tin thất bại",
    };
  } catch (error) {
    console.log("Update user info error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin",
      [{ text: "OK" }]
    );
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin",
    };
  }
};

// Đổi mật khẩu
export const changePassword = async (userId, newPassword) => {
  try {
    const response = await httpClient.post(ENDPOINTS.USERS_UPDATE, {
      userId: userId,
      password: newPassword,
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.data?.message || "Đổi mật khẩu thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Đổi mật khẩu thất bại",
    };
  } catch (error) {
    console.log("Change password error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu",
      [{ text: "OK" }]
    );
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu",
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
