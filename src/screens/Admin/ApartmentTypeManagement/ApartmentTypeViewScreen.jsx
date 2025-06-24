import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import apartmentTypeService from "../../../services/apartmentTypeService";

const formatCurrency = (amount) => {
  if (!amount) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function ApartmentTypeViewScreen({ route, navigation }) {
  const { apartmentType } = route.params;
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = () => {
    navigation.navigate("ApartmentTypeEdit", { apartmentType });
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa loại căn hộ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleteLoading(true);
            const response = await apartmentTypeService.deleteApartmentType(
              apartmentType.apartmentTypeId
            );
            if (response.success) {
              Alert.alert("Thành công", "Xóa loại căn hộ thành công!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert(
                "Lỗi",
                response.message ||
                  "Không thể xóa loại căn hộ. Vui lòng thử lại."
              );
            }
          } catch (error) {
            console.log("Error deleting apartment type:", error);
            Alert.alert("Lỗi", "Không thể xóa loại căn hộ. Vui lòng thử lại.");
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ModernScreenWrapper
      title="Chi tiết loại căn hộ"
      subtitle={apartmentType?.typeName || "Thông tin loại căn hộ"}
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Thông tin cơ bản">
          <InfoRow
            label="Tên loại căn hộ"
            value={apartmentType.typeName || "Không có thông tin"}
            icon="category"
            type="highlight"
          />

          <InfoRow
            label="Diện tích"
            value={
              apartmentType.area
                ? `${apartmentType.area} m²`
                : "Không có thông tin"
            }
            icon="square-foot"
          />

          <InfoRow
            label="Số phòng ngủ"
            value={apartmentType.numBedrooms?.toString() || "0"}
            icon="bed"
          />

          <InfoRow
            label="Số phòng tắm"
            value={apartmentType.numBathrooms?.toString() || "0"}
            icon="bathtub"
          />

          <InfoRow
            label="Phí thuê"
            value={formatCurrency(apartmentType.rentFee)}
            icon="payments"
            type="highlight"
          />
        </ModernCard>

        {apartmentType.description && (
          <ModernCard title="Mô tả">
            <InfoRow
              label="Chi tiết"
              value={apartmentType.description}
              icon="description"
            />
          </ModernCard>
        )}

        <ModernCard title="Thông tin hệ thống">
          <InfoRow
            label="ID"
            value={apartmentType.apartmentTypeId?.toString() || "N/A"}
            icon="tag"
            copyable
          />

          <InfoRow
            label="Ngày tạo"
            value={
              apartmentType.createdAt
                ? new Date(apartmentType.createdAt).toLocaleDateString("vi-VN")
                : "Không có thông tin"
            }
            icon="calendar-today"
          />

          <InfoRow
            label="Cập nhật lần cuối"
            value={
              apartmentType.updatedAt
                ? new Date(apartmentType.updatedAt).toLocaleDateString("vi-VN")
                : "Không có thông tin"
            }
            icon="update"
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Chỉnh sửa"
            onPress={handleEdit}
            icon="edit"
            fullWidth
          />

          <ModernButton
            title="Xóa loại căn hộ"
            onPress={handleDelete}
            type="danger"
            loading={deleteLoading}
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
      </View>
    </ModernScreenWrapper>
  );
}
