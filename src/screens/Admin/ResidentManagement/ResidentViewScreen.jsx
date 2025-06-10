import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import residentService from "../../../services/residentService";

export default function ResidentViewScreen({ route, navigation }) {
  const { residentId } = route.params;
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResident = async () => {
    setLoading(true);
    try {
      const data = await residentService.getResidentById(residentId);
      setResident(data);
    } catch (error) {
      console.error("Error fetching resident:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin cư dân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResident();
  }, [residentId]);

  const handleEdit = () => {
    navigation.navigate("ResidentEditScreen", { resident });
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa cư dân này? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await residentService.deleteResident(residentId);
              Alert.alert("Thành công", "Xóa cư dân thành công", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error("Error deleting resident:", error);
              Alert.alert("Lỗi", "Không thể xóa cư dân");
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

  if (!resident && !loading) {
    return (
      <ModernScreenWrapper
        title="Chi tiết cư dân"
        subtitle="Thông tin không tồn tại"
        headerColor="#2C3E50"
      >
        <ModernCard>
          <InfoRow
            label="Thông báo"
            value="Cư dân không tồn tại hoặc đã bị xóa"
            icon="error"
            type="warning"
          />
        </ModernCard>
      </ModernScreenWrapper>
    );
  }

  return (
    <ModernScreenWrapper
      title="Chi tiết cư dân"
      subtitle="Thông tin chi tiết cư dân"
      headerColor="#2C3E50"
      loading={loading}
      onRefresh={fetchResident}
    >
      {resident && (
        <ScrollView showsVerticalScrollIndicator={false}>
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
              label="CMND/CCCD"
              value={resident.citizenId}
              icon="badge"
              copyable
            />
          </ModernCard>

          <ModernCard title="Thông tin liên hệ">
            <InfoRow
              label="Địa chỉ"
              value={resident.address}
              icon="location-on"
            />

            <InfoRow
              label="Căn hộ"
              value={resident.apartmentName || resident.apartmentId}
              icon="home"
              type="highlight"
            />

            <InfoRow label="Block" value={resident.block} icon="business" />

            <InfoRow
              label="Tầng"
              value={resident.floor?.toString()}
              icon="layers"
            />
          </ModernCard>

          <ModernCard title="Thông tin khác">
            <InfoRow
              label="Biển số xe"
              value={resident.licensePlate}
              icon="directions-car"
            />

            <InfoRow
              label="Trạng thái"
              value={
                resident.status === "active"
                  ? "Đang hoạt động"
                  : "Không hoạt động"
              }
              icon="info"
              type={resident.status === "active" ? "highlight" : "warning"}
            />

            <InfoRow
              label="Ngày tham gia"
              value={formatDate(resident.createdAt)}
              icon="calendar-today"
            />

            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDate(resident.updatedAt)}
              icon="update"
            />
          </ModernCard>

          {resident.emergencyContact && (
            <ModernCard title="Liên hệ khẩn cấp">
              <InfoRow
                label="Người liên hệ"
                value={resident.emergencyContact}
                icon="contact-emergency"
              />

              <InfoRow
                label="Số điện thoại"
                value={resident.emergencyPhone}
                icon="phone-in-talk"
                copyable
              />
            </ModernCard>
          )}

          <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
            <ModernButton
              title="Chỉnh sửa thông tin"
              onPress={handleEdit}
              icon="edit"
            />

            <ModernButton
              title="Xóa cư dân"
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
