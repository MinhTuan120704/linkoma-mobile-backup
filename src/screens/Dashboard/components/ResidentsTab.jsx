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

export default function ResidentsTab({
  residents = [], // Default to empty array if undefined
  tabs,
  refreshing,
  onRefresh,
  handleCreate,
  handleView,
  handleEdit,
  handleDeleteResident,
}) {
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Cư dân</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {residents.length} cư dân
        </Text>
        {renderStatsCard(
          "Tổng cư dân",
          residents.length,
          tabs[0].color,
          "people"
        )}
      </Card>
      <View style={tabStyles.actionContainer}>
        {handleCreate && (
          <TouchableOpacity
            style={[tabStyles.addButton, { backgroundColor: tabs[0].color }]}
            onPress={handleCreate}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={tabStyles.addButtonText}>Thêm cư dân</Text>
          </TouchableOpacity>
        )}
      </View>
      {residents.length === 0 ? (
        renderEmptyState(
          "Chưa có cư dân nào",
          "Hãy thêm cư dân đầu tiên cho tòa nhà",
          "person_add"
        )
      ) : (
        <Card style={tabStyles.listCard}>
          <List>
            {residents.map((resident) => (
              <List.Item
                key={resident.userId || resident.id}
                extra={
                  <View style={tabStyles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.viewButton]}
                      onPress={() => handleView(resident)}
                    >
                      <MaterialIcons name="visibility" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.editButton]}
                      onPress={() => handleEdit(resident)}
                    >
                      <MaterialIcons name="edit" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.deleteButton]}
                      onPress={() =>
                        handleDeleteResident(resident.userId || resident.id)
                      }
                    >
                      <MaterialIcons name="delete" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                }
              >
                <View
                  key={`content-${resident.userId || resident.id}`}
                  style={tabStyles.listItemContent}
                >
                  <MaterialIcons
                    key={`icon-${resident.userId || resident.id}`}
                    name="person"
                    size={20}
                    color={tabs[0].color}
                  />
                  <Text
                    key={`name-${resident.userId || resident.id}`}
                    style={tabStyles.listItemText}
                  >
                    {resident?.name || resident?.email || "Resident"}
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
