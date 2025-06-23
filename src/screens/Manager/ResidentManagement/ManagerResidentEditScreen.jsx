import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
  ModernDateTimePicker,
  ModernPicker,
} from "../../../components";
import userService from "../../../services/userService";

export default function ManagerResidentEditScreen({ route, navigation }) {
  const { resident } = route.params;

  const [formData, setFormData] = useState({
    name: resident.name || "",
    email: resident.email || "",
    phoneNumber: resident.phoneNumber || "",
    dateOfBirth: resident.dateOfBirth || "",
    citizenId: resident.citizenId || "",
    address: resident.address || "",
    licensePlate: resident.licensePlate || "",
    apartmentId: resident.apartmentId?.toString() || "",
    role: resident.role || "resident",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên cư dân là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth || undefined,
        citizenId: formData.citizenId || undefined,
        address: formData.address || undefined,
        licensePlate: formData.licensePlate || undefined,
        apartmentId: formData.apartmentId
          ? parseInt(formData.apartmentId)
          : undefined,
        role: formData.role,
      };

      const response = await userService.updateUser(
        resident.userId,
        updateData
      );
      if (response.success) {
        Alert.alert("Thành công", "Cập nhật thông tin cư dân thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể cập nhật thông tin. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("Error updating resident:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  return (
    <ModernScreenWrapper
      title="Chỉnh sửa cư dân"
      subtitle={resident?.name || "Cư dân"}
      headerColor="#2C3E50"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 20 }}>
          <ModernCard title="Thông tin cơ bản">
            <ModernFormInput
              label="Họ và tên"
              value={formData.name}
              onChangeText={(value) => updateField("name", value)}
              placeholder="Nhập họ và tên"
              icon="person"
              required
              error={errors.name}
            />
            <ModernFormInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateField("email", value)}
              placeholder="Nhập email"
              icon="email"
              keyboardType="email-address"
              required
              error={errors.email}
            />
            <ModernFormInput
              label="Số điện thoại"
              value={formData.phoneNumber}
              onChangeText={(value) => updateField("phoneNumber", value)}
              placeholder="Nhập số điện thoại"
              icon="phone"
              keyboardType="phone-pad"
              required
              error={errors.phoneNumber}
            />{" "}
            <ModernDateTimePicker
              label="Ngày sinh"
              value={
                formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
              }
              onChange={(date) => {
                // Format date as YYYY-MM-DD without timezone conversion
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const formattedDate = `${year}-${month}-${day}`;
                updateField("dateOfBirth", formattedDate);
              }}
              icon="cake"
              error={errors.dateOfBirth}
              maximumDate={new Date()}
            />
          </ModernCard>

          <ModernCard title="Thông tin chi tiết">
            <ModernFormInput
              label="CCCD/CMND"
              value={formData.citizenId}
              onChangeText={(value) => updateField("citizenId", value)}
              placeholder="Nhập số CCCD/CMND"
              icon="badge"
              keyboardType="numeric"
              error={errors.citizenId}
            />

            <ModernFormInput
              label="Địa chỉ"
              value={formData.address}
              onChangeText={(value) => updateField("address", value)}
              placeholder="Nhập địa chỉ"
              icon="location-on"
              multiline
              numberOfLines={3}
              error={errors.address}
            />

            <ModernFormInput
              label="Biển số xe"
              value={formData.licensePlate}
              onChangeText={(value) => updateField("licensePlate", value)}
              placeholder="Nhập biển số xe"
              icon="directions-car"
              error={errors.licensePlate}
            />

            <ModernFormInput
              label="ID Căn hộ"
              value={formData.apartmentId}
              onChangeText={(value) => updateField("apartmentId", value)}
              placeholder="Nhập ID căn hộ"
              icon="home"
              keyboardType="numeric"
              error={errors.apartmentId}
            />

            <ModernPicker
              label="Vai trò"
              value={formData.role}
              onValueChange={(value) => updateField("role", value)}
              items={[
                { label: "Cư dân", value: "resident" },
                { label: "Quản trị viên", value: "admin" },
                { label: "Nhân viên", value: "employee" },
              ]}
              placeholder="Chọn vai trò"
              icon="person"
              required
              error={errors.role}
            />
          </ModernCard>

          <View style={{ marginTop: 20, gap: 12 }}>
            <ModernButton
              title="Cập nhật thông tin"
              onPress={handleSubmit}
              loading={loading}
              icon="save"
              fullWidth
            />

            <ModernButton
              title="Hủy"
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
