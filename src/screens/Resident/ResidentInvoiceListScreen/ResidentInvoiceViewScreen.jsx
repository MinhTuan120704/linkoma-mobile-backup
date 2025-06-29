import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  ModernButton,
} from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import invoiceService from "../../../services/invoiceService";
import invoiceDetailService from "../../../services/invoiceDetailService";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ResidentInvoiceViewScreen() {
  const [invoice, setInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { invoiceId } = route.params;

  useEffect(() => {
    fetchInvoiceData();
  }, [invoiceId]);

  const fetchInvoiceData = async () => {
    setLoading(true);
    try {
      // Fetch invoice information
      const invoiceResult = await invoiceService.getInvoiceById(invoiceId);
      if (invoiceResult.success) {
        setInvoice(invoiceResult.data);
      } else {
        Alert.alert("Lỗi", invoiceResult.message, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }

      // Fetch invoice details
      const detailsResult =
        await invoiceDetailService.getInvoiceDetailsByInvoiceId(invoiceId);
      if (detailsResult.success) {
        setInvoiceDetails(detailsResult.data.data || []);
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Có lỗi xảy ra khi tải thông tin hóa đơn: " + error.message,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    try {
      const result = await invoiceService.payInvoice(invoiceId);
      if (result.success) {
        Alert.alert("Thành công", "Thanh toán hóa đơn thành công!", [
          {
            text: "OK",
            onPress: () => {
              fetchInvoiceData(); // Refresh data
            },
          },
        ]);
      } else {
        Alert.alert("Lỗi", result.message, [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thanh toán: " + error.message, [
        { text: "OK" },
      ]);
    }
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

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (!invoice) {
    return (
      <ModernScreenWrapper
        title="Chi tiết hóa đơn"
        loading={loading}
        showBackButton={true}
      >
        <View />
      </ModernScreenWrapper>
    );
  }

  const status =
    isOverdue(invoice.dueDate) && invoice.status?.toLowerCase() === "unpaid"
      ? "overdue"
      : invoice.status;

  const totalAmount =
    invoice.totalAmount ||
    parseFloat(invoice.rentFee || 0) + parseFloat(invoice.serviceFee || 0);

  return (
    <ModernScreenWrapper
      title="Chi tiết hóa đơn"
      subtitle={`Hóa đơn #${invoice.invoiceId}`}
      headerColor="#1976D2"
      loading={loading}
      showBackButton={true}
      onRefresh={fetchInvoiceData}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Invoice Status */}
        <ModernCard style={styles.statusCard}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(status) },
              ]}
            >
              <MaterialIcons
                name={status === "paid" ? "check-circle" : "schedule"}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.statusText}>{getStatusText(status)}</Text>
            </View>
          </View>
        </ModernCard>

        {/* Invoice Information */}
        <ModernCard>
          <Text style={styles.sectionTitle}>Thông tin hóa đơn</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="receipt-long" size={20} color="#1976D2" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Mã hóa đơn</Text>
              <Text style={styles.infoValue}>#{invoice.invoiceId}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="home" size={20} color="#1976D2" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Căn hộ</Text>
              <Text style={styles.infoValue}>
                {invoice.apartment?.apartmentType?.typeName ||
                  `Tầng ${invoice.apartment?.floor}`}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={20} color="#1976D2" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Ngày đến hạn</Text>
              <Text
                style={[
                  styles.infoValue,
                  isOverdue(invoice.dueDate) && { color: "#F44336" },
                ]}
              >
                {formatDate(invoice.dueDate)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="date-range" size={20} color="#1976D2" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Ngày tạo</Text>
              <Text style={styles.infoValue}>
                {formatDate(invoice.createdAt)}
              </Text>
            </View>
          </View>
        </ModernCard>

        {/* Amount Breakdown */}
        <ModernCard>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

          {invoice.rentFee && (
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Tiền thuê nhà</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(invoice.rentFee)}
              </Text>
            </View>
          )}

          {invoice.serviceFee && (
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Phí dịch vụ</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(invoice.serviceFee)}
              </Text>
            </View>
          )}

          <View style={styles.separator} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
          </View>
        </ModernCard>

        {/* Service Details */}
        {invoiceDetails.length > 0 && (
          <ModernCard>
            <Text style={styles.sectionTitle}>Chi tiết dịch vụ</Text>

            {invoiceDetails.map((detail, index) => (
              <View
                key={detail.invoiceDetailId || index}
                style={styles.serviceItem}
              >
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>
                    {detail.serviceType?.serviceName || "Dịch vụ"}
                  </Text>
                  <Text style={styles.serviceAmount}>
                    {formatCurrency(detail.totalAmount)}
                  </Text>
                </View>

                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceDetail}>
                    Sử dụng: {detail.usage}
                    {detail.serviceType?.unit || "đơn vị"}
                  </Text>
                  <Text style={styles.serviceDetail}>
                    Đơn giá: {formatCurrency(detail.serviceType?.unitPrice)}
                  </Text>
                </View>
              </View>
            ))}
          </ModernCard>
        )}

        {/* Payment Button */}
        {(status?.toLowerCase() === "unpaid" || status === "overdue") && (
          <View style={styles.paymentSection}>
            <ModernButton
              title="Thanh toán ngay"
              onPress={handlePay}
              variant="primary"
              icon="payment"
              size="large"
            />
          </View>
        )}
      </ScrollView>
    </ModernScreenWrapper>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    marginBottom: 12,
  },
  statusContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 16,
    color: "#212121",
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1976D2",
  },
  serviceItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  serviceAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976D2",
  },
  serviceDetails: {
    gap: 4,
  },
  serviceDetail: {
    fontSize: 14,
    color: "#757575",
  },
  paymentSection: {
    padding: 16,
  },
});
