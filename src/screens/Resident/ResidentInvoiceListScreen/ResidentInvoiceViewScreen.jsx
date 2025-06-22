import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import invoiceService from "../../../services/invoiceService";

export default function ResidentInvoiceViewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { invoiceId, invoice: passedInvoice } = route.params;
  const [invoice, setInvoice] = useState(passedInvoice || null);
  const [loading, setLoading] = useState(!passedInvoice);
  const fetchInvoice = async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const result = await invoiceService.getInvoiceById(invoiceId);
      if (result.success && result.data) {
        setInvoice(result.data);
      } else {
        console.log("Failed to fetch invoice:", result.message);
        Alert.alert("Lỗi", result.message || "Không thể tải thông tin hóa đơn");
      }
    } catch (error) {
      console.log("Error fetching invoice:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!invoice) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const handlePay = () => {
    navigation.navigate("ResidentInvoicePaymentScreen", { invoiceId, invoice });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "highlight";
      case "unpaid":
        return "warning";
      case "overdue":
        return "danger";
      default:
        return "default";
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
  const canPay = (status, dueDate) => {
    return status?.toLowerCase() === "unpaid";
  };

  if (!invoice && !loading) {
    return (
      <ModernScreenWrapper
        title="Chi tiết hóa đơn"
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
      title="Chi tiết hóa đơn"
      subtitle="Thông tin chi tiết hóa đơn"
      headerColor="#1976D2"
      loading={loading}
      onRefresh={fetchInvoice}
    >
      {invoice && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ModernCard title="Thông tin hóa đơn">
            <InfoRow
              label="Mã hóa đơn"
              value={invoice.invoiceCode || `Hóa đơn #${invoice.id}`}
              icon="receipt"
              type="highlight"
              copyable
            />
            <InfoRow
              label="Căn hộ"
              value={
                invoice.apartment?.apartmentCode ||
                invoice.apartmentName ||
                `Căn hộ #${invoice.apartmentId}`
              }
              icon="home"
            />
            <InfoRow
              label="Trạng thái"
              value={getStatusText(invoice.status)}
              icon="info"
              type={getStatusColor(invoice.status)}
            />
          </ModernCard>
          <ModernCard title="Thông tin dịch vụ">
            <InfoRow
              label="Loại dịch vụ"
              value={
                invoice.serviceType?.name ||
                invoice.serviceTypeName ||
                "Dịch vụ chung"
              }
              icon="build"
            />

            <InfoRow
              label="Kỳ thanh toán"
              value={
                invoice.period || invoice.servicePeriod || "Không xác định"
              }
              icon="date-range"
            />

            {invoice.description && (
              <InfoRow
                label="Mô tả"
                value={invoice.description}
                icon="description"
              />
            )}
          </ModernCard>
          <ModernCard title="Thông tin thanh toán">
            <InfoRow
              label="Số tiền"
              value={formatCurrency(invoice.totalAmount || invoice.amount)}
              icon="attach-money"
              type="highlight"
            />

            <InfoRow
              label="Ngày phát hành"
              value={formatDate(invoice.issueDate || invoice.createdAt)}
              icon="today"
            />

            <InfoRow
              label="Ngày đến hạn"
              value={formatDate(invoice.dueDate)}
              icon="schedule"
              type={
                isOverdue(invoice.dueDate) &&
                invoice.status?.toLowerCase() === "unpaid"
                  ? "danger"
                  : "default"
              }
            />

            {invoice.paidDate && (
              <InfoRow
                label="Ngày thanh toán"
                value={formatDate(invoice.paidDate)}
                icon="payment"
                type="highlight"
              />
            )}
          </ModernCard>
          {invoice.paymentMethod && (
            <ModernCard title="Thông tin thanh toán">
              <InfoRow
                label="Phương thức thanh toán"
                value={invoice.paymentMethod}
                icon="credit-card"
              />

              {invoice.transactionId && (
                <InfoRow
                  label="Mã giao dịch"
                  value={invoice.transactionId}
                  icon="confirmation-number"
                  copyable
                />
              )}
            </ModernCard>
          )}
          {invoice.notes && (
            <ModernCard title="Ghi chú">
              <InfoRow label="Ghi chú" value={invoice.notes} icon="note" />
            </ModernCard>
          )}
          {canPay(invoice.status, invoice.dueDate) && (
            <View style={{ marginTop: 20, paddingBottom: 20 }}>
              <ModernButton
                title="Thanh toán ngay"
                onPress={handlePay}
                icon="payment"
                variant="primary"
              />
            </View>
          )}
        </ScrollView>
      )}
    </ModernScreenWrapper>
  );
}
