import { Alert } from "react-native";
// Import các service để thực hiện các chức năng:
// - Xóa và lấy danh sách cư dân (removeResident, getAllResidents)
// - Xóa và lấy danh sách căn hộ (removeApartment, getAllApartments)
// - Xóa và lấy danh sách phản hồi (removeFeedback, getAllFeedbacks)
// - Xóa và lấy danh sách phí dịch vụ (removeServiceFee, getAllServiceFees)
// - Xóa và lấy danh sách thông báo (removeNotification, getAllNotifications)
// - Xóa và lấy danh sách hóa đơn (removeInvoice, getAllInvoices)

export const createDeleteHandler = (
  title,
  service,
  getAllItems,
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
            // TODO: Call API để xóa item theo id
            // TODO: Call API để lấy danh sách items mới
            setItems([]);
          } catch (error) {
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
        // TODO: Call API removeResident(id) để xóa cư dân
      },
      async () => {
        // TODO: Call API getAllResidents() để lấy danh sách cư dân
        return [];
      },
      setResidents,
      "Không thể xóa cư dân"
    ),

    // Xử lý xóa căn hộ
    handleDeleteApartment: createDeleteHandler(
      "căn hộ",
      async (id) => {
        // TODO: Call API removeApartment(id) để xóa căn hộ
      },
      async () => {
        // TODO: Call API getAllApartments() để lấy danh sách căn hộ
        return [];
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
      removeInvoice,
      getAllInvoices,
      setInvoices,
      "Không thể xóa hóa đơn"
    ),
  };
};
