import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
import notificationService from "../../../services/notificationService";

export default function NotificationEditScreen({ route, navigation }) {
  const { notification } = route.params || {};

  const [formData, setFormData] = useState({
    title: notification?.title || "",
    content: notification?.content || "",
    type: notification?.type || "general",
    priority: notification?.priority || "normal",
    scheduledTime: notification?.scheduledTime || "",
    targetAudience: notification?.targetAudience || "all",
    status: notification?.status || "draft",
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
      await notificationService.updateNotification(notification.id, formData);
      Alert.alert("Thành công", "Cập nhật thông báo thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating notification:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa thông báo này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await notificationService.deleteNotification(notification.id);
            Alert.alert("Thành công", "Xóa thông báo thành công", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            console.error("Error deleting notification:", error);
            Alert.alert("Lỗi", "Không thể xóa thông báo");
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
      title="Chỉnh sửa thông báo"
      subtitle="Cập nhật thông tin thông báo"
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin thông báo">
          <ModernFormInput
            label="Tiêu đề"
            value={formData.title}
            onChangeText={(value) => updateField("title", value)}
            placeholder="Nhập tiêu đề thông báo"
            icon="title"
            error={errors.title}
          />

          <ModernFormInput
            label="Nội dung"
            value={formData.content}
            onChangeText={(value) => updateField("content", value)}
            placeholder="Nhập nội dung thông báo"
            icon="description"
            multiline
            numberOfLines={6}
            error={errors.content}
          />

          <ModernFormInput
            label="Loại thông báo"
            value={formData.type}
            onChangeText={(value) => updateField("type", value)}
            placeholder="general/urgent/maintenance/event"
            icon="category"
          />

          <ModernFormInput
            label="Mức độ ưu tiên"
            value={formData.priority}
            onChangeText={(value) => updateField("priority", value)}
            placeholder="low/normal/high/urgent"
            icon="priority-high"
          />
        </ModernCard>

        <ModernCard title="Cài đặt gửi">
          <ModernFormInput
            label="Thời gian gửi"
            value={formData.scheduledTime}
            onChangeText={(value) => updateField("scheduledTime", value)}
            placeholder="DD/MM/YYYY HH:mm hoặc để trống để gửi ngay"
            icon="schedule"
          />

          <ModernFormInput
            label="Đối tượng nhận"
            value={formData.targetAudience}
            onChangeText={(value) => updateField("targetAudience", value)}
            placeholder="all/residents/staff"
            icon="people"
          />

          <ModernFormInput
            label="Trạng thái"
            value={formData.status}
            onChangeText={(value) => updateField("status", value)}
            placeholder="draft/scheduled/sent"
            icon="info"
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Cập nhật thông báo"
            onPress={handleUpdate}
            loading={loading}
            icon="save"
          />

          <ModernButton
            title="Xóa thông báo"
            onPress={handleDelete}
            variant="danger"
            icon="delete"
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
