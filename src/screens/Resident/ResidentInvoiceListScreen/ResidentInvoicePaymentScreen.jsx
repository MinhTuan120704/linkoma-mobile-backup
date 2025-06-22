import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import invoiceService from "../../../services/invoiceService";

export default function ResidentInvoicePaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { invoiceId, invoice } = route.params;
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    if (!invoiceId && !invoice?.id) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin hóa đơn");
      return;
    }

    Alert.alert(
      "Xác nhận thanh toán",
      `Bạn có chắc chắn muốn thanh toán hóa đơn này với số tiền ${formatCurrency(
        invoice?.totalAmount || invoice?.amount
      )}?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            setLoading(true);
            try {
              const result = await invoiceService.payInvoice(
                invoiceId || invoice.id
              );

              if (result.success) {
                Alert.alert("Thành công", "Thanh toán hóa đơn thành công!", [
                  {
                    text: "OK",
                    onPress: () => {
                      // Go back to list screen and refresh
                      navigation.navigate("ResidentInvoiceListScreen");
                    },
                  },
                ]);
              } else {
                Alert.alert(
                  "Lỗi",
                  result.message || "Thanh toán thất bại. Vui lòng thử lại."
                );
              }
            } catch (error) {
              console.error("Payment error:", error);
              Alert.alert("Lỗi", "Thanh toán thất bại. Vui lòng thử lại.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (!invoice) {
    return (
      <ModernScreenWrapper
        title="Thanh toán hóa đơn"
        subtitle="Thông tin không tồn tại"
        headerColor="#1976D2"
      >
        <ModernCard>
          <InfoRow
            label="Thông báo"
            value="Hóa đơn không tồn tại hoặc đã bị xóa"
            icon="error"
            type="warning"
          />
        </ModernCard>
      </ModernScreenWrapper>
    );
  }

  return (
    <ModernScreenWrapper
      title="Xác nhận thanh toán"
      subtitle="Kiểm tra thông tin thanh toán"
      headerColor="#1976D2"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin hóa đơn">
          <InfoRow
            label="Hóa đơn"
            value={invoice?.invoiceCode || `Hóa đơn #${invoice?.id}`}
            icon="receipt"
            type="highlight"
          />

          <InfoRow
            label="Mô tả"
            value={invoice?.description || "Không có mô tả"}
            icon="description"
          />

          <InfoRow
            label="Số tiền"
            value={formatCurrency(invoice?.totalAmount || invoice?.amount)}
            icon="attach-money"
            type="highlight"
          />

          <InfoRow
            label="Hạn thanh toán"
            value={formatDate(invoice?.dueDate)}
            icon="schedule"
            type={isOverdue(invoice?.dueDate) ? "danger" : "default"}
          />

          {isOverdue(invoice?.dueDate) && (
            <InfoRow
              label="Trạng thái"
              value="Đã quá hạn thanh toán"
              icon="warning"
              type="danger"
            />
          )}
        </ModernCard>
        <ModernCard title="Chi tiết dịch vụ">
          <InfoRow
            label="Loại dịch vụ"
            value={
              invoice?.serviceType?.name ||
              invoice?.serviceTypeName ||
              "Dịch vụ chung"
            }
            icon="build"
          />

          {invoice?.serviceType?.description && (
            <InfoRow
              label="Mô tả dịch vụ"
              value={invoice.serviceType.description}
              icon="info"
            />
          )}

          <InfoRow
            label="Kỳ thanh toán"
            value={
              invoice?.period || invoice?.servicePeriod || "Không xác định"
            }
            icon="date-range"
          />
        </ModernCard>
        <ModernCard title="Phương thức thanh toán">
          <InfoRow
            label="Phương thức"
            value="Thanh toán trực tuyến"
            icon="payment"
          />

          <InfoRow
            label="Trạng thái bảo mật"
            value="Kết nối an toàn SSL"
            icon="security"
            type="highlight"
          />
        </ModernCard>
        {invoice?.notes && (
          <ModernCard title="Ghi chú">
            <InfoRow label="Ghi chú" value={invoice.notes} icon="note" />
          </ModernCard>
        )}
        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title={`Xác nhận thanh toán ${formatCurrency(
              invoice?.totalAmount || invoice?.amount
            )}`}
            onPress={handlePay}
            loading={loading}
            icon="payment"
            variant="primary"
          />

          <ModernButton
            title="Hủy thanh toán"
            onPress={() => navigation.goBack()}
            variant="outline"
            icon="cancel"
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
