import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import feedbackService from "../../../services/feedbackService";
import userService from "../../../services/userService";

export default function FeedbackViewScreen({ route, navigation }) {
  const { feedback } = route.params || {};
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  const handleEdit = () => {
    navigation.navigate("FeedbackEdit", { feedback });
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
            const response = await feedbackService.deleteFeedback(
              feedback.feedbackId
            );
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
      case "Resolved":
        return "highlight";
      case "In Progress":
        return "warning";
      case "Pending":
        return "danger";
      case "Rejected":
        return "default";
      default:
        return "default";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "Resolved":
        return "Đã giải quyết";
      case "In Progress":
        return "Đang xử lý";
      case "Pending":
        return "Chờ xử lý";
      case "Rejected":
        return "Đã từ chối";
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
      subtitle={`Feedback ID: ${feedback?.feedbackId || ""}`}
      headerColor="#2C3E50"
      rightHeaderComponent={
        <ModernButton
          title="Sửa"
          onPress={handleEdit}
          type="secondary"
          size="small"
        />
      }
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Thông tin người gửi">
          <InfoRow
            label="Người gửi"
            value={
              loadingUser ? "Đang tải..." : userInfo?.name || "Không có dữ liệu"
            }
            icon="person"
            type="highlight"
          />

          <InfoRow
            label="Email"
            value={
              loadingUser
                ? "Đang tải..."
                : userInfo?.email || "Không có dữ liệu"
            }
            icon="email"
            copyable
          />

          <InfoRow
            label="Số điện thoại"
            value={
              loadingUser
                ? "Đang tải..."
                : userInfo?.phoneNumber || "Không có dữ liệu"
            }
            icon="phone"
          />

          <InfoRow
            label="Căn hộ"
            value={
              loadingUser
                ? "Đang tải..."
                : userInfo?.apartmentId
                ? `Phòng số ${userInfo.apartmentId}`
                : "Không có dữ liệu"
            }
            icon="home"
          />
        </ModernCard>
        <ModernCard title="Thông tin phản hồi">
          <InfoRow
            label="Danh mục"
            value={feedback?.category || "Không có dữ liệu"}
            icon="category"
          />

          <InfoRow
            label="Mô tả"
            value={feedback?.description || "Không có dữ liệu"}
            icon="description"
          />

          <InfoRow
            label="Trạng thái"
            value={getStatusText(feedback?.status)}
            icon="assignment"
            type={getStatusColor(feedback?.status)}
          />

          <InfoRow
            label="Phản hồi Admin"
            value={feedback?.response || "Chưa có phản hồi"}
            icon="admin-panel-settings"
          />
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
            label="Ngày phản hồi"
            value={formatDate(feedback?.responseDate)}
            icon="schedule"
          />
          <InfoRow
            label="ID phản hồi"
            value={feedback?.feedbackId?.toString() || "Không có dữ liệu"}
            icon="tag"
            type="secondary"
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
