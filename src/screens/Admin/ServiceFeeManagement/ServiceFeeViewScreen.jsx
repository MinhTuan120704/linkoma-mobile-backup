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
    navigation.navigate("ServiceFeeEdit", { serviceFee });
  };
  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa loại dịch vụ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const response = await serviceTypeService.deleteServiceType(
              serviceFee.serviceTypeId
            );
            if (response.success) {
              Alert.alert("Thành công", "Xóa loại dịch vụ thành công!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert(
                "Lỗi",
                response.message ||
                  "Không thể xóa loại dịch vụ. Vui lòng thử lại."
              );
            }
          } catch (error) {
            console.log("Error deleting service type:", error);
            Alert.alert("Lỗi", "Không thể xóa loại dịch vụ. Vui lòng thử lại.");
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
        title="Chi tiết loại dịch vụ"
        subtitle="Thông tin không tồn tại"
        headerColor="#2C3E50"
      >
        <ModernCard>
          <InfoRow
            label="Thông báo"
            value="Loại dịch vụ không tồn tại hoặc đã bị xóa"
            icon="error"
            type="warning"
          />
        </ModernCard>
      </ModernScreenWrapper>
    );
  }
  return (
    <ModernScreenWrapper
      title="Chi tiết loại dịch vụ"
      subtitle="Thông tin chi tiết loại dịch vụ"
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin cơ bản">
          <InfoRow
            label="Tên dịch vụ"
            value={serviceFee.serviceName}
            icon="label"
            type="highlight"
          />

          <InfoRow
            label="Giá đơn vị"
            value={formatCurrency(serviceFee.unitPrice)}
            icon="attach-money"
            type="highlight"
          />

          <InfoRow label="Đơn vị" value={serviceFee.unit} icon="straighten" />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Chỉnh sửa thông tin"
            onPress={handleEdit}
            icon="edit"
            fullWidth
          />

          <ModernButton
            title="Xóa loại dịch vụ"
            onPress={handleDelete}
            type="danger"
            icon="delete"
            fullWidth
          />

          <ModernButton
            title="Quay lại"
            onPress={() => navigation.goBack()}
            type="secondary"
            fullWidth
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
