import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernDateTimePicker,
  ModernPicker,
} from "../../../components";
import userService from "../../../services/userService";

export default function ResidentCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    citizenId: "",
    address: "",
    licensePlate: "",
    apartmentId: "",
    password: "",
    role: "resident",
  });
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

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    if (!formData.role) {
      newErrors.role = "Vai trò là bắt buộc";
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
      const userData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        citizenId: formData.citizenId || undefined,
        address: formData.address || undefined,
        licensePlate: formData.licensePlate || undefined,
        apartmentId: formData.apartmentId
          ? parseInt(formData.apartmentId)
          : undefined,
        password: formData.password,
        role: formData.role,
      };

      const response = await userService.createUser(userData);
      if (response.success) {
        Alert.alert("Thành công", "Tạo cư dân thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tạo cư dân. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("Error creating resident:", error);
      Alert.alert("Lỗi", "Không thể tạo cư dân. Vui lòng thử lại.");
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
      title="Tạo cư dân mới"
      subtitle="Nhập thông tin cư dân"
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
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
        />
        <ModernDateTimePicker
          label="Ngày sinh"
          value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
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
        <ModernFormInput
          label="Mật khẩu"
          value={formData.password}
          onChangeText={(value) => updateField("password", value)}
          placeholder="Nhập mật khẩu"
          icon="lock"
          secureTextEntry
          required
          error={errors.password}
        />
        <ModernPicker
          label="Vai trò"
          value={formData.role}
          onValueChange={(value) => updateField("role", value)}
          items={[
            { label: "Cư dân", value: "resident" },
            { label: "Quản trị viên", value: "admin" },
            { label: "Nhân viên", value: "manager" },
          ]}
          placeholder="Chọn vai trò"
          icon="person"
          required
          error={errors.role}
        />
        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Tạo cư dân"
            onPress={handleSubmit}
            loading={loading}
            icon="person-add"
            fullWidth
          />
          <ModernButton
            title="Hủy"
            onPress={() => navigation.goBack()}
            type="secondary"
            fullWidth
          />
        </View>
      </View>
    </ModernScreenWrapper>
  );
}
