import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
  ModernPicker,
} from "../../../components";
import feedbackService from "../../../services/feedbackService";
import userService from "../../../services/userService";

export default function FeedbackEditScreen({ route, navigation }) {
  const { feedback } = route.params || {};

  const [formData, setFormData] = useState({
    category: feedback?.category || "",
    description: feedback?.description || "",
    status: feedback?.status || "Pending",
    response: feedback?.response || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (feedback?.userId) {
      loadUserInfo();
    }
  }, [feedback]);

  const loadUserInfo = async () => {
    try {
      setLoadingUser(true);
      const response = await userService.getUserById(feedback.userId);

      if (response.success) {
        setUserInfo(response.data);
      } else {
        console.log("Error loading user info:", response.message);
      }
    } catch (error) {
      console.log("Error loading user info:", error);
    } finally {
      setLoadingUser(false);
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Danh mục không được để trống";
    }

    if (!formData.status.trim()) {
      newErrors.status = "Trạng thái không được để trống";
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
      const response = await feedbackService.updateFeedback(
        feedback.feedbackId,
        formData
      );
      if (response.success) {
        Alert.alert("Thành công", "Cập nhật phản hồi thành công", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Lỗi", response.message || "Không thể cập nhật phản hồi");
      }
    } catch (error) {
      console.log("Error updating feedback:", error);
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
            const response = await feedbackService.deleteFeedback(
              feedback.feedbackId
            );
            if (response.success) {
              Alert.alert("Thành công", "Xóa phản hồi thành công", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert("Lỗi", response.message || "Không thể xóa phản hồi");
              setLoading(false);
            }
          } catch (error) {
            console.log("Error deleting feedback:", error);
            Alert.alert("Lỗi", "Không thể xóa phản hồi");
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
      subtitle={`Feedback ID: ${feedback?.feedbackId || ""}`}
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin người gửi">
          <ModernFormInput
            label="Tên người gửi"
            value={
              loadingUser ? "Đang tải..." : userInfo?.name || "Không có dữ liệu"
            }
            icon="person"
            editable={false}
            disabled
          />

          <ModernFormInput
            label="Email"
            value={
              loadingUser
                ? "Đang tải..."
                : userInfo?.email || "Không có dữ liệu"
            }
            icon="email"
            editable={false}
            disabled
          />

          <ModernFormInput
            label="Số điện thoại"
            value={
              loadingUser
                ? "Đang tải..."
                : userInfo?.phoneNumber || "Không có dữ liệu"
            }
            icon="phone"
            editable={false}
            disabled
          />
        </ModernCard>

        <ModernCard title="Thông tin phản hồi">
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
              { label: "Đã từ chối", value: "Rejected" },
            ]}
            placeholder="Chọn trạng thái"
            icon="info"
            required
            error={errors.status}
          />
        </ModernCard>

        <ModernCard title="Phản hồi của Admin">
          <ModernFormInput
            label="Phản hồi"
            value={formData.response}
            onChangeText={(value) => updateField("response", value)}
            placeholder="Nhập phản hồi từ admin"
            icon="admin-panel-settings"
            multiline
            numberOfLines={4}
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Cập nhật phản hồi"
            onPress={handleUpdate}
            loading={loading}
            icon="save"
            fullWidth
          />

          <ModernButton
            title="Xóa phản hồi"
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
