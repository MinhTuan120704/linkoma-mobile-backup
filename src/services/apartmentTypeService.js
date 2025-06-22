import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";
import { Alert } from "react-native";

export const createApartmentType = async (apartmentTypeData) => {
  try {
    const response = await httpClient.post(
      ENDPOINTS.APARTMENT_TYPES,
      apartmentTypeData
    );

    if (response.data && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Tạo apartment type thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Tạo apartment type thất bại",
    };
  } catch (error) {
    console.log("Create apartment type error:", error);
    Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", [
      { text: "OK" },
    ]);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra khi tạo apartment type",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi tạo apartment type",
    };
  }
};

export const getAllApartmentTypes = async (params = {}) => {
  try {
    const response = await httpClient.get(ENDPOINTS.APARTMENT_TYPES_GET_ALL, {
      params,
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách apartment type thành công",
      };
    }

    return {
      success: false,
      message:
        response.data?.message || "Lấy danh sách apartment type thất bại",
    };
  } catch (error) {
    console.log("Get all apartment types error:", error);
    Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", [
      { text: "OK" },
    ]);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách apartment type",
    };
  }
};

export const getApartmentTypeById = async (apartmentTypeId) => {
  try {
    const response = await httpClient.get(
      `${ENDPOINTS.APARTMENT_TYPES_GET_BY_ID}/${apartmentTypeId}`
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy apartment type theo ID thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Không tìm thấy apartment type",
    };
  } catch (error) {
    console.log("Get apartment type by ID error:", error);
    Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", [
      { text: "OK" },
    ]);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy apartment type theo ID",
    };
  }
};

export const updateApartmentType = async (
  apartmentTypeId,
  apartmentTypeData
) => {
  try {
    const response = await httpClient.patch(
      `${ENDPOINTS.APARTMENT_TYPES_UPDATE}/${apartmentTypeId}`,
      apartmentTypeData
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Cập nhật apartment type thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Cập nhật apartment type thất bại",
    };
  } catch (error) {
    console.log("Update apartment type error:", error);
    Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", [
      { text: "OK" },
    ]);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật apartment type",
    };
  }
};

export const deleteApartmentType = async (apartmentTypeId) => {
  try {
    const response = await httpClient.delete(
      `${ENDPOINTS.APARTMENT_TYPES_DELETE}/${apartmentTypeId}`
    );

    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: "Xóa apartment type thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Xóa apartment type thất bại",
    };
  } catch (error) {
    console.log("Delete apartment type error:", error);
    Alert.alert("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", [
      { text: "OK" },
    ]);
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi xóa apartment type",
    };
  }
};

const apartmentTypeService = {
  createApartmentType,
  getAllApartmentTypes,
  getApartmentTypeById,
  updateApartmentType,
  deleteApartmentType,
};

export default apartmentTypeService;
