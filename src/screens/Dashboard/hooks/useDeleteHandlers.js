import { Alert } from "react-native";
import { deleteInvoice, getAllInvoices } from "../../../services/invoiceService";
import { residentService } from "../../../services";

export const createDeleteHandler = (
  title,
  deleteService,
  getAllService,
  setItems,
  errorMessage
) => {
  return async (id) => {
    Alert.alert("Xác nhận xóa", `Bạn có chắc chắn muốn xóa ${title} này?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            console.log(`Deleting ${title} with ID:`, id);
            
            // Call the delete service
            const deleteResult = await deleteService(id);
            console.log(`Delete ${title} result:`, deleteResult);
            
            if (deleteResult.success) {
              // Refresh the list after successful deletion
              const listResult = await getAllService();
              console.log(`Get all ${title} result:`, listResult);
              
              if (listResult.success && listResult.data) {
                setItems(listResult.data);
              } else {
                setItems([]);
              }
              Alert.alert("Thành công", deleteResult.message || `Xóa ${title} thành công`);
            } else {
              Alert.alert("Lỗi", deleteResult.message || errorMessage);
            }
          } catch (error) {
            console.error(`Error deleting ${title}:`, error);
            Alert.alert("Lỗi", errorMessage);
          }
        },
      },
    ]);
  };
};

export const useDeleteHandlers = (setters) => {
  const {
    setResidents,
    setApartments,
    setFeedbacks,
    setServiceFees,
    setNotifications,
    setInvoices,
  } = setters;

  return {
    // Xử lý xóa cư dân
    handleDeleteResident: createDeleteHandler(
      "cư dân",
      async (id) => {
        return await residentService.deleteResident(id);
      },
      async () => {
        return await residentService.getResidents();
      },
      setResidents,
      "Không thể xóa cư dân"
    ),

    // Xử lý xóa căn hộ
    handleDeleteApartment: createDeleteHandler(
      "căn hộ",
      async (id) => {
        const { apartmentService } = require('../../../services');
        return await apartmentService.deleteApartment(id);
      },
      async () => {
        const { apartmentService } = require('../../../services');
        return await apartmentService.getAllApartments();
      },
      setApartments,
      "Không thể xóa căn hộ"
    ),

    // Xử lý xóa phản hồi
    handleDeleteFeedback: createDeleteHandler(
      "phản hồi",
      async (id) => {
        // TODO: Call API removeFeedback(id) để xóa phản hồi
      },
      async () => {
        // TODO: Call API getAllFeedbacks() để lấy danh sách phản hồi
        return [];
      },
      setFeedbacks,
      "Không thể xóa phản hồi"
    ),

    // Xử lý xóa phí dịch vụ
    handleDeleteServiceFee: createDeleteHandler(
      "phí dịch vụ",
      async (id) => {
        // TODO: Call API removeServiceFee(id) để xóa phí dịch vụ
      },
      async () => {
        // TODO: Call API getAllServiceFees() để lấy danh sách phí dịch vụ
        return [];
      },
      setServiceFees,
      "Không thể xóa phí dịch vụ"
    ),

    // Xử lý xóa thông báo
    handleDeleteNotification: createDeleteHandler(
      "thông báo",
      async (id) => {
        // TODO: Call API removeNotification(id) để xóa thông báo
      },
      async () => {
        // TODO: Call API getAllNotifications() để lấy danh sách thông báo
        return [];
      },
      setNotifications,
      "Không thể xóa thông báo"
    ),
    handleDeleteInvoice: createDeleteHandler(
      "hóa đơn",
      deleteInvoice,
      getAllInvoices,
      setInvoices,
      "Không thể xóa hóa đơn"
    ),
  };
};
