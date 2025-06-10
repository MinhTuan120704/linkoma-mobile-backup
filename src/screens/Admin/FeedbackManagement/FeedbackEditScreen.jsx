import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
import feedbackService from "../../../services/feedbackService";

export default function FeedbackEditScreen({ route, navigation }) {
  const { feedback } = route.params || {};

  const [formData, setFormData] = useState({
    title: feedback?.title || "",
    content: feedback?.content || "",
    category: feedback?.category || "",
    priority: feedback?.priority || "medium",
    status: feedback?.status || "pending",
    adminResponse: feedback?.adminResponse || "",
    resolution: feedback?.resolution || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung không được để trống";
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
      await feedbackService.updateFeedback(feedback.id, formData);
      Alert.alert("Thành công", "Cập nhật phản hồi thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating feedback:", error);
      Alert.alert("Lỗi", "Không thể cập nhật phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa phản hồi này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await feedbackService.deleteFeedback(feedback.id);
            Alert.alert("Thành công", "Xóa phản hồi thành công", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            console.error("Error deleting feedback:", error);
            Alert.alert("Lỗi", "Không thể xóa phản hồi");
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
      title="Chỉnh sửa phản hồi"
      subtitle="Cập nhật thông tin phản hồi"
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin phản hồi">
          <ModernFormInput
            label="Tiêu đề"
            value={formData.title}
            onChangeText={(value) => updateField("title", value)}
            placeholder="Nhập tiêu đề phản hồi"
            icon="title"
            error={errors.title}
          />

          <ModernFormInput
            label="Nội dung"
            value={formData.content}
            onChangeText={(value) => updateField("content", value)}
            placeholder="Nhập nội dung phản hồi"
            icon="description"
            multiline
            numberOfLines={4}
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

          <ModernFormInput
            label="Trạng thái"
            value={formData.status}
            onChangeText={(value) => updateField("status", value)}
            placeholder="pending/in-progress/resolved/closed"
            icon="info"
          />
        </ModernCard>

        <ModernCard title="Phản hồi của Admin">
          <ModernFormInput
            label="Phản hồi Admin"
            value={formData.adminResponse}
            onChangeText={(value) => updateField("adminResponse", value)}
            placeholder="Nhập phản hồi từ admin"
            icon="admin-panel-settings"
            multiline
            numberOfLines={4}
          />

          <ModernFormInput
            label="Giải pháp"
            value={formData.resolution}
            onChangeText={(value) => updateField("resolution", value)}
            placeholder="Mô tả giải pháp đã thực hiện"
            icon="check-circle"
            multiline
            numberOfLines={3}
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Cập nhật phản hồi"
            onPress={handleUpdate}
            loading={loading}
            icon="save"
          />

          <ModernButton
            title="Xóa phản hồi"
            onPress={handleDelete}
            variant="danger"
            icon="delete"
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
