import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
// Import residentService để thực hiện các chức năng:
// - Cập nhật thông tin cư dân (updateResident)
// - Xóa cư dân (deleteResident)

export default function ResidentEditScreen({ route, navigation }) {
  const { resident } = route.params;

  const [formData, setFormData] = useState({
    name: resident.name || "",
    email: resident.email || "",
    phoneNumber: resident.phoneNumber || "",
    dateOfBirth: resident.dateOfBirth || "",
    citizenId: resident.citizenId || "",
    address: resident.address || "",
    licensePlate: resident.licensePlate || "",
    emergencyContact: resident.emergencyContact || "",
    emergencyPhone: resident.emergencyPhone || "",
    status: resident.status || "active",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Họ tên không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại không được để trống";
    } else if (
      !/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!formData.citizenId.trim()) {
      newErrors.citizenId = "CMND/CCCD không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API updateResident(id, data) để cập nhật thông tin cư dân
      Alert.alert("Thành công", "Cập nhật thông tin cư dân thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating resident:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin cư dân");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa cư dân này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await residentService.deleteResident(resident.id);
            Alert.alert("Thành công", "Xóa cư dân thành công", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            console.error("Error deleting resident:", error);
            Alert.alert("Lỗi", "Không thể xóa cư dân");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <ModernScreenWrapper
      title="Chỉnh sửa cư dân"
      subtitle="Cập nhật thông tin cư dân"
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin cơ bản">
          <ModernFormInput
            label="Họ và tên"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder="Nhập họ và tên"
            icon="person"
            error={errors.name}
          />

          <ModernFormInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
            placeholder="Nhập email"
            icon="email"
            keyboardType="email-address"
            error={errors.email}
          />

          <ModernFormInput
            label="Số điện thoại"
            value={formData.phoneNumber}
            onChangeText={(value) => updateField("phoneNumber", value)}
            placeholder="Nhập số điện thoại"
            icon="phone"
            keyboardType="phone-pad"
            error={errors.phoneNumber}
          />

          <ModernFormInput
            label="Ngày sinh"
            value={formData.dateOfBirth}
            onChangeText={(value) => updateField("dateOfBirth", value)}
            placeholder="DD/MM/YYYY"
            icon="cake"
          />

          <ModernFormInput
            label="CMND/CCCD"
            value={formData.citizenId}
            onChangeText={(value) => updateField("citizenId", value)}
            placeholder="Nhập số CMND/CCCD"
            icon="badge"
            error={errors.citizenId}
          />
        </ModernCard>

        <ModernCard title="Thông tin khác">
          <ModernFormInput
            label="Địa chỉ"
            value={formData.address}
            onChangeText={(value) => updateField("address", value)}
            placeholder="Nhập địa chỉ"
            icon="location-on"
            multiline
          />

          <ModernFormInput
            label="Biển số xe"
            value={formData.licensePlate}
            onChangeText={(value) => updateField("licensePlate", value)}
            placeholder="Nhập biển số xe"
            icon="directions-car"
          />
        </ModernCard>

        <ModernCard title="Liên hệ khẩn cấp">
          <ModernFormInput
            label="Người liên hệ"
            value={formData.emergencyContact}
            onChangeText={(value) => updateField("emergencyContact", value)}
            placeholder="Tên người liên hệ khẩn cấp"
            icon="contact-emergency"
          />

          <ModernFormInput
            label="Số điện thoại khẩn cấp"
            value={formData.emergencyPhone}
            onChangeText={(value) => updateField("emergencyPhone", value)}
            placeholder="Số điện thoại khẩn cấp"
            icon="phone-in-talk"
            keyboardType="phone-pad"
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Cập nhật thông tin"
            onPress={handleUpdate}
            loading={loading}
            icon="save"
          />

          <ModernButton
            title="Xóa cư dân"
            onPress={handleDelete}
            variant="danger"
            icon="delete"
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
