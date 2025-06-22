import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import announcementService from "../../../services/announcementService";

export default function NotificationViewScreen({ route, navigation }) {
  const { notificationId } = route.params || {};
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotification = async () => {
    if (!notificationId) return;
    setLoading(true);
    try {
      const response = await announcementService.getAnnouncementById(
        notificationId
      );
      if (response.success) {
        setNotification(response.data);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tải thông tin thông báo"
        );
      }
    } catch (error) {
      console.log("Error fetching notification:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [notificationId]);

  const handleEdit = () => {
    navigation.navigate("NotificationEditScreen", { notification });
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await announcementService.deleteAnnouncement(
                notificationId
              );
              if (response.success) {
                Alert.alert("Thành công", "Xóa thông báo thành công", [
                  { text: "OK", onPress: () => navigation.goBack() },
                ]);
              } else {
                Alert.alert(
                  "Lỗi",
                  response.message || "Không thể xóa thông báo"
                );
                setLoading(false);
              }
            } catch (error) {
              console.log("Error deleting notification:", error);
              Alert.alert("Lỗi", "Không thể xóa thông báo");
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "highlight";
      case "scheduled":
        return "warning";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "sent":
        return "Đã gửi";
      case "scheduled":
        return "Đã lên lịch";
      case "draft":
        return "Bản nháp";
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
      case "normal":
        return "default";
      case "low":
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
      case "normal":
        return "Bình thường";
      case "low":
        return "Thấp";
      default:
        return "Không xác định";
    }
  };

  if (!notification && !loading) {
    return (
      <ModernScreenWrapper
        title="Chi tiết thông báo"
        subtitle="Thông tin không tồn tại"
        headerColor="#2C3E50"
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
      subtitle="Thông tin chi tiết thông báo"
      headerColor="#2C3E50"
      loading={loading}
      onRefresh={fetchNotification}
    >
      {notification && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ModernCard title="Thông tin thông báo">
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
              value={notification.type || "Chung"}
              icon="category"
            />

            <InfoRow
              label="Mức độ ưu tiên"
              value={getPriorityText(notification.priority)}
              icon="priority-high"
              type={getPriorityColor(notification.priority)}
            />
          </ModernCard>

          <ModernCard title="Trạng thái và lịch trình">
            <InfoRow
              label="Trạng thái"
              value={getStatusText(notification.status)}
              icon="info"
              type={getStatusColor(notification.status)}
            />

            <InfoRow
              label="Đối tượng nhận"
              value={
                notification.targetAudience === "all"
                  ? "Tất cả"
                  : notification.targetAudience === "residents"
                  ? "Cư dân"
                  : notification.targetAudience === "staff"
                  ? "Nhân viên"
                  : "Không xác định"
              }
              icon="people"
            />

            <InfoRow
              label="Thời gian tạo"
              value={formatDate(notification.createdAt)}
              icon="calendar-today"
            />

            {notification.scheduledTime && (
              <InfoRow
                label="Thời gian lên lịch"
                value={formatDate(notification.scheduledTime)}
                icon="schedule"
              />
            )}

            {notification.sentAt && (
              <InfoRow
                label="Thời gian gửi"
                value={formatDate(notification.sentAt)}
                icon="send"
                type="highlight"
              />
            )}
          </ModernCard>

          <ModernCard title="Thông tin hệ thống">
            <InfoRow
              label="Người tạo"
              value={notification.createdBy || "Hệ thống"}
              icon="person-add"
            />

            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDate(notification.updatedAt)}
              icon="update"
            />

            <InfoRow
              label="ID thông báo"
              value={notification.id?.toString()}
              icon="fingerprint"
              copyable
            />
          </ModernCard>

          <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
            <ModernButton
              title="Chỉnh sửa thông báo"
              onPress={handleEdit}
              icon="edit"
            />

            <ModernButton
              title="Xóa thông báo"
              onPress={handleDelete}
              variant="danger"
              icon="delete"
            />
          </View>
        </ScrollView>
      )}
    </ModernScreenWrapper>
  );
}
