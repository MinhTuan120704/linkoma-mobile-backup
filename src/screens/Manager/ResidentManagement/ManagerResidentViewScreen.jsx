import React, { useState } from "react";
import { Alert, View, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import userService from "../../../services/userService";

const formatDate = (dateString) => {
  if (!dateString) return "Không có thông tin";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function ManagerResidentViewScreen({ route, navigation }) {
  const { resident } = route.params;
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = () => {
    navigation.navigate("ManagerResidentEdit", { resident });
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa cư dân này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleteLoading(true);
            const response = await userService.deleteUser(resident.userId);
            if (response.success) {
              Alert.alert("Thành công", "Xóa cư dân thành công!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert(
                "Lỗi",
                response.message || "Không thể xóa cư dân. Vui lòng thử lại."
              );
            }
          } catch (error) {
            console.log("Error deleting resident:", error);
            Alert.alert("Lỗi", "Không thể xóa cư dân. Vui lòng thử lại.");
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ModernScreenWrapper
      title="Chi tiết cư dân"
      subtitle={resident?.name || "Cư dân"}
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 20 }}>
          <ModernCard title="Thông tin cơ bản">
            <InfoRow
              label="Họ và tên"
              value={resident.name}
              icon="person"
              type="highlight"
            />

            <InfoRow
              label="Email"
              value={resident.email}
              icon="email"
              copyable
            />

            <InfoRow
              label="Số điện thoại"
              value={resident.phoneNumber}
              icon="phone"
              copyable
            />

            <InfoRow
              label="Ngày sinh"
              value={formatDate(resident.dateOfBirth)}
              icon="cake"
            />

            <InfoRow
              label="CCCD/CMND"
              value={resident.citizenId}
              icon="badge"
            />

            <InfoRow
              label="Địa chỉ"
              value={resident.address}
              icon="location-on"
            />

            <InfoRow
              label="ID Căn hộ"
              value={resident.apartmentId?.toString()}
              icon="home"
              type="highlight"
            />
          </ModernCard>

          <ModernCard title="Thông tin khác">
            <InfoRow
              label="Biển số xe"
              value={resident.licensePlate}
              icon="directions-car"
            />

            <InfoRow
              label="Vai trò"
              value={resident.role}
              icon="person"
              type="highlight"
            />

            <InfoRow
              label="Ngày tạo"
              value={formatDate(resident.createdAt)}
              icon="calendar-today"
            />

            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDate(resident.updatedAt)}
              icon="update"
            />
          </ModernCard>

          <View style={{ marginTop: 20, gap: 12 }}>
            <ModernButton
              title="Chỉnh sửa thông tin"
              onPress={handleEdit}
              icon="edit"
              fullWidth
            />

            <ModernButton
              title="Xóa cư dân"
              onPress={handleDelete}
              loading={deleteLoading}
              type="danger"
              icon="delete"
              fullWidth
            />

            <ModernButton
              title="Quay lại"
              onPress={() => navigation.goBack()}
              type="outline"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
