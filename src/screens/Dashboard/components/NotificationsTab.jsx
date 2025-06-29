import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { List, Card } from "@ant-design/react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { renderEmptyState, renderStatsCard } from "./AdminSharedComponents";
import { tabStyles } from "./AdminTabStyles";

export default function NotificationsTab({
  notifications = [], // Default to empty array if undefined
  tabs,
  refreshing,
  onRefresh,
  handleCreateNotification,
  handleViewNotification,
  handleEditNotification,
  handleDeleteNotification,
}) {
  // Helper function to get type info
  const getTypeInfo = (type) => {
    switch (type) {
      case "General":
        return { label: "Chung", color: "#6C757D", icon: "info" };
      case "Urgent":
        return { label: "Khẩn cấp", color: "#DC3545", icon: "warning" };
      case "Maintenance":
        return { label: "Bảo trì", color: "#FD7E14", icon: "build" };
      case "Event":
        return { label: "Sự kiện", color: "#20C997", icon: "event" };
      default:
        return { label: "Không xác định", color: "#6C757D", icon: "help" };
    }
  };
  // Helper function to get priority info
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "Low":
        return { label: "Thấp", color: "#28A745", icon: "arrow-downward" };
      case "Medium":
        return { label: "Trung bình", color: "#FFC107", icon: "remove" };
      case "High":
        return { label: "Cao", color: "#FF6B35", icon: "arrow-upward" };
      case "Critical":
        return { label: "Khẩn cấp", color: "#DC3545", icon: "priority-high" };
      default:
        return { label: "Không xác định", color: "#6C757D", icon: "help" };
    }
  };
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Thông báo</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {notifications.length} thông báo
        </Text>

        {/* Stats breakdown */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 8,
          }}
        >
          {/* Type stats */}
          <View style={{ flexDirection: "row", gap: 4 }}>
            <View
              style={{
                backgroundColor: "#DC3545",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                Khẩn cấp:
                {notifications.filter((n) => n.type === "Urgent").length}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#FD7E14",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                Bảo trì:
                {notifications.filter((n) => n.type === "Maintenance").length}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#20C997",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                Sự kiện:
                {notifications.filter((n) => n.type === "Event").length}
              </Text>
            </View>
          </View>

          {/* Priority stats */}
          <View style={{ flexDirection: "row", gap: 4 }}>
            <View
              style={{
                backgroundColor: "#DC3545",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                Ưu tiên cao:
                {
                  notifications.filter(
                    (n) => n.priority === "Critical" || n.priority === "High"
                  ).length
                }
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#FFC107",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                Ưu tiên trung bình:
                {notifications.filter((n) => n.priority === "Medium").length}
              </Text>
            </View>
          </View>
        </View>

        {renderStatsCard(
          "Tổng thông báo",
          notifications.length,
          tabs[4].color,
          "notifications"
        )}
      </Card>
      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: tabs[4].color }]}
          onPress={handleCreateNotification}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm thông báo</Text>
        </TouchableOpacity>
      </View>
      {notifications.length === 0 ? (
        renderEmptyState(
          "Chưa có thông báo nào",
          "Hãy tạo thông báo đầu tiên",
          "notifications_off"
        )
      ) : (
        <Card style={tabStyles.listCard}>
          <List>
            {notifications.map((notification) => {
              const typeInfo = getTypeInfo(notification.type);
              const priorityInfo = getPriorityInfo(notification.priority);

              return (
                <List.Item
                  key={notification.announcementId}
                  extra={
                    <View style={tabStyles.actionButtonsContainer}>
                      <TouchableOpacity
                        style={[tabStyles.actionButton, tabStyles.viewButton]}
                        onPress={() => handleViewNotification(notification)}
                      >
                        <MaterialIcons
                          name="visibility"
                          size={16}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[tabStyles.actionButton, tabStyles.editButton]}
                        onPress={() => handleEditNotification(notification)}
                      >
                        <MaterialIcons name="edit" size={16} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[tabStyles.actionButton, tabStyles.deleteButton]}
                        onPress={() =>
                          handleDeleteNotification(notification.announcementId)
                        }
                      >
                        <MaterialIcons name="delete" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  }
                >
                  <View style={tabStyles.listItemContent}>
                    <MaterialIcons
                      name="notifications"
                      size={18}
                      color={tabs[4].color}
                    />
                    <View style={tabStyles.listItemTextContainer}>
                      <Text style={tabStyles.listItemText}>
                        {notification.title}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 4,
                          gap: 8,
                        }}
                      >
                        {/* Type Badge */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: typeInfo.color,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 8,
                            gap: 2,
                          }}
                        >
                          <MaterialIcons
                            name={typeInfo.icon}
                            size={12}
                            color="#fff"
                          />
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: "500",
                            }}
                          >
                            {typeInfo.label}
                          </Text>
                        </View>

                        {/* Priority Badge */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: priorityInfo.color,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 8,
                            gap: 2,
                          }}
                        >
                          <MaterialIcons
                            name={priorityInfo.icon}
                            size={12}
                            color="#fff"
                          />
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: "500",
                            }}
                          >
                            {priorityInfo.label}
                          </Text>
                        </View>
                      </View>

                      {/* Content preview */}
                      <Text
                        style={[tabStyles.listItemSubText, { marginTop: 4 }]}
                      >
                        {notification.content?.length > 50
                          ? `${notification.content.substring(0, 50)}...`
                          : notification.content}
                      </Text>
                    </View>
                  </View>
                </List.Item>
              );
            })}
          </List>
        </Card>
      )}
    </ScrollView>
  );
}
