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
  notifications,
  tabs,
  refreshing,
  onRefresh,
  handleCreateNotification,
  handleViewNotification,
  handleEditNotification,
  handleDeleteNotification,
}) {
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
          "notifications"
        )
      ) : (
        <Card style={tabStyles.listCard}>
          <List>
            {notifications.map((notification) => (
              <List.Item
                key={notification.id}
                extra={
                  <View style={tabStyles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.viewButton]}
                      onPress={() => handleViewNotification(notification)}
                    >
                      <MaterialIcons name="visibility" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.editButton]}
                      onPress={() => handleEditNotification(notification)}
                    >
                      <MaterialIcons name="edit" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.deleteButton]}
                      onPress={() => handleDeleteNotification(notification.id)}
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
                  <Text style={tabStyles.listItemText}>
                    {notification.title}
                  </Text>
                </View>
              </List.Item>
            ))}
          </List>
        </Card>
      )}
    </ScrollView>
  );
}
