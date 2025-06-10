import { useNavigation } from "@react-navigation/native";

export const useNavigationHandlers = () => {
  const navigation = useNavigation();

  return {
    // Resident handlers
    handleCreate: () => navigation.navigate("CreateResident"),
    handleView: (resident) => navigation.navigate("ViewResident", { resident }),
    handleEdit: (resident) => navigation.navigate("EditResident", { resident }),

    // Apartment handlers
    handleCreateApartment: () => navigation.navigate("ApartmentCreate"),
    handleViewApartment: (apartment) =>
      navigation.navigate("ApartmentView", { apartment }),
    handleEditApartment: (apartment) =>
      navigation.navigate("ApartmentEdit", { apartment }),

    // Feedback handlers
    handleCreateFeedback: () => navigation.navigate("FeedbackCreate"),
    handleViewFeedback: (feedback) =>
      navigation.navigate("FeedbackView", { feedback }),
    handleEditFeedback: (feedback) =>
      navigation.navigate("FeedbackEdit", { feedback }),

    // ServiceFee handlers
    handleCreateServiceFee: () => navigation.navigate("ServiceFeeCreate"),
    handleViewServiceFee: (serviceFee) =>
      navigation.navigate("ServiceFeeView", { serviceFee }),
    handleEditServiceFee: (serviceFee) =>
      navigation.navigate("ServiceFeeEdit", { serviceFee }),

    // Notification handlers
    handleCreateNotification: () => navigation.navigate("NotificationCreate"),
    handleViewNotification: (notification) =>
      navigation.navigate("NotificationView", { notification }),
    handleEditNotification: (notification) =>
      navigation.navigate("NotificationEdit", { notification }),

    // Invoice handlers
    handleCreateInvoice: () => navigation.navigate("InvoiceCreate"),
    handleViewInvoice: (invoice) =>
      navigation.navigate("InvoiceView", { invoice }),
    handleEditInvoice: (invoice) =>
      navigation.navigate("InvoiceEdit", { invoice }),
  };
};
