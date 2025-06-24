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

const formatCurrency = (amount) => {
  if (!amount) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function ApartmentTypesTab({
  apartmentTypes = [],
  tabs,
  refreshing,
  onRefresh,
  handleCreateApartmentType,
  handleViewApartmentType,
  handleEditApartmentType,
  handleDeleteApartmentType,
}) {
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Loại căn hộ</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {(apartmentTypes || []).length} loại căn hộ
        </Text>
        {renderStatsCard(
          "Tổng loại CH",
          (apartmentTypes || []).length,
          "#9C27B0",
          "category"
        )}
      </View>

      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: "#9C27B0" }]}
          onPress={handleCreateApartmentType}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm loại căn hộ</Text>
        </TouchableOpacity>
      </View>

      {(apartmentTypes || []).length === 0 ? (
        renderEmptyState(
          "Chưa có loại căn hộ nào",
          "Hãy thêm loại căn hộ đầu tiên",
          "category"
        )
      ) : (
        <View style={tabStyles.listCard}>
          <View>
            {(apartmentTypes || []).map((apartmentType) => (
              <View
                key={apartmentType.apartmentTypeId}
                style={[
                  tabStyles.listItem,
                  {
                    flexDirection: "column",
                    alignItems: "flex-end",
                    padding: 16,
                  },
                ]}
              >
                <View
                  key={`content-${apartmentType.apartmentTypeId}`}
                  style={tabStyles.listItemContent}
                >
                  <MaterialIcons
                    key={`icon-${apartmentType.apartmentTypeId}`}
                    name="category"
                    size={18}
                    color="#9C27B0"
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text
                      key={`name-${apartmentType.apartmentTypeId}`}
                      style={[tabStyles.listItemText, { fontWeight: "600" }]}
                    >
                      {apartmentType.typeName ||
                        `Loại ${apartmentType.apartmentTypeId}`}
                    </Text>
                    <Text
                      style={[
                        tabStyles.listItemText,
                        { fontSize: 12, color: "#666", marginTop: 2 },
                      ]}
                    >
                      {apartmentType.area ? `${apartmentType.area}m²` : ""} •
                      {apartmentType.numBedrooms || 0} PN •
                      {apartmentType.numBathrooms || 0} PT
                    </Text>
                    <Text
                      style={[
                        tabStyles.listItemText,
                        {
                          fontSize: 12,
                          color: "#9C27B0",
                          marginTop: 2,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {formatCurrency(apartmentType.rentFee)}
                    </Text>
                  </View>
                </View>
                <View style={tabStyles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={[tabStyles.actionButton, tabStyles.viewButton]}
                    onPress={() => handleViewApartmentType(apartmentType)}
                  >
                    <MaterialIcons name="visibility" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[tabStyles.actionButton, tabStyles.editButton]}
                    onPress={() => handleEditApartmentType(apartmentType)}
                  >
                    <MaterialIcons name="edit" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[tabStyles.actionButton, tabStyles.deleteButton]}
                    onPress={() =>
                      handleDeleteApartmentType(apartmentType.apartmentTypeId)
                    }
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
