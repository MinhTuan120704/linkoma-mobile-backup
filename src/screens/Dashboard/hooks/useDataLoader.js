import React from "react";
import { useCallback } from "react";
// Import các service để thực hiện các chức năng:
// - Lấy danh sách tất cả cư dân (getAllResidents)
// - Lấy danh sách tất cả căn hộ (getAllApartments)
// - Lấy danh sách tất cả phản hồi (getAllFeedbacks)
// - Lấy danh sách tất cả phí dịch vụ (getAllServiceFees)
// - Lấy danh sách tất cả thông báo (getAllNotifications)
// - Lấy danh sách tất cả hóa đơn (getAllInvoices)

export const useDataLoader = (setters) => {
  const {
    setResidents,
    setApartments,
    setFeedbacks,
    setServiceFees,
    setNotifications,
    setInvoices,
  } = setters;

  const loadAllData = useCallback(async () => {
    try {
      // TODO: Call APIs để lấy dữ liệu:
      // - getAllResidents()
      // - getAllApartments()
      // - getAllFeedbacks()
      // - getAllServiceFees()
      // - getAllNotifications()
      // - getAllInvoices()
      const [
        residentsData,
        apartmentsData,
        feedbacksData,
        serviceFeesData,
        notificationsData,
        invoicesData,
      ] = [[], [], [], [], [], []];

      setResidents(residentsData);
      setApartments(apartmentsData);
      setFeedbacks(feedbacksData);
      setServiceFees(serviceFeesData);
      setNotifications(notificationsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, [
    setResidents,
    setApartments,
    setFeedbacks,
    setServiceFees,
    setNotifications,
    setInvoices,
  ]);

  return { loadAllData };
};
