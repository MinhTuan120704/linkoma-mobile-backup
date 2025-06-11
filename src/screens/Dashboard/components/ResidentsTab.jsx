import React, {useState, useEffect} from "react";
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
import { residentService } from "../../../services";

export default function ResidentsTab({
  tabs,
  refreshing,
  onRefresh,
  handleCreate,
  handleView,
  handleEdit,
}) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enhanced delete handler that refreshes local data
  const handleDeleteResident = async (residentId) => {
    try {
      // Call the parent delete handler first
      await residentService.deleteResident(residentId);
      
      // Refresh local residents list
      await fetchResidents();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      // The parent handler already shows error alerts
    }
  };

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const response = await residentService.getResidents();
      
      if (response.success && response.data) {
        const residentsData = response.data;
        
        // Ensure residentsData is an array
        if (!Array.isArray(residentsData)) {
          console.error("Residents data is not an array:", residentsData);
          setResidents([]);
          return;
        }
        
        // Sort residents by name for better display
        const sortedResidents = residentsData.sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        
        setResidents(sortedResidents);
        console.log("Residents loaded successfully:", sortedResidents.length, "residents");
        console.log("Sample resident data:", sortedResidents[0]); // Log first resident for debugging
      } else {
        console.error("Failed to fetch residents:", response.message);
        setResidents([]);
      }
    } catch (error) {
      console.error("Error fetching residents:", error);
      console.error("Error message:", error.message);
      setResidents([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle manual refresh
  const handleRefresh = async () => {
    await fetchResidents();
    if (onRefresh) {
      onRefresh();
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return null;
    }
  };

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return null;
    }
  };
  useEffect(() => {
    fetchResidents();
  }, []);
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing || loading} 
          onRefresh={handleRefresh} 
          tintColor={tabs[0]?.color || '#007AFF'}
          title="Đang tải dữ liệu cư dân..."
        />
      }
    >
      <Card style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Cư dân</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {(residents || []).length} cư dân
        </Text>
        {renderStatsCard(
          "Tổng cư dân",
          (residents || []).length,
          tabs[0].color,
          "people"
        )}
      </Card>
      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: tabs[0].color }]}
          onPress={handleCreate}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm cư dân</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Card style={tabStyles.listCard}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <MaterialIcons name="hourglass_empty" size={32} color="#999" />
            <Text style={{ marginTop: 8, color: '#999' }}>Đang tải danh sách cư dân...</Text>
          </View>
        </Card>
      ) : !(residents && residents.length > 0) ? (
        renderEmptyState(
          "Chưa có cư dân nào",
          "Hãy thêm cư dân đầu tiên cho tòa nhà",
          "person_add_alt"
        )
      ) : (
        <Card style={tabStyles.listCard}>
          <List>
            {(residents || []).map((resident) => (
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
                      onPress={() => handleDeleteResident(resident.userId || resident.id)}
                    >
                      <MaterialIcons name="delete" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                }
              >
                <View style={tabStyles.listItemContent}>
                  <MaterialIcons
                    name="person"
                    size={20}
                    color={tabs[0].color}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={tabStyles.listItemText}>
                      {resident.name || 'Chưa có tên'}
                    </Text>
                    <Text style={[tabStyles.listItemText, { fontSize: 12, color: '#666', marginTop: 2 }]}>
                      📧 {resident.email || 'Chưa có email'}
                    </Text>
                    {resident.phoneNumber && (
                      <Text style={[tabStyles.listItemText, { fontSize: 12, color: '#666', marginTop: 1 }]}>
                        📱 {resident.phoneNumber}
                      </Text>
                    )}
                    {resident.dateOfBirth && (
                      <Text style={[tabStyles.listItemText, { fontSize: 12, color: '#666', marginTop: 1 }]}>
                        🎂 {formatDate(resident.dateOfBirth)} 
                        {calculateAge(resident.dateOfBirth) && ` (${calculateAge(resident.dateOfBirth)} tuổi)`}
                      </Text>
                    )}
                    {resident.apartmentId && (
                      <Text style={[tabStyles.listItemText, { fontSize: 12, color: '#888', marginTop: 1 }]}>
                        🏠 Căn hộ ID: {resident.apartmentId}
                      </Text>
                    )}
                    {resident.licensePlate && (
                      <Text style={[tabStyles.listItemText, { fontSize: 12, color: '#888', marginTop: 1 }]}>
                        🚗 Biển số: {resident.licensePlate}
                      </Text>
                    )}
                  </View>
                </View>
              </List.Item>
            ))}
          </List>
        </Card>
      )}
    </ScrollView>
  );
}
