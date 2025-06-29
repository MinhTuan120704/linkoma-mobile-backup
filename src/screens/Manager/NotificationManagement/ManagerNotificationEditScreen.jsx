import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
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

export default function ManagerNotificationEditScreen({ route, navigation }) {
  const { notification } = route.params || {};
  const [formData, setFormData] = useState({
    title: notification?.title || "",
    content: notification?.content || "",
    type: notification?.type || "General",
    priority: notification?.priority || "Low",
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
      const response = await announcementService.updateAnnouncement(
        notification.announcementId,
        formData
      );
      if (response.success) {
        Alert.alert("Thành công", "Cập nhật thông báo thành công", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Lỗi", response.message || "Không thể cập nhật thông báo");
      }
    } catch (error) {
      console.log("Error updating notification:", error);
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
            const response = await announcementService.deleteAnnouncement(
              notification.announcementId
            );
            if (response.success) {
              Alert.alert("Thành công", "Xóa thông báo thành công", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert("Lỗi", response.message || "Không thể xóa thông báo");
              setLoading(false);
            }
          } catch (error) {
            console.log("Error deleting notification:", error);
            Alert.alert("Lỗi", "Không thể xóa thông báo");
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
          />{" "}
          <ModernPicker
            label="Loại thông báo"
            value={formData.type}
            onValueChange={(value) => updateField("type", value)}
            placeholder="Chọn loại thông báo"
            items={TYPE_OPTIONS}
            icon="category"
          />
          <ModernPicker
            label="Mức độ ưu tiên"
            value={formData.priority}
            onValueChange={(value) => updateField("priority", value)}
            placeholder="Chọn mức độ ưu tiên"
            items={PRIORITY_OPTIONS}
            icon="priority-high"
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
