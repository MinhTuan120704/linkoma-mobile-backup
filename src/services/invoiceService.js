import httpClient from './httpClient';
import { ENDPOINTS } from './apiConfig';

export const createInvoice = async (invoiceData) => {
  try {
    const response = await httpClient.post(ENDPOINTS.INVOICES, invoiceData);
    return {
      success: true,
      data: response.data,
      message: 'Tạo hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error creating invoice:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Tạo hóa đơn thất bại'
    };
  }
};

export const getAllInvoices = async () => {
  try {
    const response = await httpClient.get(ENDPOINTS.INVOICES_GET_ALL);
    return {
      success: true,
      data: response.data,
      message: 'Lấy danh sách hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error getting all invoices:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Lấy danh sách hóa đơn thất bại'
    };
  }
};

export const createInvoiceWithDetails = async (invoiceWithDetailsData) => {
  try {
    const response = await httpClient.post(ENDPOINTS.INVOICES_WITH_DETAILS, invoiceWithDetailsData);
    return {
      success: true,
      data: response.data,
      message: 'Tạo hóa đơn kèm chi tiết thành công'
    };
  } catch (error) {
    console.error('Error creating invoice with details:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Tạo hóa đơn kèm chi tiết thất bại'
    };
  }
};

export const getInvoiceById = async (invoiceId) => {
  try {
    const response = await httpClient.get(`${ENDPOINTS.INVOICES_GET_BY_ID}/${invoiceId}`);
    return {
      success: true,
      data: response.data,
      message: 'Lấy thông tin hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error getting invoice by ID:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Lấy thông tin hóa đơn thất bại'
    };
  }
};

export const updateInvoice = async (invoiceId, updateData) => {
  try {
    const response = await httpClient.patch(`${ENDPOINTS.INVOICES_UPDATE}/${invoiceId}`, updateData);
    return {
      success: true,
      data: response.data,
      message: 'Cập nhật hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error updating invoice:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Cập nhật hóa đơn thất bại'
    };
  }
};

export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await httpClient.delete(`${ENDPOINTS.INVOICES_DELETE}/${invoiceId}`);
    return {
      success: true,
      data: response.data,
      message: 'Xóa hóa đơn thành công'
    };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Xóa hóa đơn thất bại'
    };
  }
};

const invoiceService = {
  createInvoice,
  getAllInvoices,
  createInvoiceWithDetails,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
};

export default invoiceService;
