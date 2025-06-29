import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../../components";
import apartmentTypeService from "../../../services/apartmentTypeService";

export default function ApartmentTypeEditScreen({ route, navigation }) {
  const { apartmentType } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    typeName: apartmentType.typeName || "",
    area: apartmentType.area?.toString() || "",
    numBedrooms: apartmentType.numBedrooms?.toString() || "",
    numBathrooms: apartmentType.numBathrooms?.toString() || "",
    rentFee: apartmentType.rentFee?.toString() || "",
    description: apartmentType.description || "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.typeName.trim()) {
      newErrors.typeName = "Tên loại căn hộ là bắt buộc";
    }

    if (!formData.area.trim()) {
      newErrors.area = "Diện tích là bắt buộc";
    } else if (
      isNaN(parseFloat(formData.area)) ||
      parseFloat(formData.area) <= 0
    ) {
      newErrors.area = "Diện tích phải là số dương";
    }

    if (!formData.numBedrooms.trim()) {
      newErrors.numBedrooms = "Số phòng ngủ là bắt buộc";
    } else if (
      isNaN(parseInt(formData.numBedrooms)) ||
      parseInt(formData.numBedrooms) < 0
    ) {
      newErrors.numBedrooms = "Số phòng ngủ phải là số nguyên không âm";
    }

    if (!formData.numBathrooms.trim()) {
      newErrors.numBathrooms = "Số phòng tắm là bắt buộc";
    } else if (
      isNaN(parseInt(formData.numBathrooms)) ||
      parseInt(formData.numBathrooms) <= 0
    ) {
      newErrors.numBathrooms = "Số phòng tắm phải là số nguyên dương";
    }

    if (!formData.rentFee.trim()) {
      newErrors.rentFee = "Phí thuê là bắt buộc";
    } else if (
      isNaN(parseFloat(formData.rentFee)) ||
      parseFloat(formData.rentFee) <= 0
    ) {
      newErrors.rentFee = "Phí thuê phải là số dương";
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
      const apartmentTypeData = {
        typeName: formData.typeName.trim(),
        area: parseFloat(formData.area),
        numBedrooms: parseInt(formData.numBedrooms),
        numBathrooms: parseInt(formData.numBathrooms),
        rentFee: parseFloat(formData.rentFee),
        description: formData.description.trim() || null,
      };

      const response = await apartmentTypeService.updateApartmentType(
        apartmentType.apartmentTypeId,
        apartmentTypeData
      );
      if (response.success) {
        Alert.alert("Thành công", "Cập nhật loại căn hộ thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message ||
            "Không thể cập nhật loại căn hộ. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("Error updating apartment type:", error);
      Alert.alert("Lỗi", "Không thể cập nhật loại căn hộ. Vui lòng thử lại.");
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

  const formatCurrency = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    return numericValue;
  };

  return (
    <ModernScreenWrapper
      title="Chỉnh sửa loại căn hộ"
      subtitle={`Cập nhật ${apartmentType.typeName || "loại căn hộ"}`}
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernFormInput
          label="Tên loại căn hộ"
          value={formData.typeName}
          onChangeText={(value) => updateField("typeName", value)}
          placeholder="Ví dụ: Studio, 1PN, 2PN..."
          icon="category"
          required
          error={errors.typeName}
        />

        <ModernFormInput
          label="Diện tích (m²)"
          value={formData.area}
          onChangeText={(value) => updateField("area", value)}
          placeholder="Nhập diện tích"
          icon="square-foot"
          keyboardType="decimal-pad"
          required
          error={errors.area}
        />

        <ModernFormInput
          label="Số phòng ngủ"
          value={formData.numBedrooms}
          onChangeText={(value) => updateField("numBedrooms", value)}
          placeholder="Nhập số phòng ngủ"
          icon="bed"
          keyboardType="numeric"
          required
          error={errors.numBedrooms}
        />

        <ModernFormInput
          label="Số phòng tắm"
          value={formData.numBathrooms}
          onChangeText={(value) => updateField("numBathrooms", value)}
          placeholder="Nhập số phòng tắm"
          icon="bathtub"
          keyboardType="numeric"
          required
          error={errors.numBathrooms}
        />

        <ModernFormInput
          label="Phí thuê (VNĐ)"
          value={formData.rentFee}
          onChangeText={(value) =>
            updateField("rentFee", formatCurrency(value))
          }
          placeholder="Nhập phí thuê"
          icon="payments"
          keyboardType="numeric"
          required
          error={errors.rentFee}
        />

        <ModernFormInput
          label="Mô tả"
          value={formData.description}
          onChangeText={(value) => updateField("description", value)}
          placeholder="Nhập mô tả loại căn hộ (tùy chọn)"
          icon="description"
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Cập nhật loại căn hộ"
            onPress={handleSubmit}
            loading={loading}
            icon="save"
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
