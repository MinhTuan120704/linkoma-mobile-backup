import { useMemo } from "react";

export const useTabHandlers = (navigationHandlers, deleteHandlers) => {
  return useMemo(
    () => ({
      residents: {
        handleCreate: navigationHandlers.handleCreate,
        handleView: navigationHandlers.handleView,
        handleEdit: navigationHandlers.handleEdit,
        handleDeleteResident: deleteHandlers.handleDeleteResident,
      },
      apartments: {
        handleCreateApartment: navigationHandlers.handleCreateApartment,
        handleViewApartment: navigationHandlers.handleViewApartment,
        handleEditApartment: navigationHandlers.handleEditApartment,
        handleDeleteApartment: deleteHandlers.handleDeleteApartment,
      },
      feedbacks: {
        handleCreateFeedback: navigationHandlers.handleCreateFeedback,
        handleViewFeedback: navigationHandlers.handleViewFeedback,
        handleEditFeedback: navigationHandlers.handleEditFeedback,
        handleDeleteFeedback: deleteHandlers.handleDeleteFeedback,
      },
      serviceFees: {
        handleCreateServiceFee: navigationHandlers.handleCreateServiceFee,
        handleViewServiceFee: navigationHandlers.handleViewServiceFee,
        handleEditServiceFee: navigationHandlers.handleEditServiceFee,
        handleDeleteServiceFee: deleteHandlers.handleDeleteServiceFee,
      },
      notifications: {
        handleCreateNotification: navigationHandlers.handleCreateNotification,
        handleViewNotification: navigationHandlers.handleViewNotification,
        handleEditNotification: navigationHandlers.handleEditNotification,
        handleDeleteNotification: deleteHandlers.handleDeleteNotification,
      },
      invoices: {
        handleCreateInvoice: navigationHandlers.handleCreateInvoice,
        handleViewInvoice: navigationHandlers.handleViewInvoice,
        handleEditInvoice: navigationHandlers.handleEditInvoice,
        handleDeleteInvoice: deleteHandlers.handleDeleteInvoice,
      },
    }),
    [navigationHandlers, deleteHandlers]
  );
};
