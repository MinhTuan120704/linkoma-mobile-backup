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
        handleCreate: navigationHandlers.handleCreateApartment,
        handleView: navigationHandlers.handleViewApartment,
        handleEdit: navigationHandlers.handleEditApartment,
        handleDeleteApartment: deleteHandlers.handleDeleteApartment,
      },
      feedbacks: {
        handleCreate: navigationHandlers.handleCreateFeedback,
        handleView: navigationHandlers.handleViewFeedback,
        handleEdit: navigationHandlers.handleEditFeedback,
        handleDeleteFeedback: deleteHandlers.handleDeleteFeedback,
      },
      serviceFees: {
        handleCreate: navigationHandlers.handleCreateServiceFee,
        handleView: navigationHandlers.handleViewServiceFee,
        handleEdit: navigationHandlers.handleEditServiceFee,
        handleDeleteServiceFee: deleteHandlers.handleDeleteServiceFee,
      },
      notifications: {
        handleCreate: navigationHandlers.handleCreateNotification,
        handleView: navigationHandlers.handleViewNotification,
        handleEdit: navigationHandlers.handleEditNotification,
        handleDeleteNotification: deleteHandlers.handleDeleteNotification,
      },
      invoices: {
        handleCreate: navigationHandlers.handleCreateInvoice,
        handleView: navigationHandlers.handleViewInvoice,
        handleEdit: navigationHandlers.handleEditInvoice,
        handleDeleteInvoice: deleteHandlers.handleDeleteInvoice,
      },
    }),
    [navigationHandlers, deleteHandlers]
  );
};
