import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  ModernButton,
} from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import feedbackService from "../../../services/feedbackService";
// Import feedbackService để thực hiện các chức năng:
// - Lấy danh sách phản hồi theo resident (getFeedbacksByResident)
// - Tạo phản hồi mới (createFeedback)
// - Cập nhật phản hồi (updateFeedback)
// - Xóa phản hồi (removeFeedback)
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function ResidentFeedbackListScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    if (!user) return setLoading(false);
    setLoading(true);
    try {
      const data = await feedbackService.getFeedbacksByResident(user.userId);
      setFeedbacks(data || []);
    } catch (e) {
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [user]);

  const handleCreate = () => navigation.navigate("ResidentFeedbackCreate");
  const handleView = (feedback) =>
    navigation.navigate("ResidentFeedbackView", { feedback });
  const handleEdit = (feedback) =>
    navigation.navigate("ResidentFeedbackEdit", { feedback });

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "#27AE60";
      case "processing":
        return "#F39C12";
      case "pending":
        return "#E74C3C";
      default:
        return "#7F8C8D";
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "#E74C3C";
      case "high":
        return "#F39C12";
      case "medium":
        return "#3498DB";
      case "low":
        return "#95A5A6";
      default:
        return "#7F8C8D";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const renderEmptyState = () => (
    <ModernCard>
      <View style={styles.emptyState}>
        <MaterialIcons name="feedback" size={64} color="#BDC3C7" />
        <Text style={styles.emptyTitle}>Chưa có phản hồi</Text>
        <Text style={styles.emptySubtitle}>
          Bạn chưa gửi phản hồi nào. Hãy gửi phản hồi đầu tiên!
        </Text>
        <ModernButton
          title="Gửi phản hồi mới"
          onPress={handleCreate}
          icon="add-comment"
          style={{ marginTop: 16 }}
        />
      </View>
    </ModernCard>
  );

  const renderFeedbackItem = (feedback) => (
    <TouchableOpacity
      key={feedback.id}
      onPress={() => handleView(feedback)}
      activeOpacity={0.8}
    >
      <ModernCard style={{ marginBottom: 12 }}>
        <View style={styles.feedbackHeader}>
          <Text style={styles.feedbackTitle} numberOfLines={2}>
            {feedback.title}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(feedback.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(feedback.status)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.feedbackContent} numberOfLines={3}>
          {feedback.content}
        </Text>

        <View style={styles.feedbackFooter}>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={16} color="#7F8C8D" />
              <Text style={styles.metaText}>
                {formatDate(feedback.createdAt)}
              </Text>
            </View>

            {feedback.priority && (
              <View style={styles.metaItem}>
                <MaterialIcons
                  name="priority-high"
                  size={16}
                  color={getPriorityColor(feedback.priority)}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: getPriorityColor(feedback.priority) },
                  ]}
                >
                  {feedback.priority}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(feedback)}
            >
              <MaterialIcons name="edit" size={20} color="#3498DB" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleView(feedback)}
            >
              <MaterialIcons name="visibility" size={20} color="#2C3E50" />
            </TouchableOpacity>
          </View>
        </View>
      </ModernCard>
    </TouchableOpacity>
  );

  return (
    <ModernScreenWrapper
      title="Phản hồi của tôi"
      subtitle={`${feedbacks.length} phản hồi`}
      headerColor="#1976D2"
      loading={loading}
      onRefresh={fetchFeedbacks}
      rightHeaderComponent={
        <ModernButton
          title="Tạo"
          onPress={handleCreate}
          type="outline"
          size="small"
        />
      }
    >
      <View style={{ paddingBottom: 20 }}>
        {!loading && feedbacks.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <ModernButton
              title="Gửi phản hồi mới"
              onPress={handleCreate}
              icon="add-comment"
              fullWidth
              style={{ marginBottom: 20 }}
            />

            {feedbacks.map(renderFeedbackItem)}
          </>
        )}
      </View>
    </ModernScreenWrapper>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 24,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  feedbackTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginRight: 12,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  feedbackContent: {
    fontSize: 16,
    color: "#7F8C8D",
    lineHeight: 22,
    marginBottom: 16,
  },
  feedbackFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaInfo: {
    flexDirection: "row",
    flex: 1,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
