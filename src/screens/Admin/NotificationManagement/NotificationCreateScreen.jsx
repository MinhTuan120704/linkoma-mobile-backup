import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../../components";
// Import notificationService để thực hiện chức năng:
// - Tạo thông báo mới (createNotification)

export default function NotificationCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "general",
    priority: "medium",
    targetApartments: "",
    scheduledAt: "",
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
      setLoading(true); // TODO: Call API createNotification(formData) để tạo thông báo mới
      Alert.alert("Thành công", "Tạo thông báo thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
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
        />

        <ModernFormInput
          label="Loại thông báo"
          value={formData.type}
          onChangeText={(value) => updateField("type", value)}
          placeholder="general/maintenance/emergency/event"
          icon="category"
          error={errors.type}
        />

        <ModernFormInput
          label="Mức độ ưu tiên"
          value={formData.priority}
          onChangeText={(value) => updateField("priority", value)}
          placeholder="low/medium/high/urgent"
          icon="priority_high"
          error={errors.priority}
        />

        <ModernFormInput
          label="Căn hộ mục tiêu"
          value={formData.targetApartments}
          onChangeText={(value) => updateField("targetApartments", value)}
          placeholder="Để trống để gửi tất cả, hoặc nhập ID căn hộ"
          icon="home"
          error={errors.targetApartments}
        />

        <ModernFormInput
          label="Thời gian gửi"
          value={formData.scheduledAt}
          onChangeText={(value) => updateField("scheduledAt", value)}
          placeholder="DD/MM/YYYY HH:MM (để trống = gửi ngay)"
          icon="schedule"
          error={errors.scheduledAt}
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
