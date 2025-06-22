import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import invoiceService from "../../../services/invoiceService";

export default function InvoiceViewScreen({ route, navigation }) {
  const { invoiceId } = route.params || {};
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const response = await invoiceService.getInvoiceById(invoiceId);
      if (response.success) {
        setInvoice(response.data);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tải thông tin hóa đơn"
        );
        setInvoice(null);
      }
    } catch (error) {
      console.log("Error fetching invoice:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const handleEdit = () => {
    navigation.navigate("InvoiceEditScreen", { invoice });
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa hóa đơn này? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await invoiceService.deleteInvoice(invoiceId);
              if (response.success) {
                Alert.alert("Thành công", "Xóa hóa đơn thành công", [
                  { text: "OK", onPress: () => navigation.goBack() },
                ]);
              } else {
                Alert.alert("Lỗi", response.message || "Không thể xóa hóa đơn");
                setLoading(false);
              }
            } catch (error) {
              console.log("Error deleting invoice:", error);
              Alert.alert("Lỗi", "Không thể xóa hóa đơn");
              setLoading(false);
            }
          },
        },
      ]
    );
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
    switch (status) {
      case "paid":
        return "highlight";
      case "pending":
        return "warning";
      case "overdue":
        return "danger";
      default:
        return "default";
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

  if (!invoice && !loading) {
    return (
      <ModernScreenWrapper
        title="Chi tiết hóa đơn"
        subtitle="Thông tin không tồn tại"
        headerColor="#2C3E50"
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
      headerColor="#2C3E50"
      loading={loading}
      onRefresh={fetchInvoice}
    >
      {invoice && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ModernCard title="Thông tin hóa đơn">
            <InfoRow
              label="Mã hóa đơn"
              value={invoice.invoiceCode}
              icon="receipt"
              type="highlight"
              copyable
            />

            <InfoRow
              label="Căn hộ"
              value={invoice.apartmentName || invoice.apartmentId}
              icon="home"
            />

            <InfoRow
              label="Cư dân"
              value={invoice.residentName || invoice.residentId}
              icon="person"
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
              value={invoice.serviceType || "Không xác định"}
              icon="build"
            />

            <InfoRow
              label="Kỳ thanh toán"
              value={invoice.period || "Không xác định"}
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
              value={formatCurrency(invoice.amount)}
              icon="attach-money"
              type="highlight"
            />

            <InfoRow
              label="Ngày phát hành"
              value={formatDate(invoice.issueDate)}
              icon="today"
            />

            <InfoRow
              label="Ngày đến hạn"
              value={formatDate(invoice.dueDate)}
              icon="schedule"
              type={invoice.status === "overdue" ? "danger" : "default"}
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

          <ModernCard title="Thông tin hệ thống">
            <InfoRow
              label="Ngày tạo"
              value={formatDate(invoice.createdAt)}
              icon="calendar-today"
            />

            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDate(invoice.updatedAt)}
              icon="update"
            />

            <InfoRow
              label="Người tạo"
              value={invoice.createdBy || "Hệ thống"}
              icon="person-add"
            />
          </ModernCard>

          <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
            <ModernButton
              title="Chỉnh sửa hóa đơn"
              onPress={handleEdit}
              icon="edit"
            />

            <ModernButton
              title="Xóa hóa đơn"
              onPress={handleDelete}
              variant="danger"
              icon="delete"
            />
          </View>
        </ScrollView>
      )}
    </ModernScreenWrapper>
  );
}
