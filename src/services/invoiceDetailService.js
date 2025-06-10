import httpClient from './httpClient';
import { ENDPOINTS } from './apiConfig';

export const createInvoiceDetail = async (invoiceDetailData) => {
  try {
    const response = await httpClient.post(ENDPOINTS.INVOICE_DETAILS, invoiceDetailData);
    return {
      success: true,
      data: response.data,
      message: 'Tạo chi tiết hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error creating invoice detail:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Tạo chi tiết hóa đơn thất bại'
    };
  }
};

export const getAllInvoiceDetails = async () => {
  try {
    const response = await httpClient.get(ENDPOINTS.INVOICE_DETAILS_GET_ALL);
    return {
      success: true,
      data: response.data,
      message: 'Lấy danh sách chi tiết hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error getting all invoice details:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Lấy danh sách chi tiết hóa đơn thất bại'
    };
  }
};

export const getInvoiceDetailById = async (invoiceDetailId) => {
  try {
    const response = await httpClient.get(`${ENDPOINTS.INVOICE_DETAILS_GET_BY_ID}/${invoiceDetailId}`);
    return {
      success: true,
      data: response.data,
      message: 'Lấy thông tin chi tiết hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error getting invoice detail by ID:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Lấy thông tin chi tiết hóa đơn thất bại'
    };
  }
};

export const getInvoiceDetailsByInvoiceId = async (invoiceId) => {
  try {
    const response = await httpClient.get(`${ENDPOINTS.INVOICE_DETAILS_GET_BY_INVOICE_ID}/${invoiceId}`);
    return {
      success: true,
      data: response.data,
      message: 'Lấy chi tiết hóa đơn theo mã hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error getting invoice details by invoice ID:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Lấy chi tiết hóa đơn theo mã hóa đơn thất bại'
    };
  }
};

export const updateInvoiceDetail = async (invoiceDetailId, updateData) => {
  try {
    const response = await httpClient.patch(`${ENDPOINTS.INVOICE_DETAILS_UPDATE}/${invoiceDetailId}`, updateData);
    return {
      success: true,
      data: response.data,
      message: 'Cập nhật chi tiết hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error updating invoice detail:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Cập nhật chi tiết hóa đơn thất bại'
    };
  }
};

export const deleteInvoiceDetail = async (invoiceDetailId) => {
  try {
    const response = await httpClient.delete(`${ENDPOINTS.INVOICE_DETAILS_DELETE}/${invoiceDetailId}`);
    return {
      success: true,
      data: response.data,
      message: 'Xóa chi tiết hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error deleting invoice detail:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Xóa chi tiết hóa đơn thất bại'
    };
  }
};

export const deleteInvoiceDetailsByInvoiceId = async (invoiceId) => {
  try {
    const response = await httpClient.delete(`${ENDPOINTS.INVOICE_DETAILS_DELETE_BY_INVOICE_ID}/${invoiceId}`);
    return {
      success: true,
      data: response.data,
      message: 'Xóa tất cả chi tiết hóa đơn theo mã hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error deleting invoice details by invoice ID:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Xóa tất cả chi tiết hóa đơn theo mã hóa đơn thất bại'
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
  deleteInvoiceDetailsByInvoiceId
};

export default invoiceDetailService;
