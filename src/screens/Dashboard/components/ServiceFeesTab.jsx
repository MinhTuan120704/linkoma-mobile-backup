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

export default function ServiceFeesTab({
  serviceFees,
  tabs,
  refreshing,
  onRefresh,
  handleCreateServiceFee,
  handleViewServiceFee,
  handleEditServiceFee,
  handleDeleteServiceFee,
}) {
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Phí dịch vụ</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {serviceFees.length} phí dịch vụ
        </Text>
        {renderStatsCard(
          "Tổng phí DV",
          serviceFees.length,
          tabs[3].color,
          "credit-card"
        )}
      </Card>
      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: tabs[3].color }]}
          onPress={handleCreateServiceFee}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm phí dịch vụ</Text>
        </TouchableOpacity>
      </View>
      {serviceFees.length === 0 ? (
        renderEmptyState(
          "Chưa có phí dịch vụ nào",
          "Hãy thêm phí dịch vụ cho tòa nhà",
          "monetization-on"
        )
      ) : (
        <Card style={tabStyles.listCard}>
          <List>
            {serviceFees.map((fee) => (
              <List.Item
                key={fee.id}
                extra={
                  <View style={tabStyles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.viewButton]}
                      onPress={() => handleViewServiceFee(fee)}
                    >
                      <MaterialIcons name="visibility" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.editButton]}
                      onPress={() => handleEditServiceFee(fee)}
                    >
                      <MaterialIcons name="edit" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.deleteButton]}
                      onPress={() => handleDeleteServiceFee(fee.id)}
                    >
                      <MaterialIcons name="delete" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                }
              >
                <View style={tabStyles.listItemContent}>
                  <MaterialIcons
                    name="credit-card"
                    size={18}
                    color={tabs[3].color}
                  />
                  <Text style={tabStyles.listItemText}>{fee.name}</Text>
                </View>
              </List.Item>
            ))}
          </List>
        </Card>
      )}
    </ScrollView>
  );
}
