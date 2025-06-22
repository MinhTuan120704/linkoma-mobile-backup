import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import feedbackService from "../../../services/feedbackService";

export default function FeedbackViewScreen({ route, navigation }) {
  const { feedback } = route.params || {};
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = () => {
    navigation.navigate("FeedbackEditScreen", { feedback });
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa phản hồi này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleteLoading(true);
            const response = await feedbackService.deleteFeedback(feedback.id);
            if (response.success) {
              Alert.alert("Thành công", "Xóa phản hồi thành công!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert(
                "Lỗi",
                response.message || "Không thể xóa phản hồi. Vui lòng thử lại."
              );
            }
          } catch (error) {
            console.log("Error deleting feedback:", error);
            Alert.alert("Lỗi", "Không thể xóa phản hồi. Vui lòng thử lại.");
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "highlight";
      case "processing":
        return "warning";
      case "pending":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "resolved":
        return "Đã giải quyết";
      case "processing":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <ModernScreenWrapper
      title="Chi tiết phản hồi"
      subtitle={feedback?.title || "Phản hồi"}
      headerColor="#2C3E50"
      rightHeaderComponent={
        <ModernButton
          title="Sửa"
          onPress={handleEdit}
          type="outline"
          size="small"
        />
      }
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Thông tin phản hồi">
          <InfoRow
            label="Tiêu đề"
            value={feedback?.title}
            icon="title"
            type="highlight"
          />

          <InfoRow
            label="Nội dung"
            value={feedback?.content}
            icon="description"
          />

          <InfoRow
            label="Trạng thái"
            value={getStatusText(feedback?.status)}
            icon="assignment"
            type={getStatusColor(feedback?.status)}
          />

          <InfoRow
            label="Danh mục"
            value={feedback?.category}
            icon="category"
          />

          <InfoRow
            label="Mức độ ưu tiên"
            value={feedback?.priority}
            icon="priority-high"
            type={
              feedback?.priority === "urgent"
                ? "danger"
                : feedback?.priority === "high"
                ? "warning"
                : "default"
            }
          />
        </ModernCard>

        <ModernCard title="Thông tin cư dân">
          <InfoRow
            label="Người gửi"
            value={feedback?.residentName || feedback?.residentId}
            icon="person"
          />

          <InfoRow
            label="Email"
            value={feedback?.residentEmail}
            icon="email"
            copyable
          />

          <InfoRow label="Căn hộ" value={feedback?.apartmentName} icon="home" />
        </ModernCard>

        <ModernCard title="Thời gian">
          <InfoRow
            label="Ngày tạo"
            value={formatDate(feedback?.createdAt)}
            icon="calendar-today"
          />

          <InfoRow
            label="Cập nhật lần cuối"
            value={formatDate(feedback?.updatedAt)}
            icon="update"
          />

          <InfoRow
            label="ID phản hồi"
            value={feedback?.id?.toString()}
            icon="tag"
            copyable
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Chỉnh sửa"
            onPress={handleEdit}
            icon="edit"
            fullWidth
          />

          <ModernButton
            title="Xóa phản hồi"
            onPress={handleDelete}
            type="danger"
            loading={deleteLoading}
            icon="delete"
            fullWidth
          />
        </View>
      </View>
    </ModernScreenWrapper>
  );
}
