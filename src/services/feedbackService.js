import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";
import { Alert } from "react-native";

export const createFeedback = async (feedbackData) => {
  try {
    const response = await httpClient.post(ENDPOINTS.FEEDBACKS, feedbackData);

    if (response.data && response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Tạo phản hồi thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Tạo phản hồi thất bại",
    };
  } catch (error) {
    console.log("Create feedback error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi tạo phản hồi",
    };
  }
};

export const getAllFeedbacks = async (params = {}) => {
  try {
    const response = await httpClient.get(ENDPOINTS.FEEDBACKS_GET_ALL, {
      params,
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách phản hồi thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Lấy danh sách phản hồi thất bại",
    };
  } catch (error) {
    console.log("Get all feedbacks error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách phản hồi",
    };
  }
};

export const getFeedbackById = async (feedbackId) => {
  try {
    const response = await httpClient.get(
      `${ENDPOINTS.FEEDBACKS_GET_BY_ID}/${feedbackId}`
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy phản hồi theo ID thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Không tìm thấy phản hồi",
    };
  } catch (error) {
    console.log("Get feedback by ID error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy phản hồi theo ID",
    };
  }
};

export const updateFeedback = async (feedbackId, feedbackData) => {
  try {
    const response = await httpClient.patch(
      `${ENDPOINTS.FEEDBACKS_UPDATE}/${feedbackId}`,
      feedbackData
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Cập nhật phản hồi thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Cập nhật phản hồi thất bại",
    };
  } catch (error) {
    console.log("Update feedback error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật phản hồi",
    };
  }
};

export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await httpClient.delete(
      `${ENDPOINTS.FEEDBACKS_DELETE}/${feedbackId}`
    );

    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: "Xóa phản hồi thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Xóa phản hồi thất bại",
    };
  } catch (error) {
    console.log("Delete feedback error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi xóa phản hồi",
    };
  }
};

export const getFeedbacksByUserId = async (userId, params = {}) => {
  try {
    const response = await httpClient.get(
      `${ENDPOINTS.FEEDBACKS_BY_USER}/${userId}`,
      { params }
    );

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy phản hồi theo user ID thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Lấy phản hồi theo user ID thất bại",
    };
  } catch (error) {
    console.log("Get feedbacks by user ID error:", error);
    Alert.alert(
      "Lỗi",
      error.response?.data?.message || "Có lỗi xảy ra",
      [{ text: "OK" }]
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy phản hồi theo user ID",
    };
  }
};

const feedbackService = {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbacksByUserId,
};

export default feedbackService;
