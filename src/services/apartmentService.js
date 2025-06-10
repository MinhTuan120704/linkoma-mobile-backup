import httpClient from './httpClient';
import { ENDPOINTS } from './apiConfig';

export const createApartment = async (apartmentData) => {
  try {
    const response = await httpClient.post(ENDPOINTS.APARTMENTS, apartmentData);
    
    if (response.data && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: 'Tạo apartment thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Tạo apartment thất bại'
    };
  } catch (error) {
    console.error('Create apartment error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo apartment'
    };
  }
};

export const getAllApartments = async (params = {}) => {
  try {
    const response = await httpClient.get(ENDPOINTS.APARTMENTS_GET_ALL, { params });
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách apartment thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Lấy danh sách apartment thất bại'
    };
  } catch (error) {
    console.error('Get all apartments error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách apartment'
    };
  }
};

export const getApartmentById = async (apartmentId) => {
  try {
    const response = await httpClient.get(`${ENDPOINTS.APARTMENTS_GET_BY_ID}/${apartmentId}`);
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Lấy apartment theo ID thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Không tìm thấy apartment'
    };
  } catch (error) {
    console.error('Get apartment by ID error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy apartment theo ID'
    };
  }
};

export const updateApartment = async (apartmentId, apartmentData) => {
  try {
    const response = await httpClient.patch(`${ENDPOINTS.APARTMENTS_UPDATE}/${apartmentId}`, apartmentData);
    
    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật apartment thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Cập nhật apartment thất bại'
    };
  } catch (error) {
    console.error('Update apartment error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật apartment'
    };
  }
};

export const deleteApartment = async (apartmentId) => {
  try {
    const response = await httpClient.delete(`${ENDPOINTS.APARTMENTS_DELETE}/${apartmentId}`);
    
    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: 'Xóa apartment thành công'
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Xóa apartment thất bại'
    };
  } catch (error) {
    console.error('Delete apartment error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa apartment'
    };
  }
};

const apartmentService = {
  createApartment,
  getAllApartments,
  getApartmentById,
  updateApartment,
  deleteApartment
};

export default apartmentService;
