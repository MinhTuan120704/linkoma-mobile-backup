import React from "react";
import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  ResidentsTab,
  ApartmentsTab,
  FeedbacksTab,
  ServiceFeesTab,
  NotificationsTab,
  InvoicesTab,
} from "./components";
import { AdminHeader } from "./components/AdminHeader";
import { BottomTabs, tabs } from "./components/BottomTabs";
import { useNavigationHandlers } from "./hooks/useNavigationHandlers";
import { useDeleteHandlers } from "./hooks/useDeleteHandlers";
import { useDataLoader } from "./hooks/useDataLoader";
import { useTabHandlers } from "./hooks/useTabHandlers";

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  // State declarations
  const [residents, setResidents] = React.useState([]);
  const [apartments, setApartments] = React.useState([]);
  const [feedbacks, setFeedbacks] = React.useState([]);
  const [serviceFees, setServiceFees] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [invoices, setInvoices] = React.useState([]);

  // Custom hooks
  const setters = {
    setResidents,
    setApartments,
    setFeedbacks,
    setServiceFees,
    setNotifications,
    setInvoices,
  };
  const { loadAllData } = useDataLoader(setters);
  const navigationHandlers = useNavigationHandlers();
  const deleteHandlers = useDeleteHandlers(setters);
  const tabHandlers = useTabHandlers(navigationHandlers, deleteHandlers);

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

  const renderTabContent = () => {
    const tabProps = {
      refreshing,
      onRefresh,
      tabs,
    };
    switch (activeTab) {
      case 0:
        return (
          <ResidentsTab
            residents={residents}
            {...tabHandlers.residents}
            {...tabProps}
          />
        );
      case 1:
        return (
          <ApartmentsTab
            apartments={apartments}
            {...tabHandlers.apartments}
            {...tabProps}
          />
        );
      case 2:
        return (
          <FeedbacksTab
            feedbacks={feedbacks}
            {...tabHandlers.feedbacks}
            {...tabProps}
          />
        );
      case 3:
        return (
          <ServiceFeesTab
            serviceFees={serviceFees}
            {...tabHandlers.serviceFees}
            {...tabProps}
          />
        );
      case 4:
        return (
          <NotificationsTab
            notifications={notifications}
            {...tabHandlers.notifications}
            {...tabProps}
          />
        );
      case 5:
        return (
          <InvoicesTab
            invoices={invoices}
            {...tabHandlers.invoices}
            {...tabProps}
          />
        );
      default:
        return (
          <ResidentsTab
            residents={residents}
            {...tabHandlers.residents}
            {...tabProps}
          />
        );
    }
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />

      <AdminHeader />

      <View style={styles.content}>{renderTabContent()}</View>

      <BottomTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        insets={insets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    paddingBottom: 90, // Leave space for bottom nav
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  }, // Card Styles
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 20,
  },
  actionContainer: {
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 12,
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  viewButton: {
    backgroundColor: "#3498DB",
  },
  editButton: {
    backgroundColor: "#E67E22",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
  },
  // Empty state styles
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 200,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  // Statistics card styles
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsTitle: {
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  statsCount: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
