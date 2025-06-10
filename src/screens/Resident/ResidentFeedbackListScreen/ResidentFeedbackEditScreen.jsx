import React, { useState } from "react";
import { View, Alert, Text } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../components";
import { useNavigation, useRoute } from "@react-navigation/native";
// Import feedbackService để thực hiện chức năng:
// - Cập nhật phản hồi (updateFeedback)

export default function ResidentFeedbackEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { feedback } = route.params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: feedback?.title || "",
    content: feedback?.content || "",
    category: feedback?.category || "",
    priority: feedback?.priority || "medium",
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
      setLoading(true); // TODO: Call API updateFeedback(id, data) để cập nhật phản hồi
      Alert.alert("Thành công", "Cập nhật phản hồi thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.error("Update feedback error:", e);
      Alert.alert("Lỗi", "Không cập nhật được phản hồi. Vui lòng thử lại.");
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
      title="Chỉnh sửa phản hồi"
      subtitle="Cập nhật thông tin phản hồi"
      headerColor="#1976D2"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Nội dung phản hồi">
          <ModernFormInput
            label="Tiêu đề"
            value={formData.title}
            onChangeText={(value) => updateField("title", value)}
            placeholder="Nhập tiêu đề cho phản hồi"
            icon="title"
            error={errors.title}
          />

          <ModernFormInput
            label="Nội dung chi tiết"
            value={formData.content}
            onChangeText={(value) => updateField("content", value)}
            placeholder="Mô tả chi tiết vấn đề hoặc ý kiến của bạn"
            icon="description"
            multiline
            numberOfLines={5}
            error={errors.content}
          />

          <ModernFormInput
            label="Danh mục"
            value={formData.category}
            onChangeText={(value) => updateField("category", value)}
            placeholder="Ví dụ: Khiếu nại, Đề xuất, Báo cáo sự cố"
            icon="category"
          />

          <ModernFormInput
            label="Mức độ ưu tiên"
            value={formData.priority}
            onChangeText={(value) => updateField("priority", value)}
            placeholder="low/medium/high/urgent"
            icon="priority-high"
          />
        </ModernCard>

        <ModernCard title="Thông tin bổ sung">
          <View style={{ paddingVertical: 16 }}>
            <View
              style={{
                backgroundColor: "#FFF3E0",
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#F57C00",
                  lineHeight: 20,
                  fontWeight: "500",
                }}
              >
                ⚠️ Lưu ý khi chỉnh sửa:
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#424242",
                  lineHeight: 20,
                  marginTop: 8,
                }}
              >
                • Chỉ có thể chỉnh sửa phản hồi đang ở trạng thái "Chờ xử lý"
                {"\n"}• Sau khi cập nhật, phản hồi sẽ được xem xét lại
                {"\n"}• Thay đổi mức độ ưu tiên có thể ảnh hưởng đến thời gian
                xử lý
              </Text>
            </View>
          </View>
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Cập nhật phản hồi"
            onPress={handleSubmit}
            loading={loading}
            icon="save"
            fullWidth
          />

          <ModernButton
            title="Hủy thay đổi"
            onPress={() => navigation.goBack()}
            type="outline"
            fullWidth
          />
        </View>
      </View>
    </ModernScreenWrapper>
  );
}
