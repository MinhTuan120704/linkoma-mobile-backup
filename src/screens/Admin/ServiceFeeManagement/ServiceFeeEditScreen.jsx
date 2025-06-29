import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
import serviceTypeService from "../../../services/serviceTypeService";

export default function ServiceFeeEditScreen({ route, navigation }) {
  const { serviceFee } = route.params || {};

  const [formData, setFormData] = useState({
    serviceName: serviceFee?.serviceName || "",
    unitPrice: serviceFee?.unitPrice?.toString() || "",
    unit: serviceFee?.unit || "",
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
      parseFloat(formData.unitPrice) < 0
    ) {
      newErrors.unitPrice = "Giá đơn vị phải là số hợp lệ và không âm";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Đơn vị tính không được để trống";
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
        serviceName: formData.serviceName,
        unitPrice: parseFloat(formData.unitPrice),
        unit: formData.unit,
      };
      const response = await serviceTypeService.updateServiceType(
        serviceFee.serviceTypeId,
        updateData
      );
      if (response.success) {
        Alert.alert("Thành công", "Cập nhật loại dịch vụ thành công", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể cập nhật loại dịch vụ"
        );
      }
    } catch (error) {
      console.log("Error updating service type:", error);
      Alert.alert("Lỗi", "Không thể cập nhật loại dịch vụ");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa loại dịch vụ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const response = await serviceTypeService.deleteServiceType(
              serviceFee.serviceTypeId
            );
            if (response.success) {
              Alert.alert("Thành công", "Xóa loại dịch vụ thành công", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert(
                "Lỗi",
                response.message || "Không thể xóa loại dịch vụ"
              );
              setLoading(false);
            }
          } catch (error) {
            console.log("Error deleting service type:", error);
            Alert.alert("Lỗi", "Không thể xóa loại dịch vụ");
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
      title="Chỉnh sửa loại dịch vụ"
      subtitle="Cập nhật thông tin loại dịch vụ"
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
            title="Cập nhật loại dịch vụ"
            onPress={handleUpdate}
            loading={loading}
            icon="save"
            fullWidth
          />

          <ModernButton
            title="Xóa loại dịch vụ"
            onPress={handleDelete}
            type="danger"
            icon="delete"
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
