import { useMemo } from "react";

export const useTabHandlers = (navigationHandlers, deleteHandlers) => {
  return useMemo(
    () => ({
      residents: {
        handleCreate: navigationHandlers.handleCreate,
        handleView: navigationHandlers.handleView,
        handleEdit: navigationHandlers.handleEdit,
        handleDelete: deleteHandlers.handleDeleteResident,
      },
      apartments: {
        handleCreate: navigationHandlers.handleCreateApartment,
        handleView: navigationHandlers.handleViewApartment,
        handleEdit: navigationHandlers.handleEditApartment,
        handleDelete: deleteHandlers.handleDeleteApartment,
      },
      feedbacks: {
        handleCreate: navigationHandlers.handleCreateFeedback,
        handleView: navigationHandlers.handleViewFeedback,
        handleEdit: navigationHandlers.handleEditFeedback,
        handleDelete: deleteHandlers.handleDeleteFeedback,
      },
      serviceFees: {
        handleCreate: navigationHandlers.handleCreateServiceFee,
        handleView: navigationHandlers.handleViewServiceFee,
        handleEdit: navigationHandlers.handleEditServiceFee,
        handleDelete: deleteHandlers.handleDeleteServiceFee,
      },
      notifications: {
        handleCreate: navigationHandlers.handleCreateNotification,
        handleView: navigationHandlers.handleViewNotification,
        handleEdit: navigationHandlers.handleEditNotification,
        handleDelete: deleteHandlers.handleDeleteNotification,
      },
      invoices: {
        handleCreate: navigationHandlers.handleCreateInvoice,
        handleView: navigationHandlers.handleViewInvoice,
        handleEdit: navigationHandlers.handleEditInvoice,
        handleDelete: deleteHandlers.handleDeleteInvoice,
      },
    }),
    [navigationHandlers, deleteHandlers]
  );
};
