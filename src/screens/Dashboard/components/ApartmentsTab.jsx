import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { List, Card } from "@ant-design/react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { renderEmptyState, renderStatsCard } from "./AdminSharedComponents";
import { tabStyles } from "./AdminTabStyles";

export default function ApartmentsTab({
  apartments,
  tabs,
  refreshing,
  onRefresh,
  handleCreateApartment,
  handleViewApartment,
  handleEditApartment,
  handleDeleteApartment,
}) {
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Căn hộ</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {apartments.length} căn hộ
        </Text>
        {renderStatsCard(
          "Tổng căn hộ",
          apartments.length,
          tabs[1].color,
          "home"
        )}
      </Card>
      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: tabs[1].color }]}
          onPress={handleCreateApartment}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm căn hộ</Text>
        </TouchableOpacity>
      </View>
      {apartments.length === 0 ? (
        renderEmptyState(
          "Chưa có căn hộ nào",
          "Hãy thêm căn hộ đầu tiên cho tòa nhà",
          "home_work"
        )
      ) : (
        <Card style={tabStyles.listCard}>
          <List>
            {apartments.map((apartment) => (
              <List.Item
                key={apartment.id}
                extra={
                  <View style={tabStyles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.viewButton]}
                      onPress={() => handleViewApartment(apartment)}
                    >
                      <MaterialIcons name="visibility" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.editButton]}
                      onPress={() => handleEditApartment(apartment)}
                    >
                      <MaterialIcons name="edit" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.deleteButton]}
                      onPress={() => handleDeleteApartment(apartment.id)}
                    >
                      <MaterialIcons name="delete" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                }
              >
                <View
                  key={`content-${apartment.id}`}
                  style={tabStyles.listItemContent}
                >
                  <FontAwesome5
                    key={`icon-${apartment.id}`}
                    name="building"
                    size={18}
                    color={tabs[1].color}
                  />
                  <Text
                    key={`name-${apartment.id}`}
                    style={tabStyles.listItemText}
                  >
                    {apartment.name}
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
