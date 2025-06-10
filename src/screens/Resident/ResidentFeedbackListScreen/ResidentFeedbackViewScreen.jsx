import React from "react";
import { View } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function ResidentFeedbackViewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { feedback } = route.params;

  const handleEdit = () => {
    navigation.navigate("ResidentFeedbackEdit", { feedback });
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
      subtitle="Thông tin phản hồi của tôi"
      headerColor="#1976D2"
      rightHeaderComponent={
        feedback?.status === "pending" && (
          <ModernButton
            title="Sửa"
            onPress={handleEdit}
            type="outline"
            size="small"
          />
        )
      }
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Nội dung phản hồi">
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

        <ModernCard title="Trạng thái xử lý">
          <InfoRow
            label="Trạng thái hiện tại"
            value={getStatusText(feedback?.status)}
            icon="assignment"
            type={getStatusColor(feedback?.status)}
          />

          <InfoRow
            label="Phản hồi từ admin"
            value={feedback?.adminResponse || "Chưa có phản hồi"}
            icon="admin-panel-settings"
          />

          <InfoRow
            label="Người xử lý"
            value={feedback?.assignedTo || "Chưa được phân công"}
            icon="person"
          />
        </ModernCard>

        <ModernCard title="Thời gian">
          <InfoRow
            label="Ngày gửi"
            value={formatDate(feedback?.createdAt)}
            icon="send"
          />

          <InfoRow
            label="Cập nhật lần cuối"
            value={formatDate(feedback?.updatedAt)}
            icon="update"
          />

          <InfoRow
            label="Ngày hoàn thành"
            value={
              feedback?.completedAt
                ? formatDate(feedback.completedAt)
                : "Chưa hoàn thành"
            }
            icon="check-circle"
            type={feedback?.completedAt ? "highlight" : "default"}
          />
        </ModernCard>

        {feedback?.status === "pending" && (
          <View style={{ marginTop: 20 }}>
            <ModernButton
              title="Chỉnh sửa phản hồi"
              onPress={handleEdit}
              icon="edit"
              fullWidth
            />
          </View>
        )}
      </View>
    </ModernScreenWrapper>
  );
}
