import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  ModernButton,
} from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
// Import invoiceService để thực hiện các chức năng:
// - Lấy danh sách hóa đơn theo resident ID
// - Xem chi tiết hóa đơn
// - Thanh toán hóa đơn
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

export default function ResidentInvoiceListScreen() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchInvoices = async () => {
    if (!user) return setLoading(false);
    setLoading(true);
    try {
      // TODO: Call API getInvoicesByResident(userId) để lấy danh sách hóa đơn
      // Hiện tại trả về mảng rỗng để test giao diện
      setInvoices([]);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

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
    switch (status) {
      case "paid":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "overdue":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "overdue":
        return "Quá hạn";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return "check-circle";
      case "pending":
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
      isOverdue(invoice.dueDate) && invoice.status === "pending"
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
                {invoice.serviceType || "Dịch vụ chung"}
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
                {formatCurrency(invoice.amount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={16} color="#757575" />
              <Text style={styles.dueDate}>
                Đến hạn: {formatDate(invoice.dueDate)}
              </Text>
            </View>

            {invoice.period && (
              <View style={styles.detailRow}>
                <MaterialIcons name="date-range" size={16} color="#757575" />
                <Text style={styles.period}>Kỳ: {invoice.period}</Text>
              </View>
            )}
          </View>

          {status === "pending" || status === "overdue" ? (
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
      subtitle="Danh sách hóa đơn cần thanh toán"
      headerColor="#1976D2"
      loading={loading}
      onRefresh={fetchInvoices}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {invoices.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.container}>
            {invoices.map(renderInvoiceItem)}
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
