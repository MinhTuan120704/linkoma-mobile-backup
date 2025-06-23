import React from "react";
import { useCallback } from "react";
import { Alert } from "react-native";
import userService from "../../../services/userService";
import apartmentService from "../../../services/apartmentService";
import feedbackService from "../../../services/feedbackService";
import serviceTypeService from "../../../services/serviceTypeService";
import announcementService from "../../../services/announcementService";
import invoiceService from "../../../services/invoiceService";

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
      // Load all data in parallel for better performance
      const [
        residentsResult,
        apartmentsResult,
        feedbacksResult,
        serviceFeesResult,
        notificationsResult,
        invoicesResult,
      ] = await Promise.allSettled([
        userService.getAllUsers(),
        apartmentService.getAllApartments(),
        feedbackService.getAllFeedbacks(),
        serviceTypeService.getAllServiceTypes(),
        announcementService.getAllAnnouncements(),
        invoiceService.getAllInvoices(),
      ]);      // Process residents data
      if (
        residentsResult.status === "fulfilled" &&
        residentsResult.value.success
      ) {
        // Note: getAllUsers API returns data in 'data' field, not 'results'
        setResidents(
          residentsResult.value.data?.data || residentsResult.value.data || []
        );
      } else {
        console.log(
          "Error loading residents:",
          residentsResult.reason || residentsResult.value?.message
        );
        setResidents([]);
      }

      // Process apartments data
      if (
        apartmentsResult.status === "fulfilled" &&
        apartmentsResult.value.success
      ) {
        console.log("Apartments data:", apartmentsResult.value.data);
        
        setApartments(
          apartmentsResult.value.data.apartments ||
            apartmentsResult.value.data ||
            []
        );
      } else {
        console.log(
          "Error loading apartments:",
          apartmentsResult.reason || apartmentsResult.value?.message
        );
        setApartments([]);
      }

      // Process feedbacks data
      if (
        feedbacksResult.status === "fulfilled" &&
        feedbacksResult.value.success
      ) {
        setFeedbacks(
          feedbacksResult.value.data.results || feedbacksResult.value.data || []
        );
      } else {
        console.log(
          "Error loading feedbacks:",
          feedbacksResult.reason || feedbacksResult.value?.message
        );
        setFeedbacks([]);
      }

      // Process service fees data
      if (
        serviceFeesResult.status === "fulfilled" &&
        serviceFeesResult.value.success
      ) {
        setServiceFees(
          serviceFeesResult.value.data.results ||
            serviceFeesResult.value.data ||
            []
        );
      } else {
        console.log(
          "Error loading service fees:",
          serviceFeesResult.reason || serviceFeesResult.value?.message
        );
        setServiceFees([]);
      }

      // Process notifications data
      if (
        notificationsResult.status === "fulfilled" &&
        notificationsResult.value.success
      ) {
        setNotifications(
          notificationsResult.value.data.results ||
            notificationsResult.value.data ||
            []
        );
      } else {
        console.log(
          "Error loading notifications:",
          notificationsResult.reason || notificationsResult.value?.message
        );
        setNotifications([]);
      }      // Process invoices data
      if (
        invoicesResult.status === "fulfilled" &&
        invoicesResult.value.success
      ) {
        setInvoices(
          invoicesResult.value.data.results || invoicesResult.value.data || []
        );
      } else {
        console.log(
          "Error loading invoices:",
          invoicesResult.reason || invoicesResult.value?.message
        );
        // Log the full error response for debugging
        if (invoicesResult.value?.response?.data) {
          console.log("Invoice error details:", invoicesResult.value.response.data);
        }
        setInvoices([]);
      }
    } catch (error) {
      console.log("Error loading data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu. Vui lòng thử lại.");
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
