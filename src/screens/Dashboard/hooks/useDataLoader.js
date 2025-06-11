import React from "react";
import { useCallback } from "react";
import { residentService } from "../../../services";
import apartmentService from "../../../services/apartmentService";
// Import các service khác để thực hiện các chức năng:
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
      // Lấy dữ liệu cư dân
      let residentsData = [];
      const residentsResult = await residentService.getResidents();
      if (residentsResult.success && residentsResult.data) {
        residentsData = residentsResult.data;
      }
      
      // Lấy dữ liệu căn hộ
      let apartmentsData = [];
      const apartmentsResult = await apartmentService.getAllApartments();
      if (apartmentsResult.success && apartmentsResult.data) {
        apartmentsData = apartmentsResult.data;
      }
      
      // TODO: Bổ sung gọi API cho các dữ liệu khác
      // - getAllFeedbacks()
      // - getAllServiceFees()
      // - getAllNotifications()
      // - getAllInvoices()
      const [
        feedbacksData,
        serviceFeesData,
        notificationsData,
        invoicesData,
      ] = [[], [], [], []];

      setResidents(residentsData);
      setApartments(apartmentsData);
      setFeedbacks(feedbacksData);
      setServiceFees(serviceFeesData);
      setNotifications(notificationsData);
      setInvoices(invoicesData);
      
      console.log("Data loaded successfully!");
      console.log("Apartments:", apartmentsData.length);
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
