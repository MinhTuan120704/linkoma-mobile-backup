import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ModernScreenWrapper, ModernCard } from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import announcementService from "../../../services/announcementService";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export default function ResidentNotificationListScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // TODO: Call API getNotificationsByResident(userId) để lấy danh sách thông báo
      // Hiện tại trả về mảng rỗng để test giao diện
      setNotifications([]);
    } catch (e) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleView = (notification) =>
    navigation.navigate("ResidentNotificationView", { notification });

  const getTypeIcon = (type) => {
    switch (type) {
      case "maintenance":
        return "build";
      case "emergency":
        return "warning";
      case "event":
        return "event";
      case "general":
        return "info";
      default:
        return "notifications";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "maintenance":
        return "#F39C12";
      case "emergency":
        return "#E74C3C";
      case "event":
        return "#9B59B6";
      case "general":
        return "#3498DB";
      default:
        return "#7F8C8D";
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
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const renderEmptyState = () => (
    <ModernCard>
      <View style={styles.emptyState}>
        <MaterialIcons name="notifications-none" size={64} color="#BDC3C7" />
        <Text style={styles.emptyTitle}>Không có thông báo</Text>
        <Text style={styles.emptySubtitle}>
          Bạn chưa có thông báo nào. Thông báo mới sẽ hiển thị ở đây.
        </Text>
      </View>
    </ModernCard>
  );

  const renderNotificationItem = (notification) => (
    <TouchableOpacity
      key={notification.id}
      onPress={() => handleView(notification)}
      activeOpacity={0.8}
    >
      <ModernCard style={{ marginBottom: 12 }}>
        <View style={styles.notificationHeader}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name={getTypeIcon(notification.type)}
              size={24}
              color={getTypeColor(notification.type)}
            />
          </View>

          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle} numberOfLines={2}>
              {notification.title}
            </Text>
            <Text style={styles.notificationMessage} numberOfLines={3}>
              {notification.content}
            </Text>
          </View>

          {notification.priority && notification.priority !== "medium" && (
            <View style={styles.priorityIndicator}>
              <MaterialIcons
                name="priority-high"
                size={20}
                color={getPriorityColor(notification.priority)}
              />
            </View>
          )}
        </View>

        <View style={styles.notificationFooter}>
          <View style={styles.metaInfo}>
            <MaterialIcons name="schedule" size={16} color="#7F8C8D" />
            <Text style={styles.metaText}>
              {formatDate(notification.createdAt)}
            </Text>
          </View>

          <View style={styles.typeChip}>
            <Text
              style={[
                styles.typeText,
                { color: getTypeColor(notification.type) },
              ]}
            >
              {notification.type || "Thông báo"}
            </Text>
          </View>
        </View>

        {!notification.isRead && <View style={styles.unreadIndicator} />}
      </ModernCard>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ModernScreenWrapper
      title="Thông báo"
      subtitle={`${notifications.length} thông báo${
        unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ""
      }`}
      headerColor="#1976D2"
      loading={loading}
      onRefresh={fetchNotifications}
    >
      <View style={{ paddingBottom: 20 }}>
        {!loading && notifications.length === 0
          ? renderEmptyState()
          : notifications.map(renderNotificationItem)}
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
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 6,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  priorityIndicator: {
    marginLeft: 8,
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#7F8C8D",
    marginLeft: 4,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  unreadIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E74C3C",
  },
});
