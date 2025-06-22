import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import serviceTypeService from "../../../services/serviceTypeService";

export default function ServiceFeeViewScreen({ route, navigation }) {
  const { serviceFee } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    navigation.navigate("ServiceFeeEditScreen", { serviceFee });
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa phí dịch vụ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const response = await serviceTypeService.deleteServiceType(
              serviceFee.id
            );
            if (response.success) {
              Alert.alert("Thành công", "Xóa phí dịch vụ thành công!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert(
                "Lỗi",
                response.message ||
                  "Không thể xóa phí dịch vụ. Vui lòng thử lại."
              );
            }
          } catch (error) {
            console.log("Error deleting service fee:", error);
            Alert.alert("Lỗi", "Không thể xóa phí dịch vụ. Vui lòng thử lại.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
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

  if (!serviceFee) {
    return (
      <ModernScreenWrapper
        title="Chi tiết phí dịch vụ"
        subtitle="Thông tin không tồn tại"
        headerColor="#2C3E50"
      >
        <ModernCard>
          <InfoRow
            label="Thông báo"
            value="Phí dịch vụ không tồn tại hoặc đã bị xóa"
            icon="error"
            type="warning"
          />
        </ModernCard>
      </ModernScreenWrapper>
    );
  }

  return (
    <ModernScreenWrapper
      title="Chi tiết phí dịch vụ"
      subtitle="Thông tin chi tiết phí dịch vụ"
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin cơ bản">
          <InfoRow
            label="Tên phí dịch vụ"
            value={serviceFee.name}
            icon="label"
            type="highlight"
          />

          <InfoRow
            label="Mô tả"
            value={serviceFee.description}
            icon="description"
          />

          <InfoRow
            label="Số tiền"
            value={formatCurrency(serviceFee.amount)}
            icon="attach-money"
            type="highlight"
          />

          <InfoRow
            label="Danh mục"
            value={serviceFee.category}
            icon="category"
          />

          <InfoRow label="Đơn vị" value={serviceFee.unit} icon="straighten" />
        </ModernCard>

        <ModernCard title="Thông tin thanh toán">
          <InfoRow
            label="Chu kỳ thanh toán"
            value={
              serviceFee.billingPeriod === "monthly"
                ? "Hàng tháng"
                : serviceFee.billingPeriod === "quarterly"
                ? "Hàng quý"
                : "Hàng năm"
            }
            icon="schedule"
          />

          <InfoRow
            label="Ngày hiệu lực"
            value={formatDate(serviceFee.effectiveDate)}
            icon="event"
          />

          <InfoRow
            label="Trạng thái"
            value={serviceFee.isActive ? "Đang hoạt động" : "Không hoạt động"}
            icon="info"
            type={serviceFee.isActive ? "highlight" : "warning"}
          />
        </ModernCard>

        <ModernCard title="Thông tin khác">
          <InfoRow
            label="Ngày tạo"
            value={formatDate(serviceFee.createdAt)}
            icon="calendar-today"
          />

          <InfoRow
            label="Cập nhật lần cuối"
            value={formatDate(serviceFee.updatedAt)}
            icon="update"
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Chỉnh sửa thông tin"
            onPress={handleEdit}
            icon="edit"
          />

          <ModernButton
            title="Xóa phí dịch vụ"
            onPress={handleDelete}
            variant="danger"
            icon="delete"
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
