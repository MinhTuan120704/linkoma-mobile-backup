import { useNavigation } from "@react-navigation/native";

export const useManagerNavigationHandlers = () => {
  const navigation = useNavigation();

  return {
    // Resident handlers (Manager can only view/edit, not create)
    handleViewResident: (resident) =>
      navigation.navigate("ManagerResidentView", { resident }),
    handleEditResident: (resident) =>
      navigation.navigate("ManagerResidentEdit", { resident }),

    // Apartment handlers
    handleCreateApartment: () => navigation.navigate("ManagerApartmentCreate"),
    handleViewApartment: (apartment) =>
      navigation.navigate("ManagerApartmentView", { apartment }),
    handleEditApartment: (apartment) =>
      navigation.navigate("ManagerApartmentEdit", { apartment }),

    // Feedback handlers
    handleCreateFeedback: () => navigation.navigate("ManagerFeedbackCreate"),
    handleViewFeedback: (feedback) =>
      navigation.navigate("ManagerFeedbackView", { feedback }),
    handleEditFeedback: (feedback) =>
      navigation.navigate("ManagerFeedbackEdit", { feedback }),

    // ServiceFee handlers
    handleCreateServiceFee: () =>
      navigation.navigate("ManagerServiceFeeCreate"),
    handleViewServiceFee: (serviceFee) =>
      navigation.navigate("ManagerServiceFeeView", { serviceFee }),
    handleEditServiceFee: (serviceFee) =>
      navigation.navigate("ManagerServiceFeeEdit", { serviceFee }),

    // Notification handlers
    handleCreateNotification: () =>
      navigation.navigate("ManagerNotificationCreate"),
    handleViewNotification: (notification) =>
      navigation.navigate("ManagerNotificationView", { notification }),
    handleEditNotification: (notification) =>
      navigation.navigate("ManagerNotificationEdit", { notification }),

    // Invoice handlers
    handleCreateInvoice: () => navigation.navigate("ManagerInvoiceCreate"),
    handleViewInvoice: (invoice) =>
      navigation.navigate("ManagerInvoiceView", { invoice }),
    handleEditInvoice: (invoice) =>
      navigation.navigate("ManagerInvoiceEdit", { invoice }),

    // ApartmentType handlers
    handleCreateApartmentType: () =>
      navigation.navigate("ManagerApartmentTypeCreate"),
    handleViewApartmentType: (apartmentType) =>
      navigation.navigate("ManagerApartmentTypeView", { apartmentType }),
    handleEditApartmentType: (apartmentType) =>
      navigation.navigate("ManagerApartmentTypeEdit", { apartmentType }),
  };
};
