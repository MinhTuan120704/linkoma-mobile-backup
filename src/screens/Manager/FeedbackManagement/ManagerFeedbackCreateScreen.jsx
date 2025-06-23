import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernPicker,
} from "../../../components";
import feedbackService from "../../../services/feedbackService";

export default function ManagerFeedbackCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "", // Will need to be selected in UI
    category: "Maintenance", // Enum: Maintenance, Service, Complaint
    description: "",
    status: "Pending", // Enum: Pending, In Progress, Resolved, Rejected
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) {
      newErrors.userId = "ID người dùng là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
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
      const feedbackData = {
        userId: parseInt(formData.userId),
        category: formData.category,
        description: formData.description,
        status: formData.status,
      };

      const response = await feedbackService.createFeedback(feedbackData);
      if (response.success) {
        Alert.alert("Thành công", "Tạo phản hồi thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tạo phản hồi. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("Error creating feedback:", error);
      Alert.alert("Lỗi", "Không thể tạo phản hồi. Vui lòng thử lại.");
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
      title="Tạo phản hồi mới"
      subtitle="Nhập thông tin phản hồi"
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernFormInput
          label="ID Người dùng"
          value={formData.userId}
          onChangeText={(value) => updateField("userId", value)}
          placeholder="Nhập ID người dùng"
          icon="person"
          keyboardType="numeric"
          required
          error={errors.userId}
        />

        <ModernPicker
          label="Danh mục"
          value={formData.category}
          onValueChange={(value) => updateField("category", value)}
          items={[
            { label: "Bảo trì", value: "Maintenance" },
            { label: "Dịch vụ", value: "Service" },
            { label: "Khiếu nại", value: "Complaint" },
          ]}
          placeholder="Chọn danh mục"
          icon="category"
          required
          error={errors.category}
        />

        <ModernFormInput
          label="Mô tả"
          value={formData.description}
          onChangeText={(value) => updateField("description", value)}
          placeholder="Nhập mô tả phản hồi"
          icon="description"
          multiline
          numberOfLines={4}
          required
          error={errors.description}
        />

        <ModernPicker
          label="Trạng thái"
          value={formData.status}
          onValueChange={(value) => updateField("status", value)}
          items={[
            { label: "Đang chờ", value: "Pending" },
            { label: "Đang xử lý", value: "In Progress" },
            { label: "Đã giải quyết", value: "Resolved" },
            { label: "Từ chối", value: "Rejected" },
          ]}
          placeholder="Chọn trạng thái"
          icon="info"
          required
          error={errors.status}
        />

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Tạo phản hồi"
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
