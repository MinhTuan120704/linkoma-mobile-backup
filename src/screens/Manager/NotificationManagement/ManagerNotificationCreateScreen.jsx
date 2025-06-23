import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernPicker,
} from "../../../components";
import announcementService from "../../../services/announcementService";

// Constants for dropdown options
const TYPE_OPTIONS = [
  { label: "Chung", value: "General" },
  { label: "Khẩn cấp", value: "Urgent" },
  { label: "Bảo trì", value: "Maintenance" },
  { label: "Sự kiện", value: "Event" },
];

const PRIORITY_OPTIONS = [
  { label: "Thấp", value: "Low" },
  { label: "Trung bình", value: "Medium" },
  { label: "Cao", value: "High" },
  { label: "Khẩn cấp", value: "Critical" },
];

export default function ManagerNotificationCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "General", // Enum: General, Maintenance, Event, Emergency
    priority: "Medium", // Enum: Low, Medium, High, Critical
    title: "",
    content: "",
    author: 1, // Should be current user ID
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung là bắt buộc";
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
      const response = await announcementService.createAnnouncement(formData);
      if (response.success) {
        Alert.alert("Thành công", "Tạo thông báo thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tạo thông báo. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("Error creating notification:", error);
      Alert.alert("Lỗi", "Không thể tạo thông báo. Vui lòng thử lại.");
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
      title="Tạo thông báo mới"
      subtitle="Nhập thông tin thông báo"
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernFormInput
          label="Tiêu đề thông báo"
          value={formData.title}
          onChangeText={(value) => updateField("title", value)}
          placeholder="Nhập tiêu đề thông báo"
          icon="notifications"
          required
          error={errors.title}
        />
        <ModernFormInput
          label="Nội dung"
          value={formData.content}
          onChangeText={(value) => updateField("content", value)}
          placeholder="Nhập nội dung thông báo"
          icon="message"
          multiline
          numberOfLines={6}
          required
          error={errors.content}
        />{" "}
        <ModernPicker
          label="Loại thông báo"
          value={formData.type}
          onValueChange={(value) => updateField("type", value)}
          items={TYPE_OPTIONS}
          placeholder="Chọn loại thông báo"
          icon="category"
          error={errors.type}
        />
        <ModernPicker
          label="Mức độ ưu tiên"
          value={formData.priority}
          onValueChange={(value) => updateField("priority", value)}
          items={PRIORITY_OPTIONS}
          placeholder="Chọn mức độ ưu tiên"
          icon="priority-high"
          error={errors.priority}
        />
        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Tạo thông báo"
            onPress={handleSubmit}
            loading={loading}
            icon="send"
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
