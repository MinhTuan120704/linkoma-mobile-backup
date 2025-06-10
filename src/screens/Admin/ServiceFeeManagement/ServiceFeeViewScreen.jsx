import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import serviceFeeService from "../../../services/serviceFeeService";

export default function ServiceFeeViewScreen({ route, navigation }) {
  const { serviceFee } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    navigation.navigate("ServiceFeeEdit", { serviceFee });
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
            await serviceFeeService.removeServiceFee(serviceFee.id);
            Alert.alert("Thành công", "Xóa phí dịch vụ thành công", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            console.error("Error deleting service fee:", error);
            Alert.alert("Lỗi", "Không thể xóa phí dịch vụ");
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

  const getBillingPeriodText = (period) => {
    switch (period) {
      case "monthly":
        return "Hàng tháng";
      case "quarterly":
        return "Hàng quý";
      case "yearly":
        return "Hàng năm";
      case "one-time":
        return "Một lần";
      default:
        return period || "Không xác định";
    }
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
      subtitle={serviceFee.name}
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin cơ bản">
          <InfoRow
            label="Tên phí dịch vụ"
            value={serviceFee.name}
            icon="build"
            type="highlight"
          />

          <InfoRow
            label="Mô tả"
            value={serviceFee.description || "Không có mô tả"}
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
            value={serviceFee.category || "Không xác định"}
            icon="category"
          />

          <InfoRow
            label="Đơn vị tính"
            value={serviceFee.unit || "Không xác định"}
            icon="straighten"
          />
        </ModernCard>

        <ModernCard title="Thông tin thanh toán">
          <InfoRow
            label="Chu kỳ thanh toán"
            value={getBillingPeriodText(serviceFee.billingPeriod)}
            icon="schedule"
          />

          <InfoRow
            label="Ngày có hiệu lực"
            value={formatDate(serviceFee.effectiveDate)}
            icon="event"
          />

          <InfoRow
            label="Trạng thái"
            value={serviceFee.isActive ? "Đang hoạt động" : "Tạm dừng"}
            icon={serviceFee.isActive ? "check-circle" : "pause-circle"}
            type={serviceFee.isActive ? "highlight" : "warning"}
          />
        </ModernCard>

        {serviceFee.notes && (
          <ModernCard title="Ghi chú">
            <InfoRow label="Ghi chú" value={serviceFee.notes} icon="note" />
          </ModernCard>
        )}

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Chỉnh sửa phí dịch vụ"
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
