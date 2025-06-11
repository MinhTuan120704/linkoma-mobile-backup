import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../../components";
import { residentService } from "../../../services";

export default function ResidentCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
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
      
      const residentData = {
        email: formData.email.trim().toLowerCase(),
      };

      console.log('Creating resident with data:', residentData);
      
      const response = await residentService.createResident(residentData);
      
      if (response.success) {
        Alert.alert("Thành công", "Tạo cư dân thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Lỗi", response.message || "Không thể tạo cư dân. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Create resident error:', error);
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra khi tạo cư dân. Vui lòng thử lại.");
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
          label="Email"
          value={formData.email}
          onChangeText={(value) => updateField("email", value)}
          placeholder="Nhập email"
          icon="email"
          keyboardType="email-address"
          required
          error={errors.email}
        />

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Tạo cư dân"
            onPress={handleSubmit}
            loading={loading}
            icon="person_add_alt"
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
