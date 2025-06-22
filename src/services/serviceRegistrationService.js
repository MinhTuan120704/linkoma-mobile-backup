import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";
import { Alert } from "react-native";

// Tạo service registration mới
export const createServiceRegistration = async (serviceRegistrationData) => {
  try {
    const response = await httpClient.post(
      ENDPOINTS.SERVICE_REGISTRATIONS,
      serviceRegistrationData
    );

    if (response.data && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Tạo đăng ký dịch vụ thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Tạo đăng ký dịch vụ thất bại",
    };
  } catch (error) {
    console.log("Create service registration error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi tạo đăng ký dịch vụ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi tạo đăng ký dịch vụ",
    };
  }
};

// Lấy tất cả service registrations
export const getAllServiceRegistrations = async (params = {}) => {
  try {
    const response = await httpClient.get(
      ENDPOINTS.SERVICE_REGISTRATIONS_GET_ALL,
      { params }
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách đăng ký dịch vụ thành công",
      };
    }

    return {
      success: false,
      message:
        response.data?.message || "Lấy danh sách đăng ký dịch vụ thất bại",
    };
  } catch (error) {
    console.log("Get all service registrations error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách đăng ký dịch vụ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách đăng ký dịch vụ",
    };
  }
};

// Lấy service registration theo ID
export const getServiceRegistrationById = async (serviceRegistrationId) => {
  try {
    const response = await httpClient.get(
      `${ENDPOINTS.SERVICE_REGISTRATIONS_GET_BY_ID}/${serviceRegistrationId}`
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy đăng ký dịch vụ theo ID thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Không tìm thấy đăng ký dịch vụ",
    };
  } catch (error) {
    console.log("Get service registration by ID error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy đăng ký dịch vụ theo ID",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy đăng ký dịch vụ theo ID",
    };
  }
};

// Lấy service registrations theo apartment ID
export const getServiceRegistrationsByApartmentId = async (
  apartmentId,
  params = {}
) => {
  try {
    // Add apartmentId to params to filter by apartment
    const queryParams = { ...params, apartmentId };
    const response = await httpClient.get(
      ENDPOINTS.SERVICE_REGISTRATIONS_GET_ALL,
      { params: queryParams }
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách đăng ký dịch vụ theo căn hộ thành công",
      };
    }

    return {
      success: false,
      message:
        response.data?.message ||
        "Lấy danh sách đăng ký dịch vụ theo căn hộ thất bại",
    };
  } catch (error) {
    console.log("Get service registrations by apartment ID error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách đăng ký dịch vụ theo căn hộ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách đăng ký dịch vụ theo căn hộ",
    };
  }
};

// Cập nhật service registration
export const updateServiceRegistration = async (
  serviceRegistrationId,
  serviceRegistrationData
) => {
  try {
    const response = await httpClient.patch(
      `${ENDPOINTS.SERVICE_REGISTRATIONS_UPDATE}/${serviceRegistrationId}`,
      serviceRegistrationData
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Cập nhật đăng ký dịch vụ thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Cập nhật đăng ký dịch vụ thất bại",
    };
  } catch (error) {
    console.log("Update service registration error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật đăng ký dịch vụ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật đăng ký dịch vụ",
    };
  }
};

// Xóa service registration
export const deleteServiceRegistration = async (serviceRegistrationId) => {
  try {
    const response = await httpClient.delete(
      `${ENDPOINTS.SERVICE_REGISTRATIONS_DELETE}/${serviceRegistrationId}`
    );

    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: "Xóa đăng ký dịch vụ thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Xóa đăng ký dịch vụ thất bại",
    };
  } catch (error) {
    console.log("Delete service registration error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi xóa đăng ký dịch vụ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi xóa đăng ký dịch vụ",
    };
  }
};

// Export default object containing all functions for convenience
const serviceRegistrationService = {
  createServiceRegistration,
  getAllServiceRegistrations,
  getServiceRegistrationById,
  getServiceRegistrationsByApartmentId,
  updateServiceRegistration,
  deleteServiceRegistration,
};

export default serviceRegistrationService;
