import httpClient from './httpClient';
import { ENDPOINTS } from './apiConfig';

export const createUser = async (userData) => {
  try {
    const response = await httpClient.post(ENDPOINTS.USERS, userData);
    
    if (response.data && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: 'Tạo user thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Tạo user thất bại'
    };
  } catch (error) {
    console.error('Create user error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo user'
    };
  }
};

export const getAllUsers = async (params = {}) => {
  try {
    const response = await httpClient.get(ENDPOINTS.USERS_GET_ALL, { params });
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách user thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Lấy danh sách user thất bại'
    };
  } catch (error) {
    console.error('Get all users error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách user'
    };
  }
};

export const createUserWithEmail = async (email) => {
  try {
    const response = await httpClient.post(ENDPOINTS.USERS_CREATE_WITH_EMAIL, { email });
    
    if (response.data && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: 'Tạo user với email thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Tạo user với email thất bại'
    };
  } catch (error) {
    console.error('Create user with email error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo user với email'
    };
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await httpClient.get(`${ENDPOINTS.USERS_GET_BY_EMAIL}/${email}`);
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Lấy user theo email thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Không tìm thấy user'
    };
  } catch (error) {
    console.error('Get user by email error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy user theo email'
    };
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await httpClient.get(`${ENDPOINTS.USERS_GET_BY_ID}/${userId}`);
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Lấy user theo ID thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Không tìm thấy user'
    };
  } catch (error) {
    console.error('Get user by ID error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy user theo ID'
    };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await httpClient.patch(`${ENDPOINTS.USERS_UPDATE}/${userId}`, userData);
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật user thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Cập nhật user thất bại'
    };
  } catch (error) {
    console.error('Update user error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật user'
    };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await httpClient.delete(`${ENDPOINTS.USERS_DELETE}/${userId}`);
    
    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: 'Xóa user thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Xóa user thất bại'
    };
  } catch (error) {
    console.error('Delete user error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa user'
    };
  }
};

const userService = {
    createUser,
    getAllUsers,
    createUserWithEmail,
    getUserByEmail,
    getUserById,
    updateUser,
    deleteUser
};

export default userService;
