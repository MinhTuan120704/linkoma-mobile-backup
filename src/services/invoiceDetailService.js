import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";

export const createInvoiceDetail = async (invoiceDetailData) => {
  try {
    const response = await httpClient.post(
      ENDPOINTS.INVOICE_DETAILS,
      invoiceDetailData
    );
    return {
      success: true,
      data: response.data,
      message: "Tạo chi tiết hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error creating invoice detail:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Tạo chi tiết hóa đơn thất bại",
    };
  }
};

export const getAllInvoiceDetails = async (queryParams = {}) => {
  try {
    const response = await httpClient.get(ENDPOINTS.INVOICE_DETAILS_GET_ALL, {
      params: queryParams,
    });

    if (response.data && response.status === 200) {
      // Transform API response to match expected format
      const transformedData = {
        data: response.data.results || [],
        hasNextPage: response.data.page < response.data.totalPages,
        totalCount: response.data.totalResults || 0,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
      };

      return {
        success: true,
        data: transformedData,
        message: "Lấy danh sách chi tiết hóa đơn thành công",
      };
    }

    return {
      success: false,
      data: null,
      message:
        response.data?.message || "Lấy danh sách chi tiết hóa đơn thất bại",
    };
  } catch (error) {
    console.log("Error getting all invoice details:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Lấy danh sách chi tiết hóa đơn thất bại",
    };
  }
};

export const getInvoiceDetailById = async (invoiceDetailId) => {
  try {
    const response = await httpClient.get(
      `${ENDPOINTS.INVOICE_DETAILS_GET_BY_ID}/${invoiceDetailId}`
    );
    return {
      success: true,
      data: response.data,
      message: "Lấy thông tin chi tiết hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error getting invoice detail by ID:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Lấy thông tin chi tiết hóa đơn thất bại",
    };
  }
};

export const getInvoiceDetailsByInvoiceId = async (invoiceId) => {
  try {
    const response = await httpClient.get(ENDPOINTS.INVOICE_DETAILS_GET_ALL, {
      params: { invoiceId },
    });

    if (response.data && response.status === 200) {
      // Transform API response to match expected format
      const transformedData = {
        data: response.data.results || [],
        hasNextPage: response.data.page < response.data.totalPages,
        totalCount: response.data.totalResults || 0,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
      };

      return {
        success: true,
        data: transformedData,
        message: "Lấy chi tiết hóa đơn theo mã hóa đơn thành công",
      };
    }

    return {
      success: false,
      data: null,
      message:
        response.data?.message ||
        "Lấy chi tiết hóa đơn theo mã hóa đơn thất bại",
    };
  } catch (error) {
    console.log("Error getting invoice details by invoice ID:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Lấy chi tiết hóa đơn theo mã hóa đơn thất bại",
    };
  }
};

export const updateInvoiceDetail = async (invoiceDetailId, updateData) => {
  try {
    const response = await httpClient.patch(
      `${ENDPOINTS.INVOICE_DETAILS_UPDATE}/${invoiceDetailId}`,
      updateData
    );
    return {
      success: true,
      data: response.data,
      message: "Cập nhật chi tiết hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error updating invoice detail:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Cập nhật chi tiết hóa đơn thất bại",
    };
  }
};

export const deleteInvoiceDetail = async (invoiceDetailId) => {
  try {
    const response = await httpClient.delete(
      `${ENDPOINTS.INVOICE_DETAILS_DELETE}/${invoiceDetailId}`
    );
    return {
      success: true,
      data: response.data,
      message: "Xóa chi tiết hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error deleting invoice detail:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Xóa chi tiết hóa đơn thất bại",
    };
  }
};

// Bulk create invoice details for complex invoices
export const createMultipleInvoiceDetails = async (detailsArray) => {
  try {
    const promises = detailsArray.map((detail) =>
      httpClient.post(ENDPOINTS.INVOICE_DETAILS, detail)
    );
    const responses = await Promise.all(promises);

    return {
      success: true,
      data: responses.map((response) => response.data),
      message: "Tạo nhiều chi tiết hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error creating multiple invoice details:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Tạo nhiều chi tiết hóa đơn thất bại",
    };
  }
};

const invoiceDetailService = {
  createInvoiceDetail,
  getAllInvoiceDetails,
  getInvoiceDetailById,
  getInvoiceDetailsByInvoiceId,
  updateInvoiceDetail,
  deleteInvoiceDetail,
  createMultipleInvoiceDetails,
};

export default invoiceDetailService;
