import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";
import { Alert } from "react-native";

export const createAnnouncement = async (announcementData) => {
  try {
    const response = await httpClient.post(
      ENDPOINTS.ANNOUNCEMENTS,
      announcementData
    );

    if (response.data && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Tạo thông báo thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Tạo thông báo thất bại",
    };
  } catch (error) {
    console.log("Create announcement error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi tạo thông báo",
    };
  }
};

export const getAllAnnouncements = async (queryParams = null) => {
  try {
    // Debug: Check if we have a token before making request
    const { getAccessToken } = await import("./storage");
    const token = await getAccessToken();
    console.log(
      "Current token before getAllAnnouncements:",
      token ? "Token exists" : "No token"
    );

    let response;

    // If queryParams is URLSearchParams, convert to string and append to URL
    if (queryParams instanceof URLSearchParams) {
      const paramString = queryParams.toString();
      let url = ENDPOINTS.ANNOUNCEMENTS_GET_ALL;
      if (paramString) {
        url += `?${paramString}`;
      }
      response = await httpClient.get(url);
    } else {
      // Use params object for axios
      response = await httpClient.get(ENDPOINTS.ANNOUNCEMENTS_GET_ALL, {
        params: queryParams || {},
      });
    }

    console.log("Get all announcements response:", response);

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách thông báo thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Lấy danh sách thông báo thất bại",
    };
  } catch (error) {
    console.log("Get all announcements error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    console.log("Error response status:", error.response?.status);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    console.log("Error response data:", error.response?.data);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách thông báo",
    };
  }
};

export const getAnnouncementById = async (announcementId) => {
  try {
    const response = await httpClient.get(
      `${ENDPOINTS.ANNOUNCEMENTS_GET_BY_ID}/${announcementId}`
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy thông báo theo ID thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Không tìm thấy thông báo",
    };
  } catch (error) {
    console.log("Get announcement by ID error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy thông báo theo ID",
    };
  }
};

export const updateAnnouncement = async (announcementId, announcementData) => {
  try {
    const response = await httpClient.patch(
      `${ENDPOINTS.ANNOUNCEMENTS_UPDATE}/${announcementId}`,
      announcementData
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Cập nhật thông báo thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Cập nhật thông báo thất bại",
    };
  } catch (error) {
    console.log("Update announcement error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông báo",
    };
  }
};

export const deleteAnnouncement = async (announcementId) => {
  try {
    const response = await httpClient.delete(
      `${ENDPOINTS.ANNOUNCEMENTS_DELETE}/${announcementId}`
    );

    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: "Xóa thông báo thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Xóa thông báo thất bại",
    };
  } catch (error) {
    console.log("Delete announcement error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi xóa thông báo",
    };
  }
};

export const getAnnouncementsByUserId = async (userId, queryParams = null) => {
  try {
    let url = `${ENDPOINTS.ANNOUNCEMENTS_BY_USER}/${userId}`;
    let response;

    // If queryParams is URLSearchParams, convert to string and append to URL
    if (queryParams instanceof URLSearchParams) {
      const paramString = queryParams.toString();
      if (paramString) {
        url += `?${paramString}`;
      }
      response = await httpClient.get(url);
    } else {
      // Use params object for axios
      response = await httpClient.get(url, { params: queryParams || {} });
    }

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy thông báo theo user ID thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Lấy thông báo theo user ID thất bại",
    };
  } catch (error) {
    console.log("Get announcements by user ID error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy thông báo theo user ID",
    };
  }
};

const announcementService = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByUserId,
};

export default announcementService;
