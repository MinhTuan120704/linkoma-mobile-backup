import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
// Import apartmentService để thực hiện chức năng:
// - Xóa căn hộ (removeApartment)

export default function ApartmentViewScreen({ route, navigation }) {
  const { apartment } = route.params || {};
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = () => {
    navigation.navigate("ApartmentEditScreen", { apartment });
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa căn hộ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleteLoading(true);
            // TODO: Call API removeApartment(id) để xóa căn hộ
            Alert.alert("Thành công", "Xóa căn hộ thành công!", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa căn hộ. Vui lòng thử lại.");
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <ModernScreenWrapper
      title="Chi tiết căn hộ"
      subtitle={`${apartment?.name || "Căn hộ"} - ${apartment?.block || ""}`}
      headerColor="#2C3E50"
      rightHeaderComponent={
        <ModernButton
          title="Sửa"
          onPress={handleEdit}
          type="outline"
          size="small"
        />
      }
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Thông tin cơ bản">
          <InfoRow
            label="Tên căn hộ"
            value={apartment?.name}
            icon="home"
            type="highlight"
          />

          <InfoRow label="Block" value={apartment?.block} icon="business" />

          <InfoRow
            label="Tầng"
            value={apartment?.floor?.toString()}
            icon="layers"
          />

          <InfoRow
            label="Diện tích"
            value={apartment?.area ? `${apartment.area} m²` : null}
            icon="square-foot"
          />
        </ModernCard>

        <ModernCard title="Chi tiết căn hộ">
          <InfoRow
            label="Số phòng ngủ"
            value={apartment?.bedrooms?.toString()}
            icon="bed"
          />

          <InfoRow
            label="Số phòng tắm"
            value={apartment?.bathrooms?.toString()}
            icon="bathtub"
          />

          <InfoRow
            label="Trạng thái"
            value={apartment?.status || "Không xác định"}
            icon="info"
            type={apartment?.status === "occupied" ? "warning" : "highlight"}
          />

          <InfoRow
            label="Mô tả"
            value={apartment?.description}
            icon="description"
          />
        </ModernCard>

        <ModernCard title="Thông tin khác">
          <InfoRow
            label="Ngày tạo"
            value={formatDate(apartment?.createdAt)}
            icon="calendar-today"
          />

          <InfoRow
            label="Cập nhật lần cuối"
            value={formatDate(apartment?.updatedAt)}
            icon="update"
          />

          <InfoRow
            label="ID căn hộ"
            value={apartment?.id?.toString()}
            icon="tag"
            copyable
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
            title="Xóa căn hộ"
            onPress={handleDelete}
            type="danger"
            loading={deleteLoading}
            icon="delete"
            fullWidth
          />
        </View>
      </View>
    </ModernScreenWrapper>
  );
}
