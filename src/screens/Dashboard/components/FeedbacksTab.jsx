import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { renderEmptyState, renderStatsCard } from "./AdminSharedComponents";
import { tabStyles } from "./AdminTabStyles";

export default function FeedbacksTab({
  feedbacks = [], // Default to empty array if undefined
  tabs,
  refreshing,
  onRefresh,
  handleCreateFeedback,
  handleViewFeedback,
  handleEditFeedback,
  handleDeleteFeedback,
}) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#FF9800"; // Orange
      case "in progress":
        return "#2196F3"; // Blue
      case "resolved":
        return "#4CAF50"; // Green
      case "rejected":
        return "#F44336"; // Red
      default:
        return "#9E9E9E"; // Grey
    }
  };
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Đang chờ";
      case "in progress":
        return "Đang xử lý";
      case "resolved":
        return "Đã giải quyết";
      case "rejected":
        return "Đã từ chối";
      default:
        return status || "Không xác định";
    }
  };
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Phản hồi</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {(feedbacks || []).length} phản hồi
        </Text>
        {renderStatsCard(
          "Tổng phản hồi",
          (feedbacks || []).length,
          tabs[2].color,
          "chat-bubble"
        )}
      </View>
      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: tabs[2].color }]}
          onPress={handleCreateFeedback}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm phản hồi</Text>
        </TouchableOpacity>
      </View>
      {(feedbacks || []).length === 0 ? (
        renderEmptyState(
          "Chưa có phản hồi nào",
          "Chưa có phản hồi từ cư dân",
          "feedback"
        )
      ) : (
        <View style={tabStyles.listCard}>
          <View>
            {(feedbacks || []).map((feedback) => (
              <View
                key={feedback.feedbackId}
                style={[
                  tabStyles.listItem,
                  {
                    flexDirection: "column",
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: getStatusColor(feedback.status),
                    marginBottom: 8,
                  },
                ]}
              >
                <View style={{ width: "100%", marginBottom: 12 }}>
                  <View
                    key={`content-${feedback.feedbackId}`}
                    style={[
                      tabStyles.listItemContent,
                      {
                        alignItems: "flex-start",
                        width: "100%",
                        flexDirection: "column",
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                        width: "100%",
                      }}
                    >
                      <MaterialIcons
                        key={`icon-${feedback.feedbackId}`}
                        name="chat-bubble"
                        size={18}
                        color={getStatusColor(feedback.status)}
                        style={{ marginRight: 8, flexShrink: 0 }}
                      />
                      <Text
                        key={`category-${feedback.feedbackId}`}
                        style={[
                          tabStyles.listItemText,
                          { fontWeight: "600", flex: 1, flexWrap: "wrap" },
                        ]}
                        numberOfLines={2}
                      >
                        {feedback.category}
                      </Text>
                    </View>

                    <Text
                      style={[
                        tabStyles.listItemText,
                        {
                          fontSize: 14,
                          color: "#666",
                          marginBottom: 8,
                          lineHeight: 20,
                          width: "100%",
                          flexWrap: "wrap",
                        },
                      ]}
                      numberOfLines={3}
                    >
                      {feedback.description}
                    </Text>

                    <View
                      style={{
                        backgroundColor: getStatusColor(feedback.status),
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        alignSelf: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {getStatusText(feedback.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    tabStyles.actionButtonsContainer,
                    {
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 8,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: "#f0f0f0",
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[tabStyles.actionButton, tabStyles.viewButton]}
                    onPress={() => handleViewFeedback(feedback)}
                  >
                    <MaterialIcons name="visibility" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[tabStyles.actionButton, tabStyles.editButton]}
                    onPress={() => handleEditFeedback(feedback)}
                  >
                    <MaterialIcons name="edit" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[tabStyles.actionButton, tabStyles.deleteButton]}
                    onPress={() => handleDeleteFeedback(feedback.feedbackId)}
                  >
                    <MaterialIcons name="delete" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
