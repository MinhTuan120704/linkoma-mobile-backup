import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import userService from "../../../services/userService";

export default function ResidentViewScreen({ route, navigation }) {
  // Get resident object from params, or extract residentId from it
  const { resident: residentFromParams, residentId: directResidentId } =
    route.params || {};
  const residentId =
    directResidentId || residentFromParams?.userId || residentFromParams?.id;

  const [resident, setResident] = useState(residentFromParams || null);
  const [loading, setLoading] = useState(!residentFromParams);
  const fetchResident = async () => {
    if (!residentId) {
      console.log("No residentId provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log(
        "typeof residentId, residentId:",
        typeof residentId,
        residentId
      );

      const response = await userService.getUserById(residentId);
      if (response.success) {
        setResident(response.data);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tải thông tin cư dân"
        );
      }
    } catch (error) {
      console.log("Error fetching resident:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin cư dân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we don't already have resident data and we have an ID
    if (!resident && residentId) {
      fetchResident();
    } else if (!residentId) {
      setLoading(false);
    }
  }, [residentId]);
  const handleEdit = () => {
    navigation.navigate("ResidentEdit", { resident });
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
              const response = await userService.deleteUser(residentId);
              if (response.success) {
                Alert.alert("Thành công", "Xóa cư dân thành công", [
                  { text: "OK", onPress: () => navigation.goBack() },
                ]);
              } else {
                Alert.alert("Lỗi", response.message || "Không thể xóa cư dân");
                setLoading(false);
              }
            } catch (error) {
              console.log("Error deleting resident:", error);
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
