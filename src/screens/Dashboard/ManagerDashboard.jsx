import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  ResidentsTab,
  ApartmentsTab,
  ApartmentTypesTab,
  FeedbacksTab,
  ServiceFeesTab,
  NotificationsTab,
  InvoicesTab,
} from "../Dashboard/components";
import { AdminHeader } from "../Dashboard/components/AdminHeader";
import {
  BottomTabs,
  tabs as bottomTabs,
} from "../Dashboard/components/BottomTabs";
import { useManagerNavigationHandlers } from "../Dashboard/hooks/useManagerNavigationHandlers";
import { useDeleteHandlers } from "../Dashboard/hooks/useDeleteHandlers";
import { useDataLoader } from "../Dashboard/hooks/useDataLoader";
import { useManagerTabHandlers } from "../Dashboard/hooks/useManagerTabHandlers";

const TAB_CONFIG = bottomTabs;

export default function ManagerDashboard() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  // Ensure we have valid insets with fallback values
  const safeInsets = {
    top: insets?.top || 0,
    bottom: insets?.bottom || 0,
    left: insets?.left || 0,
    right: insets?.right || 0,
  };

  // State declarations
  const [residents, setResidents] = React.useState([]);
  const [apartments, setApartments] = React.useState([]);
  const [apartmentTypes, setApartmentTypes] = React.useState([]);
  const [feedbacks, setFeedbacks] = React.useState([]);
  const [serviceFees, setServiceFees] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [invoices, setInvoices] = React.useState([]);
  // Custom hooks
  const setters = {
    setResidents,
    setApartments,
    setApartmentTypes,
    setFeedbacks,
    setServiceFees,
    setNotifications,
    setInvoices,
  };
  const { loadAllData } = useDataLoader(setters);
  const navigationHandlers = useManagerNavigationHandlers();
  const deleteHandlers = useDeleteHandlers(setters);
  const tabHandlers = useManagerTabHandlers(navigationHandlers, deleteHandlers);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, [loadAllData]);

  useFocusEffect(
    React.useCallback(() => {
      loadAllData();
    }, [loadAllData])
  );
  const renderContent = () => {
    const tabProps = {
      refreshing,
      onRefresh,
      tabs: TAB_CONFIG,
    };

    switch (activeTab) {
      case 0:
        return (
          <ResidentsTab
            residents={residents}
            handleView={tabHandlers.handleViewResident}
            handleEdit={tabHandlers.handleEditResident}
            handleDeleteResident={tabHandlers.handleDeleteResident}
            // Manager cannot create residents - no handleCreate prop
            {...tabProps}
          />
        );
      case 1:
        return (
          <ApartmentsTab
            apartments={apartments || []}
            handleCreateApartment={tabHandlers.handleCreateApartment}
            handleViewApartment={tabHandlers.handleViewApartment}
            handleEditApartment={tabHandlers.handleEditApartment}
            handleDeleteApartment={tabHandlers.handleDeleteApartment}
            {...tabProps}
          />
        );
      case 2:
        return (
          <ApartmentTypesTab
            apartmentTypes={apartmentTypes || []}
            handleCreateApartmentType={tabHandlers.handleCreateApartmentType}
            handleViewApartmentType={tabHandlers.handleViewApartmentType}
            handleEditApartmentType={tabHandlers.handleEditApartmentType}
            handleDeleteApartmentType={tabHandlers.handleDeleteApartmentType}
            {...tabProps}
          />
        );
      case 3:
        return (
          <FeedbacksTab
            feedbacks={feedbacks}
            handleCreateFeedback={tabHandlers.handleCreateFeedback}
            handleViewFeedback={tabHandlers.handleViewFeedback}
            handleEditFeedback={tabHandlers.handleEditFeedback}
            handleDeleteFeedback={tabHandlers.handleDeleteFeedback}
            {...tabProps}
          />
        );
      case 4:
        return (
          <ServiceFeesTab
            serviceFees={serviceFees}
            handleCreateServiceFee={tabHandlers.handleCreateServiceFee}
            handleViewServiceFee={tabHandlers.handleViewServiceFee}
            handleEditServiceFee={tabHandlers.handleEditServiceFee}
            handleDeleteServiceFee={tabHandlers.handleDeleteServiceFee}
            {...tabProps}
          />
        );
      case 5:
        return (
          <NotificationsTab
            notifications={notifications}
            handleCreateNotification={tabHandlers.handleCreateNotification}
            handleViewNotification={tabHandlers.handleViewNotification}
            handleEditNotification={tabHandlers.handleEditNotification}
            handleDeleteNotification={tabHandlers.handleDeleteNotification}
            {...tabProps}
          />
        );
      case 6:
        return (
          <InvoicesTab
            invoices={invoices}
            handleCreateInvoice={tabHandlers.handleCreateInvoice}
            handleViewInvoice={tabHandlers.handleViewInvoice}
            handleEditInvoice={tabHandlers.handleEditInvoice}
            handleDeleteInvoice={tabHandlers.handleDeleteInvoice}
            {...tabProps}
          />
        );
      default:
        return (
          <ResidentsTab
            residents={residents}
            handleView={tabHandlers.handleViewResident}
            handleEdit={tabHandlers.handleEditResident}
            handleDeleteResident={tabHandlers.handleDeleteResident}
            // Manager cannot create residents - no handleCreate prop
            {...tabProps}
          />
        );
    }
  };
  return (
    <View style={[styles.container, { paddingTop: safeInsets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      <AdminHeader title="Quản lý Manager" subtitle="Bảng điều khiển quản lý" />
      <View style={styles.content}>{renderContent()}</View>{" "}
      <BottomTabs
        tabs={TAB_CONFIG}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        insets={safeInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingBottom: 90, // Leave space for bottom nav
  },
});
