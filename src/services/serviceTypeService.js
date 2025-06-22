import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";
import { Alert } from "react-native";

export const createServiceType = async (serviceTypeData) => {
  try {
    const response = await httpClient.post(
      ENDPOINTS.SERVICE_TYPES,
      serviceTypeData
    );

    if (response.data && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Tạo loại dịch vụ thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Tạo loại dịch vụ thất bại",
    };
  } catch (error) {
    console.log("Create service type error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi tạo loại dịch vụ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi tạo loại dịch vụ",
    };
  }
};

export const getAllServiceTypes = async (params = {}) => {
  try {
    const response = await httpClient.get(ENDPOINTS.SERVICE_TYPES_GET_ALL, {
      params,
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách loại dịch vụ thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Lấy danh sách loại dịch vụ thất bại",
    };
  } catch (error) {
    console.log("Get all service types error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách loại dịch vụ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách loại dịch vụ",
    };
  }
};

export const getServiceTypeById = async (serviceTypeId) => {
  try {
    const response = await httpClient.get(
      `${ENDPOINTS.SERVICE_TYPES_GET_BY_ID}/${serviceTypeId}`
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy loại dịch vụ theo ID thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Không tìm thấy loại dịch vụ",
    };
  } catch (error) {
    console.log("Get service type by ID error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy loại dịch vụ theo ID",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy loại dịch vụ theo ID",
    };
  }
};

export const updateServiceType = async (serviceTypeId, serviceTypeData) => {
  try {
    const response = await httpClient.patch(
      `${ENDPOINTS.SERVICE_TYPES_UPDATE}/${serviceTypeId}`,
      serviceTypeData
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Cập nhật loại dịch vụ thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Cập nhật loại dịch vụ thất bại",
    };
  } catch (error) {
    console.log("Update service type error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật loại dịch vụ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật loại dịch vụ",
    };
  }
};

export const deleteServiceType = async (serviceTypeId) => {
  try {
    const response = await httpClient.delete(
      `${ENDPOINTS.SERVICE_TYPES_DELETE}/${serviceTypeId}`
    );

    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: "Xóa loại dịch vụ thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Xóa loại dịch vụ thất bại",
    };
  } catch (error) {
    console.log("Delete service type error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi xóa loại dịch vụ",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi xóa loại dịch vụ",
    };
  }
};

const serviceTypeService = {
  createServiceType,
  getAllServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
};

export default serviceTypeService;
