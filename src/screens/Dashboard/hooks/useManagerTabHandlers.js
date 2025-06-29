import { useMemo } from "react";

export const useManagerTabHandlers = (navigationHandlers, deleteHandlers) => {
  return useMemo(
    () => ({
      // Residents - Manager can view and edit but not create
      handleViewResident: navigationHandlers.handleViewResident,
      handleEditResident: navigationHandlers.handleEditResident,
      handleDeleteResident: deleteHandlers.handleDeleteResident,

      // Apartments
      handleCreateApartment: navigationHandlers.handleCreateApartment,
      handleViewApartment: navigationHandlers.handleViewApartment,
      handleEditApartment: navigationHandlers.handleEditApartment,
      handleDeleteApartment: deleteHandlers.handleDeleteApartment,

      // Apartment Types
      handleCreateApartmentType: navigationHandlers.handleCreateApartmentType,
      handleViewApartmentType: navigationHandlers.handleViewApartmentType,
      handleEditApartmentType: navigationHandlers.handleEditApartmentType,
      handleDeleteApartmentType: deleteHandlers.handleDeleteApartmentType,

      // Feedbacks
      handleCreateFeedback: navigationHandlers.handleCreateFeedback,
      handleViewFeedback: navigationHandlers.handleViewFeedback,
      handleEditFeedback: navigationHandlers.handleEditFeedback,
      handleDeleteFeedback: deleteHandlers.handleDeleteFeedback,

      // Service Fees
      handleCreateServiceFee: navigationHandlers.handleCreateServiceFee,
      handleViewServiceFee: navigationHandlers.handleViewServiceFee,
      handleEditServiceFee: navigationHandlers.handleEditServiceFee,
      handleDeleteServiceFee: deleteHandlers.handleDeleteServiceFee,

      // Notifications
      handleCreateNotification: navigationHandlers.handleCreateNotification,
      handleViewNotification: navigationHandlers.handleViewNotification,
      handleEditNotification: navigationHandlers.handleEditNotification,
      handleDeleteNotification: deleteHandlers.handleDeleteNotification,

      // Invoices
      handleCreateInvoice: navigationHandlers.handleCreateInvoice,
      handleViewInvoice: navigationHandlers.handleViewInvoice,
      handleEditInvoice: navigationHandlers.handleEditInvoice,
      handleDeleteInvoice: deleteHandlers.handleDeleteInvoice,
    }),
    [navigationHandlers, deleteHandlers]
  );
};
