import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  ModernButton,
  ModernPicker,
} from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import invoiceService from "../../../services/invoiceService";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export default function ResidentInvoiceListScreen() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [params, setParams] = useState({
    apartmentId: null,
    status: "",
    sortBy: "dueDate",
    limit: 10,
    page: 1,
  });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const navigation = useNavigation();
  const { user } = useAuth();

  // Status options for filtering
  const statusOptions = [
    { label: "Tất cả", value: "" },
    { label: "Chờ thanh toán", value: "Unpaid" },
    { label: "Đã thanh toán", value: "Paid" },
  ];

  // Sort options
  const sortOptions = [
    { label: "Ngày đến hạn", value: "dueDate" },
    { label: "Ngày tạo", value: "createdAt" },
    { label: "Số tiền", value: "amount" },
  ];
  const fetchInvoices = async (isRefresh = false) => {
    if (!user?.apartmentId) return setLoading(false);

    if (isRefresh) {
      setRefreshing(true);
      setParams((prev) => ({ ...prev, page: 1 }));
    } else {
      setLoading(true);
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("apartmentId", user.apartmentId);
      if (params.status) queryParams.append("status", params.status);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      queryParams.append("limit", params.limit.toString());
      queryParams.append("page", isRefresh ? "1" : params.page.toString());

      const result = await invoiceService.getAllInvoices(queryParams);

      if (result.success && result.data) {
        const newInvoices = isRefresh
          ? result.data.data || []
          : [...invoices, ...(result.data.data || [])];
        setInvoices(newInvoices);
        setHasNextPage(result.data.hasNextPage || false);
        setTotalCount(result.data.totalCount || 0);
      } else {
         Alert.alert(
        "Lỗi",
        "Có lỗi đã xảy ra: " + result.message || "Không thể tải hóa đơn",
        [{ text: "OK" }]
      );
        if (isRefresh) setInvoices([]);
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Có lỗi đã xảy ra: " + error.message || "Không thể tải hóa đơn",
        [{ text: "OK" }]
      );
      if (isRefresh) setInvoices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Effect to update apartmentId when user changes
  useEffect(() => {
    if (user?.apartmentId) {
      setParams((prev) => ({
        ...prev,
        apartmentId: user.apartmentId,
        page: 1,
      }));
    }
  }, [user]);

  // Effect to fetch invoices when params change
  useEffect(() => {
    if (params.apartmentId) {
      fetchInvoices(true);
    }
  }, [params.apartmentId, params.status, params.sortBy]);

  const loadMoreInvoices = () => {
    if (hasNextPage && !loading) {
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
      fetchInvoices();
    }
  };

  const handleFilterChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleView = (invoice) => {
    navigation.navigate("ResidentInvoiceViewScreen", { invoiceId: invoice.id });
  };

  const handlePay = (invoice) => {
    navigation.navigate("ResidentInvoicePaymentScreen", {
      invoiceId: invoice.id,
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "#4CAF50";
      case "unpaid":
        return "#FF9800";
      case "overdue":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "Đã thanh toán";
      case "unpaid":
        return "Chờ thanh toán";
      case "overdue":
        return "Quá hạn";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "check-circle";
      case "unpaid":
        return "schedule";
      case "overdue":
        return "error";
      default:
        return "help";
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const renderEmptyState = () => (
    <ModernCard>
      <View style={styles.emptyContainer}>
        <MaterialIcons name="receipt-long" size={64} color="#E0E0E0" />
        <Text style={styles.emptyTitle}>Chưa có hóa đơn</Text>
        <Text style={styles.emptyText}>
          Hiện tại bạn chưa có hóa đơn nào cần thanh toán
        </Text>
      </View>
    </ModernCard>
  );
  const renderInvoiceItem = (invoice) => {
    const status =
      isOverdue(invoice.dueDate) && invoice.status?.toLowerCase() === "unpaid"
        ? "overdue"
        : invoice.status;

    return (
      <ModernCard key={invoice.id} style={styles.invoiceCard}>
        <TouchableOpacity
          style={styles.invoiceItem}
          onPress={() => handleView(invoice)}
        >
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceCode}>
                {invoice.invoiceCode || `Hóa đơn #${invoice.id}`}
              </Text>
              <Text style={styles.serviceType}>
                {invoice.serviceType?.name ||
                  invoice.serviceTypeName ||
                  "Dịch vụ chung"}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(status) },
              ]}
            >
              <MaterialIcons
                name={getStatusIcon(status)}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.statusText}>{getStatusText(status)}</Text>
            </View>
          </View>

          <View style={styles.invoiceDetails}>
            <View style={styles.detailRow}>
              <MaterialIcons name="attach-money" size={16} color="#1976D2" />
              <Text style={styles.amount}>
                {formatCurrency(invoice.totalAmount || invoice.amount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={16} color="#757575" />
              <Text style={styles.dueDate}>
                Đến hạn: {formatDate(invoice.dueDate)}
              </Text>
            </View>

            {(invoice.period || invoice.servicePeriod) && (
              <View style={styles.detailRow}>
                <MaterialIcons name="date-range" size={16} color="#757575" />
                <Text style={styles.period}>
                  Kỳ: {invoice.period || invoice.servicePeriod}
                </Text>
              </View>
            )}
          </View>

          {status?.toLowerCase() === "unpaid" || status === "overdue" ? (
            <View style={styles.actionButtons}>
              <ModernButton
                title="Thanh toán"
                onPress={() => handlePay(invoice)}
                variant="primary"
                size="small"
                icon="payment"
                style={styles.payButton}
              />
            </View>
          ) : null}
        </TouchableOpacity>
      </ModernCard>
    );
  };
  return (
    <ModernScreenWrapper
      title="Hóa đơn của tôi"
      subtitle={`${totalCount} hóa đơn`}
      headerColor="#1976D2"
      loading={loading}
      onRefresh={() => fetchInvoices(true)}
      showBackButton={false}
    >
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <ModernPicker
            label="Trạng thái"
            value={params.status}
            onValueChange={(value) => handleFilterChange("status", value)}
            items={statusOptions}
            style={styles.filterPicker}
          />
          <ModernPicker
            label="Sắp xếp"
            value={params.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
            items={sortOptions}
            style={styles.filterPicker}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchInvoices(true)}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;
          if (isCloseToBottom && hasNextPage && !loading) {
            loadMoreInvoices();
          }
        }}
        scrollEventThrottle={400}
      >
        {invoices.length === 0 && !loading ? (
          renderEmptyState()
        ) : (
          <View style={styles.container}>
            {invoices.map(renderInvoiceItem)}
            {loading && invoices.length > 0 && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang tải thêm...</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </ModernScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterPicker: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#757575",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#424242",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    lineHeight: 20,
  },
  invoiceCard: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  invoiceItem: {
    padding: 0,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: "#757575",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  invoiceDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976D2",
  },
  dueDate: {
    fontSize: 14,
    color: "#757575",
  },
  period: {
    fontSize: 14,
    color: "#757575",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  payButton: {
    minWidth: 120,
  },
});
