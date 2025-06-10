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

export default function FeedbacksTab({
  feedbacks,
  tabs,
  refreshing,
  onRefresh,
  handleCreateFeedback,
  handleViewFeedback,
  handleEditFeedback,
  handleDeleteFeedback,
}) {
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Phản hồi</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {feedbacks.length} phản hồi
        </Text>
        {renderStatsCard(
          "Tổng phản hồi",
          feedbacks.length,
          tabs[2].color,
          "chat-bubble"
        )}
      </Card>
      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: tabs[2].color }]}
          onPress={handleCreateFeedback}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm phản hồi</Text>
        </TouchableOpacity>
      </View>
      {feedbacks.length === 0 ? (
        renderEmptyState(
          "Chưa có phản hồi nào",
          "Chưa có phản hồi từ cư dân",
          "feedback"
        )
      ) : (
        <Card style={tabStyles.listCard}>
          <List>
            {feedbacks.map((feedback) => (
              <List.Item
                key={feedback.id}
                extra={
                  <View style={tabStyles.actionButtonsContainer}>
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
                      onPress={() => handleDeleteFeedback(feedback.id)}
                    >
                      <MaterialIcons name="delete" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                }
              >
                <View style={tabStyles.listItemContent}>
                  <MaterialIcons
                    name="chat-bubble"
                    size={18}
                    color={tabs[2].color}
                  />
                  <Text style={tabStyles.listItemText}>{feedback.title}</Text>
                </View>
              </List.Item>
            ))}
          </List>
        </Card>
      )}
    </ScrollView>
  );
}
