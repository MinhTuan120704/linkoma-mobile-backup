import { Alert } from "react-native";
import userService from "../../../services/userService";
import apartmentService from "../../../services/apartmentService";
import feedbackService from "../../../services/feedbackService";
import serviceTypeService from "../../../services/serviceTypeService";
import announcementService from "../../../services/announcementService";
import invoiceService from "../../../services/invoiceService";

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
            // Call API to delete item
            const deleteResult = await deleteService(id);

            if (deleteResult.success) {
              // Refresh the list after successful deletion
              const refreshResult = await getAllService({ limit: 100 });
              if (refreshResult.success) {
                setItems(
                  refreshResult.data.results || refreshResult.data || []
                );
              }
              Alert.alert("Thành công", `Đã xóa ${title} thành công!`);
            } else {
              Alert.alert("Lỗi", deleteResult.message || errorMessage);
            }
          } catch (error) {
            console.log(`Error deleting ${title}:`, error);
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
        return await userService.deleteUser(id);
      },
      async () => {
        return await userService.getUsers({ limit: 100 });
      },
      setResidents,
      "Không thể xóa cư dân"
    ), // Xử lý xóa căn hộ
    handleDeleteApartment: createDeleteHandler(
      "căn hộ",
      async (id) => {
        return await apartmentService.deleteApartment(id);
      },
      async () => {
        return await apartmentService.getAllApartments({ limit: 100 });
      },
      setApartments,
      "Không thể xóa căn hộ"
    ), // Xử lý xóa phản hồi
    handleDeleteFeedback: createDeleteHandler(
      "phản hồi",
      async (id) => {
        return await feedbackService.deleteFeedback(id);
      },
      async () => {
        return await feedbackService.getAllFeedbacks({ limit: 100 });
      },
      setFeedbacks,
      "Không thể xóa phản hồi"
    ), // Xử lý xóa phí dịch vụ
    handleDeleteServiceFee: createDeleteHandler(
      "phí dịch vụ",
      async (id) => {
        return await serviceTypeService.deleteServiceType(id);
      },
      async () => {
        return await serviceTypeService.getAllServiceTypes({ limit: 100 });
      },
      setServiceFees,
      "Không thể xóa phí dịch vụ"
    ), // Xử lý xóa thông báo
    handleDeleteNotification: createDeleteHandler(
      "thông báo",
      async (id) => {
        return await announcementService.deleteAnnouncement(id);
      },
      async () => {
        return await announcementService.getAllAnnouncements({ limit: 100 });
      },
      setNotifications,
      "Không thể xóa thông báo"
    ),
    handleDeleteInvoice: createDeleteHandler(
      "hóa đơn",
      async (id) => {
        return await invoiceService.deleteInvoice(id);
      },
      async () => {
        return await invoiceService.getAllInvoices({ limit: 100 });
      },
      setInvoices,
      "Không thể xóa hóa đơn"
    ),
  };
};
