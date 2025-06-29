import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
import serviceTypeService from "../../../services/serviceTypeService";

export default function ServiceFeeCreateScreen({ navigation }) {
  const [formData, setFormData] = useState({
    serviceName: "",
    unitPrice: "",
    unit: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Tên dịch vụ không được để trống";
    }

    if (!formData.unitPrice.trim()) {
      newErrors.unitPrice = "Giá đơn vị không được để trống";
    } else if (
      isNaN(formData.unitPrice) ||
      parseFloat(formData.unitPrice) <= 0
    ) {
      newErrors.unitPrice = "Giá đơn vị phải là số dương";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Đơn vị tính không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      const createData = {
        serviceName: formData.serviceName,
        unitPrice: parseFloat(formData.unitPrice),
        unit: formData.unit,
      };
      const response = await serviceTypeService.createServiceType(createData);
      if (response.success) {
        Alert.alert("Thành công", "Tạo loại dịch vụ thành công", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Lỗi", response.message || "Không thể tạo loại dịch vụ");
      }
    } catch (error) {
      console.log("Error creating service type:", error);
      Alert.alert("Lỗi", "Không thể tạo loại dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <ModernScreenWrapper
      title="Tạo loại dịch vụ"
      subtitle="Thêm loại dịch vụ mới"
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin loại dịch vụ">
          <ModernFormInput
            label="Tên dịch vụ"
            value={formData.serviceName}
            onChangeText={(value) => updateField("serviceName", value)}
            placeholder="Nhập tên dịch vụ"
            icon="build"
            required
            error={errors.serviceName}
          />

          <ModernFormInput
            label="Giá đơn vị (VNĐ)"
            value={formData.unitPrice}
            onChangeText={(value) => updateField("unitPrice", value)}
            placeholder="Nhập giá đơn vị"
            icon="attach-money"
            keyboardType="numeric"
            required
            error={errors.unitPrice}
          />

          <ModernFormInput
            label="Đơn vị tính"
            value={formData.unit}
            onChangeText={(value) => updateField("unit", value)}
            placeholder="Ví dụ: tháng, kwh, m3, lần"
            icon="straighten"
            required
            error={errors.unit}
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Tạo loại dịch vụ"
            onPress={handleCreate}
            loading={loading}
            icon="add"
            fullWidth
          />

          <ModernButton
            title="Hủy"
            onPress={() => navigation.goBack()}
            type="secondary"
            fullWidth
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
