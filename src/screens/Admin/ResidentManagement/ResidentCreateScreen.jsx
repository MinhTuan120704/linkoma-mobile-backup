import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernDateTimePicker,
} from "../../../components";
import userService from "../../../services/userService";

export default function ResidentCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    idCard: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
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

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
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
      const response = await userService.createUser(formData);
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
          value={formData.phone}
          onChangeText={(value) => updateField("phone", value)}
          placeholder="Nhập số điện thoại"
          icon="phone"
          keyboardType="phone-pad"
          required
          error={errors.phone}
        />{" "}
        <ModernDateTimePicker
          label="Ngày sinh"
          value={formData.dob ? new Date(formData.dob) : null}
          onChange={(date) => updateField("dob", date.toISOString())}
          icon="cake"
          error={errors.dob}
          maximumDate={new Date()}
        />
        <ModernFormInput
          label="Giới tính"
          value={formData.gender}
          onChangeText={(value) => updateField("gender", value)}
          placeholder="Nam/Nữ"
          icon="person-outline"
          error={errors.gender}
        />
        <ModernFormInput
          label="CCCD/CMND"
          value={formData.idCard}
          onChangeText={(value) => updateField("idCard", value)}
          placeholder="Nhập số CCCD/CMND"
          icon="badge"
          keyboardType="numeric"
          error={errors.idCard}
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
          label="Người liên hệ khẩn cấp"
          value={formData.emergencyContact}
          onChangeText={(value) => updateField("emergencyContact", value)}
          placeholder="Nhập tên người liên hệ"
          icon="contact-emergency"
          error={errors.emergencyContact}
        />
        <ModernFormInput
          label="SĐT liên hệ khẩn cấp"
          value={formData.emergencyPhone}
          onChangeText={(value) => updateField("emergencyPhone", value)}
          placeholder="Nhập số điện thoại"
          icon="phone-in-talk"
          keyboardType="phone-pad"
          error={errors.emergencyPhone}
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
            type="outline"
            fullWidth
          />
        </View>
      </View>
    </ModernScreenWrapper>
  );
}
