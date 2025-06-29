import httpClient from "./httpClient";
import { ENDPOINTS } from "./apiConfig";
import { Alert } from "react-native";

export const createInvoice = async (invoiceData) => {
  try {
    const response = await httpClient.post(ENDPOINTS.INVOICES, invoiceData);
    return {
      success: true,
      data: response.data,
      message: "Tạo hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error creating invoice:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Tạo hóa đơn thất bại",
    };
  }
};

export const createInvoiceWithDetails = async (invoiceWithDetailsData) => {
  try {
    const response = await httpClient.post(
      ENDPOINTS.INVOICES_WITH_DETAILS,
      invoiceWithDetailsData
    );
    return {
      success: true,
      data: response.data,
      message: "Tạo hóa đơn kèm chi tiết thành công",
    };
  } catch (error) {
    console.log("Error creating invoice with details:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Tạo hóa đơn kèm chi tiết thất bại",
    };
  }
};

export const getAllInvoices = async (queryParams = null) => {
  try {
    let response;

    // If queryParams is URLSearchParams, convert to string and append to URL
    if (queryParams instanceof URLSearchParams) {
      const paramString = queryParams.toString();
      let url = ENDPOINTS.INVOICES_GET_ALL;
      if (paramString) {
        url += `?${paramString}`;
      }
      response = await httpClient.get(url);
    } else {
      // Use params object for axios
      response = await httpClient.get(ENDPOINTS.INVOICES_GET_ALL, {
        params: queryParams || {},
      });
    }

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
        message: "Lấy danh sách hóa đơn thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Lấy danh sách hóa đơn thất bại",
    };
  } catch (error) {
    console.log("Error in getAllInvoices:", error);

    // Don't show alert in service layer for better UX
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        error.message ||
        "Lấy danh sách hóa đơn thất bại",
    };
  }
};

export const getInvoiceById = async (invoiceId) => {
  try {
    const response = await httpClient.get(
      `${ENDPOINTS.INVOICES_GET_BY_ID}/${invoiceId}`
    );
    return {
      success: true,
      data: response.data,
      message: "Lấy thông tin hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error getting invoice by ID:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Lấy thông tin hóa đơn thất bại",
    };
  }
};

export const updateInvoice = async (invoiceId, updateData) => {
  try {
    const response = await httpClient.patch(
      `${ENDPOINTS.INVOICES_UPDATE}/${invoiceId}`,
      updateData
    );
    return {
      success: true,
      data: response.data,
      message: "Cập nhật hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error updating invoice:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Cập nhật hóa đơn thất bại",
    };
  }
};

export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await httpClient.delete(
      `${ENDPOINTS.INVOICES_DELETE}/${invoiceId}`
    );
    return {
      success: true,
      data: response.data,
      message: "Xóa hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error deleting invoice:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Xóa hóa đơn thất bại",
    };
  }
};

export const payInvoice = async (invoiceId) => {
  try {
    const response = await httpClient.patch(
      `${ENDPOINTS.INVOICES_UPDATE}/${invoiceId}`,
      {
        status: "Paid",
        paidDate: new Date().toISOString(),
      }
    );
    return {
      success: true,
      data: response.data,
      message: "Thanh toán hóa đơn thành công",
    };
  } catch (error) {
    console.log("Error paying invoice:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Thanh toán hóa đơn thất bại",
    };
  }
};

const invoiceService = {
  createInvoice,
  getAllInvoices,
  createInvoiceWithDetails,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  payInvoice,
};

export default invoiceService;
