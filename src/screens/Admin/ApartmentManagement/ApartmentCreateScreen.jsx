import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../../components";
import { apartmentService } from "../../../services";

export default function ApartmentCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    block: "",
    floor: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên căn hộ là bắt buộc";
    }

    if (!formData.block.trim()) {
      newErrors.block = "Block là bắt buộc";
    }

    if (!formData.floor.trim()) {
      newErrors.floor = "Tầng là bắt buộc";
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
      
      // Chuyển đổi các giá trị số
      const apartmentData = {
        ...formData,
        floor: formData.floor ? parseInt(formData.floor, 10) : undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : undefined,
      };
      
      // Gọi API để tạo căn hộ
      const result = await apartmentService.createApartment(apartmentData);
      
      if (result.success) {
        Alert.alert("Thành công", result.message || "Tạo căn hộ thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Lỗi", result.message || "Không thể tạo căn hộ. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Create apartment error:", error);
      Alert.alert("Lỗi", "Không thể tạo căn hộ. Vui lòng thử lại.");
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
      title="Tạo căn hộ mới"
      subtitle="Nhập thông tin căn hộ"
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernFormInput
          label="Tên căn hộ"
          value={formData.name}
          onChangeText={(value) => updateField("name", value)}
          placeholder="Nhập tên căn hộ"
          icon="home"
          required
          error={errors.name}
        />

        <ModernFormInput
          label="Block"
          value={formData.block}
          onChangeText={(value) => updateField("block", value)}
          placeholder="Nhập block"
          icon="business"
          required
          error={errors.block}
        />

        <ModernFormInput
          label="Tầng"
          value={formData.floor}
          onChangeText={(value) => updateField("floor", value)}
          placeholder="Nhập tầng"
          icon="layers"
          keyboardType="numeric"
          required
          error={errors.floor}
        />

        <ModernFormInput
          label="Diện tích (m²)"
          value={formData.area}
          onChangeText={(value) => updateField("area", value)}
          placeholder="Nhập diện tích"
          icon="square_foot"
          keyboardType="numeric"
          error={errors.area}
        />

        <ModernFormInput
          label="Số phòng ngủ"
          value={formData.bedrooms}
          onChangeText={(value) => updateField("bedrooms", value)}
          placeholder="Nhập số phòng ngủ"
          icon="bed"
          keyboardType="numeric"
          error={errors.bedrooms}
        />

        <ModernFormInput
          label="Số phòng tắm"
          value={formData.bathrooms}
          onChangeText={(value) => updateField("bathrooms", value)}
          placeholder="Nhập số phòng tắm"
          icon="bathtub"
          keyboardType="numeric"
          error={errors.bathrooms}
        />

        <ModernFormInput
          label="Mô tả"
          value={formData.description}
          onChangeText={(value) => updateField("description", value)}
          placeholder="Nhập mô tả căn hộ"
          icon="description"
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Tạo căn hộ"
            onPress={handleSubmit}
            loading={loading}
            icon="add"
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
