import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
// Import invoiceService để thực hiện chức năng:
// - Thanh toán hóa đơn (payInvoice)

export default function ResidentInvoicePaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { invoice } = route.params;
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // TODO: Call API payInvoice(invoiceId) để thực hiện thanh toán hóa đơn
      Alert.alert("Thành công", "Thanh toán thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.error("Payment error:", e);
      Alert.alert("Lỗi", "Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
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
            value={invoice.title || `Hóa đơn #${invoice.id}`}
            icon="receipt"
            type="highlight"
          />

          <InfoRow
            label="Mô tả"
            value={invoice.description || "Không có mô tả"}
            icon="description"
          />

          <InfoRow
            label="Số tiền"
            value={formatCurrency(invoice.amount)}
            icon="attach-money"
            type="highlight"
          />

          <InfoRow
            label="Hạn thanh toán"
            value={formatDate(invoice.dueDate)}
            icon="schedule"
            type={isOverdue(invoice.dueDate) ? "danger" : "default"}
          />

          {isOverdue(invoice.dueDate) && (
            <InfoRow
              label="Trạng thái"
              value="Đã quá hạn thanh toán"
              icon="warning"
              type="danger"
            />
          )}
        </ModernCard>

        {invoice.serviceFee && (
          <ModernCard title="Chi tiết dịch vụ">
            <InfoRow
              label="Loại dịch vụ"
              value={invoice.serviceFee.name}
              icon="build"
            />

            <InfoRow
              label="Đơn giá"
              value={formatCurrency(invoice.serviceFee.amount)}
              icon="money"
            />

            {invoice.quantity && (
              <InfoRow
                label="Số lượng/Số lần sử dụng"
                value={`${invoice.quantity} ${invoice.serviceFee.unit || ""}`}
                icon="format-list-numbered"
              />
            )}
          </ModernCard>
        )}

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

        {invoice.notes && (
          <ModernCard title="Ghi chú">
            <InfoRow label="Ghi chú" value={invoice.notes} icon="note" />
          </ModernCard>
        )}

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title={`Xác nhận thanh toán ${formatCurrency(invoice.amount)}`}
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
