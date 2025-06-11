import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
// Import serviceFeeService để thực hiện chức năng:
// - Tạo mới phí dịch vụ (createServiceFee)

export default function ServiceFeeCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    category: "",
    billingPeriod: "monthly",
    unit: "",
    effectiveDate: "",
    isActive: "true",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên phí dịch vụ không được để trống";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Số tiền không được để trống";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Số tiền phải là số dương";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Danh mục không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true); // TODO: Call API createServiceFee(data) để tạo mới phí dịch vụ
      Alert.alert("Thành công", "Tạo phí dịch vụ thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating service fee:", error);
      Alert.alert("Lỗi", "Không thể tạo phí dịch vụ. Vui lòng thử lại.");
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
      title="Tạo phí dịch vụ"
      subtitle="Thêm phí dịch vụ mới"
      headerColor="#2C3E50"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin cơ bản">
          <ModernFormInput
            label="Tên phí dịch vụ"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder="Nhập tên phí dịch vụ"
            icon="build"
            error={errors.name}
          />

          <ModernFormInput
            label="Mô tả"
            value={formData.description}
            onChangeText={(value) => updateField("description", value)}
            placeholder="Mô tả chi tiết về phí dịch vụ"
            icon="description"
            multiline
            numberOfLines={3}
          />

          <ModernFormInput
            label="Danh mục"
            value={formData.category}
            onChangeText={(value) => updateField("category", value)}
            placeholder="Ví dụ: Vệ sinh, Bảo trì, Bảo vệ, v.v."
            icon="category"
            error={errors.category}
          />

          <ModernFormInput
            label="Số tiền (VNĐ)"
            value={formData.amount}
            onChangeText={(value) => updateField("amount", value)}
            placeholder="Nhập số tiền"
            icon="attach_money"
            keyboardType="numeric"
            error={errors.amount}
          />

          <ModernFormInput
            label="Đơn vị tính"
            value={formData.unit}
            onChangeText={(value) => updateField("unit", value)}
            placeholder="Ví dụ: tháng, m², người, v.v."
            icon="straighten"
          />
        </ModernCard>

        <ModernCard title="Cài đặt thanh toán">
          <ModernFormInput
            label="Chu kỳ thanh toán"
            value={formData.billingPeriod}
            onChangeText={(value) => updateField("billingPeriod", value)}
            placeholder="monthly/quarterly/yearly/one-time"
            icon="schedule"
          />

          <ModernFormInput
            label="Ngày có hiệu lực"
            value={formData.effectiveDate}
            onChangeText={(value) => updateField("effectiveDate", value)}
            placeholder="DD/MM/YYYY"
            icon="event"
          />

          <ModernFormInput
            label="Trạng thái hoạt động"
            value={formData.isActive}
            onChangeText={(value) => updateField("isActive", value)}
            placeholder="true/false"
            icon="toggle_on"
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Tạo phí dịch vụ"
            onPress={handleSubmit}
            loading={loading}
            icon="add"
          />

          <ModernButton
            title="Hủy"
            onPress={() => navigation.goBack()}
            variant="outline"
            icon="cancel"
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
