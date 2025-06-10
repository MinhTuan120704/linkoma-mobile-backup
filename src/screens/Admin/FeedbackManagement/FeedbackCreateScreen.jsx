import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../../components";
import { createFeedback } from "../../../services/feedbackService";

export default function FeedbackCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    priority: "",
    status: "pending",
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
      await createFeedback(formData);
      Alert.alert("Thành công", "Tạo phản hồi thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
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
          label="Tiêu đề"
          value={formData.title}
          onChangeText={(value) => updateField("title", value)}
          placeholder="Nhập tiêu đề phản hồi"
          icon="title"
          required
          error={errors.title}
        />

        <ModernFormInput
          label="Nội dung"
          value={formData.content}
          onChangeText={(value) => updateField("content", value)}
          placeholder="Nhập nội dung phản hồi"
          icon="description"
          multiline
          numberOfLines={6}
          required
          error={errors.content}
        />

        <ModernFormInput
          label="Danh mục"
          value={formData.category}
          onChangeText={(value) => updateField("category", value)}
          placeholder="Ví dụ: Khiếu nại, Đề xuất, Báo cáo sự cố"
          icon="category"
          error={errors.category}
        />

        <ModernFormInput
          label="Mức độ ưu tiên"
          value={formData.priority}
          onChangeText={(value) => updateField("priority", value)}
          placeholder="Thấp/Trung bình/Cao/Khẩn cấp"
          icon="priority-high"
          error={errors.priority}
        />

        <ModernFormInput
          label="Trạng thái"
          value={formData.status}
          onChangeText={(value) => updateField("status", value)}
          placeholder="pending/processing/resolved"
          icon="assignment"
          error={errors.status}
        />

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Tạo phản hồi"
            onPress={handleSubmit}
            loading={loading}
            icon="add-comment"
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
