import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  ModernButton,
  ModernPicker,
} from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import announcementService from "../../../services/announcementService";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export default function ResidentNotificationListScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 10,
  });
  const [params, setParams] = useState({
    type: null, // General, Urgent, Maintenance, Event
    sortBy: "createdAt:desc",
    limit: 10,
    page: 1,
  });
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user?.userId) return setLoading(false);
    setLoading(true);
    try {
      // Use announcements API to get notifications for the user
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append("type", params.type);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.page) queryParams.append("page", params.page);

      const response = await announcementService.getAllAnnouncements(
        queryParams
      );
      console.log("Notifications response:", response);

      if (response.success && response.data) {
        // Handle both paginated and direct array responses
        if (response.data.results) {
          setNotifications(response.data.results || []);
          setPagination({
            page: response.data.page || 1,
            totalPages: response.data.totalPages || 1,
            totalResults: response.data.totalResults || 0,
            limit: response.data.limit || 10,
          });
        } else if (Array.isArray(response.data)) {
          setNotifications(response.data);
          setPagination({
            page: 1,
            totalPages: 1,
            totalResults: response.data.length,
            limit: response.data.length,
          });
        } else {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
        setPagination({
          page: 1,
          totalPages: 1,
          totalResults: 0,
          limit: 10,
        });
      }
    } catch (e) {
      console.error("Error fetching notifications:", e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, params]);

  // Filter and pagination handlers
  const handleFilterChange = (filterName, value) => {
    setParams((prev) => ({ ...prev, [filterName]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (newLimit) => {
    setParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleView = (notification) =>
    navigation.navigate("ResidentNotificationView", {
      notification,
      announcementId: notification.announcementId || notification.id,
    });
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "maintenance":
        return "build";
      case "urgent":
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
    switch (type?.toLowerCase()) {
      case "maintenance":
        return "#F39C12";
      case "urgent":
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
    switch (priority?.toLowerCase()) {
      case "critical":
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
      key={notification.announcementId || notification.id}
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

          {/* {notification.priority &&
            notification.priority.toLowerCase() !== "medium" && (
              <View style={styles.priorityIndicator}>
                <MaterialIcons
                  name="priority-high"
                  size={20}
                  color={getPriorityColor(notification.priority)}
                />
              </View>
            )} */}
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
      subtitle={`${pagination.totalResults} thông báo${
        unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ""
      }`}
      headerColor="#1976D2"
      loading={loading}
      onRefresh={fetchNotifications}
    >
      <View style={{ paddingBottom: 20 }}>
        {/* Filter Controls */}
        <ModernCard style={styles.filterCard}>
          <View style={styles.filterRow}>
            <ModernPicker
              label="Loại thông báo"
              value={params.type}
              onValueChange={(value) => handleFilterChange("type", value)}
              items={[
                { label: "Tất cả", value: null },
                { label: "Thông báo chung", value: "General" },
                { label: "Khẩn cấp", value: "Urgent" },
                { label: "Bảo trì", value: "Maintenance" },
                { label: "Sự kiện", value: "Event" },
              ]}
              placeholder="Chọn loại thông báo"
              icon="filter-list"
            />
          </View>

          <View style={styles.filterRow}>
            <ModernPicker
              label="Sắp xếp theo"
              value={params.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
              items={[
                { label: "Mới nhất", value: "createdAt:desc" },
                { label: "Cũ nhất", value: "createdAt:asc" },
                { label: "Tiêu đề A-Z", value: "title:asc" },
                { label: "Tiêu đề Z-A", value: "title:desc" },
              ]}
              placeholder="Chọn cách sắp xếp"
              icon="sort"
            />
          </View>
        </ModernCard>

        {!loading && notifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {notifications.map(renderNotificationItem)}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <ModernButton
                  title="Trước"
                  onPress={() => handlePageChange(params.page - 1)}
                  disabled={params.page <= 1}
                  type="secondary"
                  size="small"
                />
                <Text style={styles.paginationText}>
                  Trang {params.page} / {pagination.totalPages}
                </Text>
                <ModernButton
                  title="Sau"
                  onPress={() => handlePageChange(params.page + 1)}
                  disabled={params.page >= pagination.totalPages}
                  type="secondary"
                  size="small"
                />
              </View>
            )}

            {/* Items per page selector */}
            <View style={styles.limitContainer}>
              <Text style={styles.limitText}>Số lượng mỗi trang:</Text>
              <ModernPicker
                value={params.limit.toString()}
                onValueChange={(value) => handleLimitChange(parseInt(value))}
                items={[
                  { label: "10 thông báo", value: "10" },
                  { label: "20 thông báo", value: "20" },
                  { label: "50 thông báo", value: "50" },
                ]}
                placeholder="Số lượng hiển thị"
                icon="format-list-numbered"
                style={styles.limitPicker}
              />
            </View>
          </>
        )}
      </View>
    </ModernScreenWrapper>
  );
}

const styles = StyleSheet.create({
  filterCard: {
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },
  paginationText: {
    fontSize: 14,
    color: "#2C3E50",
  },
  limitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 12,
    gap: 8,
  },
  limitText: {
    fontSize: 14,
    color: "#2C3E50",
  },
  limitPicker: {
    width: 150,
    height: 40,
  },
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
