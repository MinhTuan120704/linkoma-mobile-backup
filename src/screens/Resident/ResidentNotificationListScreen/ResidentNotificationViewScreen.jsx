import React from "react";
import { View } from "react-native";
import { ModernScreenWrapper, ModernCard, InfoRow } from "../../../components";
import { useRoute } from "@react-navigation/native";

export default function ResidentNotificationViewScreen() {
  const route = useRoute();
  const { notification } = route.params;

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getTypeText = (type) => {
    switch (type) {
      case "maintenance":
        return "Bảo trì";
      case "emergency":
        return "Khẩn cấp";
      case "event":
        return "Sự kiện";
      case "general":
        return "Thông báo chung";
      default:
        return "Thông báo";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "maintenance":
        return "warning";
      case "emergency":
        return "danger";
      case "event":
        return "highlight";
      case "general":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "urgent":
        return "Khẩn cấp";
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Không xác định";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "danger";
      case "high":
        return "warning";
      case "medium":
        return "default";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  if (!notification) {
    return (
      <ModernScreenWrapper
        title="Chi tiết thông báo"
        subtitle="Thông tin không tồn tại"
        headerColor="#1976D2"
      >
        <ModernCard>
          <InfoRow
            label="Thông báo"
            value="Thông báo không tồn tại hoặc đã bị xóa"
            icon="error"
            type="warning"
          />
        </ModernCard>
      </ModernScreenWrapper>
    );
  }

  return (
    <ModernScreenWrapper
      title="Chi tiết thông báo"
      subtitle={notification.title}
      headerColor="#1976D2"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Nội dung thông báo">
          <InfoRow
            label="Tiêu đề"
            value={notification.title}
            icon="title"
            type="highlight"
          />

          <InfoRow
            label="Nội dung"
            value={notification.content}
            icon="description"
          />

          <InfoRow
            label="Loại thông báo"
            value={getTypeText(notification.type)}
            icon="notifications"
            type={getTypeColor(notification.type)}
          />

          {notification.priority && (
            <InfoRow
              label="Mức độ ưu tiên"
              value={getPriorityText(notification.priority)}
              icon="priority_high"
              type={getPriorityColor(notification.priority)}
            />
          )}
        </ModernCard>

        <ModernCard title="Thông tin gửi">
          <InfoRow
            label="Ngày gửi"
            value={formatDate(notification.createdAt)}
            icon="send"
          />

          <InfoRow
            label="Người gửi"
            value={notification.sender || "Quản trị viên"}
            icon="person"
          />

          <InfoRow
            label="Trạng thái"
            value={notification.isRead ? "Đã đọc" : "Chưa đọc"}
            icon={notification.isRead ? "mark_email_read" : "mark_email_unread"}
            type={notification.isRead ? "highlight" : "warning"}
          />
        </ModernCard>

        {notification.attachments && notification.attachments.length > 0 && (
          <ModernCard title="Tệp đính kèm">
            {notification.attachments.map((attachment, index) => (
              <InfoRow
                key={index}
                label={`Tệp ${index + 1}`}
                value={attachment.name || `attachment_${index + 1}`}
                icon="attachment"
                copyable
              />
            ))}
          </ModernCard>
        )}
      </View>
    </ModernScreenWrapper>
  );
}
