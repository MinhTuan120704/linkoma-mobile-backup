import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { renderEmptyState, renderStatsCard } from "./AdminSharedComponents";
import { tabStyles } from "./AdminTabStyles";

export default function ApartmentsTab({
  apartments = [], // Default to empty array if undefined
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
      <View style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Căn hộ</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {(apartments || []).length} căn hộ
        </Text>
        {renderStatsCard(
          "Tổng căn hộ",
          (apartments || []).length,
          tabs[1].color,
          "home"
        )}
      </View>
      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: tabs[1].color }]}
          onPress={handleCreateApartment}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm căn hộ</Text>
        </TouchableOpacity>
      </View>
      {(apartments || []).length === 0 ? (
        renderEmptyState(
          "Chưa có căn hộ nào",
          "Hãy thêm căn hộ đầu tiên cho tòa nhà",
          "home_work"
        )
      ) : (
        <View style={tabStyles.listCard}>
          <View>
            {(apartments || []).map((apartment) => (
              <View
                key={apartment.apartmentId}
                style={[
                  tabStyles.listItem,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                  },
                ]}
              >
                <View
                  key={`content-${apartment.apartmentId}`}
                  style={tabStyles.listItemContent}
                >
                  <FontAwesome5
                    key={`icon-${apartment.apartmentId}`}
                    name="building"
                    size={18}
                    color={tabs[1].color}
                  />
                  <Text
                    key={`name-${apartment.apartmentId}`}
                    style={tabStyles.listItemText}
                  >
                    {"Lầu " +
                      apartment.floor +
                      " - Phòng " +
                      apartment.apartmentId}
                  </Text>
                </View>
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
                    onPress={() => handleDeleteApartment(apartment.apartmentId)}
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
