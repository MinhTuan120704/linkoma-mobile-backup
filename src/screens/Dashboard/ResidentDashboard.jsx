import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";

import ResidentInfoScreen from "../Resident/ResidentInfoScreen/ResidentInfoScreen";
import ResidentApartmentInfoScreen from "../Resident/ResidentApartmentInfoScreen/ResidentApartmentInfoScreen";
import ResidentFeedbackListScreen from "../Resident/ResidentFeedbackListScreen/ResidentFeedbackListScreen";
import ResidentServiceListScreen from "../Resident/ResidentServiceListScreen/ResidentServiceListScreen";
import ResidentNotificationListScreen from "../Resident/ResidentNotificationListScreen/ResidentNotificationListScreen";
import ResidentInvoiceListScreen from "../Resident/ResidentInvoiceListScreen/ResidentInvoiceListScreen";

const { width, height } = Dimensions.get("window");

export default function ResidentDashboard() {
  const [activeTab, setActiveTab] = React.useState(0);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logout } = useAuth();

  // Ensure we have valid insets with fallback values
  const safeInsets = {
    top: insets?.top || 0,
    bottom: insets?.bottom || 0,
    left: insets?.left || 0,
    right: insets?.right || 0,
  };

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await logout(navigation);
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại sau.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const tabs = [
    {
      title: "Thông tin",
      icon: "person",
      iconLibrary: "MaterialIcons",
      color: "#4CAF50",
    },
    {
      title: "Căn hộ",
      icon: "home",
      iconLibrary: "MaterialIcons",
      color: "#2196F3",
    },
    {
      title: "Phản hồi",
      icon: "chat-bubble",
      iconLibrary: "MaterialIcons",
      color: "#FF9800",
    },
    {
      title: "Dịch vụ",
      icon: "room-service",
      iconLibrary: "MaterialIcons",
      color: "#9C27B0",
    },
    {
      title: "Thông báo",
      icon: "notifications",
      iconLibrary: "MaterialIcons",
      color: "#F44336",
    },
    {
      title: "Hóa đơn",
      icon: "receipt",
      iconLibrary: "MaterialIcons",
      color: "#00BCD4",
    },
  ];

  // Hàm render icon
  const renderIcon = (tab, isActive) => {
    const IconComponent =
      tab.iconLibrary === "MaterialIcons"
        ? MaterialIcons
        : tab.iconLibrary === "FontAwesome5"
        ? FontAwesome5
        : Ionicons;
    return (
      <IconComponent
        name={tab.icon}
        size={22}
        color={isActive ? tab.color : "#666"}
      />
    );
  };

  // Hàm render nội dung tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ResidentInfoScreen />;
      case 1:
        return <ResidentApartmentInfoScreen />;
      case 2:
        return <ResidentFeedbackListScreen />;
      case 3:
        return <ResidentServiceListScreen />;
      case 4:
        return <ResidentNotificationListScreen />;
      case 5:
        return <ResidentInvoiceListScreen />;
      default:
        return <ResidentInfoScreen />;
    }
  };
  return (
    <View style={[styles.container, { paddingTop: safeInsets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Resident Portal</Text>
            <Text style={styles.headerSubtitle}>Cổng thông tin cư dân</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>{renderTabContent()}</View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              activeTab === index && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(index)}
          >
            <View
              style={[
                styles.tabIconContainer,
                activeTab === index && [
                  styles.activeTabIconContainer,
                  /* { backgroundColor: tab.color }, */
                ],
              ]}
            >
              {renderIcon(tab, activeTab === index)}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === index && { color: tab.color, fontWeight: "600" },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#1976D2",
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    /* borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25, */
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E3F2FD",
    textAlign: "center",
    marginTop: 5,
  },
  logoutButton: {
    padding: 8,
    position: "absolute",
    right: 0,
  },
  content: {
    flex: 1,
    paddingBottom: 90, // Leave space for bottom nav
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  activeTabButton: {
    // Additional styles for active tab if needed
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 4,
  },
  activeTabIconContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 9,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
});
