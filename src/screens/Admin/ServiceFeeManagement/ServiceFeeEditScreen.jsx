import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
// Import serviceFeeService để thực hiện các chức năng:
// - Tạo mới phí dịch vụ (createServiceFee)
// - Cập nhật phí dịch vụ (updateServiceFee)
// - Xóa phí dịch vụ (deleteServiceFee)
// - Lấy chi tiết phí dịch vụ (getServiceFeeById)

export default function ServiceFeeEditScreen({ route, navigation }) {
  const { serviceFee } = route.params || {};

  const [formData, setFormData] = useState({
    name: serviceFee?.name || "",
    description: serviceFee?.description || "",
    amount: serviceFee?.amount?.toString() || "",
    category: serviceFee?.category || "",
    billingPeriod: serviceFee?.billingPeriod || "monthly",
    isActive: serviceFee?.isActive !== false ? "true" : "false",
    effectiveDate: serviceFee?.effectiveDate || "",
    unit: serviceFee?.unit || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên phí dịch vụ không được để trống";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Số tiền không được để trống";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) < 0) {
      newErrors.amount = "Số tiền phải là số hợp lệ và không âm";
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
      const updateData = {
        ...formData,
        amount: parseFloat(formData.amount),
        isActive: formData.isActive === "true",
      };

      // TODO: Call API updateServiceFee(id, data) để cập nhật phí dịch vụ
      Alert.alert("Thành công", "Cập nhật phí dịch vụ thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating service fee:", error);
      Alert.alert("Lỗi", "Không thể cập nhật phí dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa phí dịch vụ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            // TODO: Call API deleteServiceFee(id) để xóa phí dịch vụ
            Alert.alert("Thành công", "Xóa phí dịch vụ thành công", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            console.error("Error deleting service fee:", error);
            Alert.alert("Lỗi", "Không thể xóa phí dịch vụ");
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
      title="Chỉnh sửa phí dịch vụ"
      subtitle="Cập nhật thông tin phí dịch vụ"
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin phí dịch vụ">
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
            placeholder="Ví dụ: /tháng, /kwh, /m3"
            icon="straighten"
          />
        </ModernCard>

        <ModernCard title="Thông tin khác">
          <ModernFormInput
            label="Danh mục"
            value={formData.category}
            onChangeText={(value) => updateField("category", value)}
            placeholder="Ví dụ: Điện, Nước, Internet, Vệ sinh"
            icon="category"
          />

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
            title="Cập nhật phí dịch vụ"
            onPress={handleUpdate}
            loading={loading}
            icon="save"
          />

          <ModernButton
            title="Xóa phí dịch vụ"
            onPress={handleDelete}
            variant="danger"
            icon="delete"
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
