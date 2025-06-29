import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { ModernScreenWrapper, ModernCard, InfoRow } from "../../../components";
import { useRoute } from "@react-navigation/native";
import announcementService from "../../../services/announcementService";

export default function ResidentNotificationViewScreen() {
  const route = useRoute();
  const { notification: passedNotification, announcementId } = route.params;
  const [notification, setNotification] = useState(passedNotification);
  const [loading, setLoading] = useState(false);

  // Fetch full notification details if we only have the ID
  useEffect(() => {
    const fetchNotificationDetails = async () => {
      if (announcementId && (!notification || !notification.content)) {
        setLoading(true);
        try {
          const response = await announcementService.getAnnouncementById(
            announcementId
          );
          if (response.success && response.data) {
            setNotification(response.data);
          }
        } catch (error) {
          console.log("Error fetching notification details:", error);
          Alert.alert("Lỗi", "Không thể tải chi tiết thông báo");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotificationDetails();
  }, [announcementId, notification]);

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  const getTypeText = (type) => {
    switch (type?.toLowerCase()) {
      case "maintenance":
        return "Bảo trì";
      case "urgent":
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
    switch (type?.toLowerCase()) {
      case "maintenance":
        return "warning";
      case "urgent":
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
    switch (priority?.toLowerCase()) {
      case "critical":
        return "Cực kỳ quan trọng";
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
    switch (priority?.toLowerCase()) {
      case "critical":
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
      subtitle={notification?.title || "Đang tải..."}
      headerColor="#1976D2"
      loading={loading}
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Nội dung thông báo">
          <InfoRow
            label="Tiêu đề"
            value={notification?.title || "Không có tiêu đề"}
            icon="title"
            type="highlight"
          />

          <InfoRow
            label="Nội dung"
            value={notification?.content || "Không có nội dung"}
            icon="description"
            style={{ height: "fit-content", flex: 1, textAlignVertical: "top" }}
          />

          <InfoRow
            label="Loại thông báo"
            value={getTypeText(notification?.type)}
            icon="notifications"
            type={getTypeColor(notification?.type)}
          />

          {notification?.priority && (
            <InfoRow
              label="Mức độ ưu tiên"
              value={getPriorityText(notification.priority)}
              icon="priority-high"
              type={getPriorityColor(notification.priority)}
            />
          )}
        </ModernCard>

        <ModernCard title="Thông tin gửi">
          <InfoRow
            label="Ngày tạo"
            value={formatDate(notification?.createdAt)}
            icon="event"
          />

          {notification?.updatedAt &&
            notification.updatedAt !== notification.createdAt && (
              <InfoRow
                label="Cập nhật lần cuối"
                value={formatDate(notification.updatedAt)}
                icon="update"
              />
            )}

          <InfoRow
            label="Người tạo"
            value={notification?.author || "Quản trị viên"}
            icon="person"
          />

          <InfoRow
            label="ID thông báo"
            value={notification?.announcementId?.toString() || "N/A"}
            icon="fingerprint"
            copyable
          />
        </ModernCard>

        {/* Additional details if available */}
        {(notification?.description || notification?.details) && (
          <ModernCard title="Chi tiết bổ sung">
            <InfoRow
              label="Mô tả chi tiết"
              value={notification.description || notification.details}
              icon="info"
            />
          </ModernCard>
        )}
      </View>
    </ModernScreenWrapper>
  );
}
