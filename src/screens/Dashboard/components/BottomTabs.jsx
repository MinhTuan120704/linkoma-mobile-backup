import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

const tabs = [
  {
    title: "Cư dân",
    icon: "people",
    iconLibrary: "MaterialIcons",
    color: "#4CAF50",
  },
  {
    title: "Căn hộ",
    icon: "building",
    iconLibrary: "FontAwesome5",
    color: "#2196F3",
  },
  {
    title: "Phản hồi",
    icon: "chat-bubble",
    iconLibrary: "MaterialIcons",
    color: "#FF9800",
  },
  {
    title: "Phí DV",
    icon: "credit-card",
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
      size={24}
      color={isActive ? tab.color : "#666"}
    />
  );
};

export const BottomTabs = ({
  activeTab,
  setActiveTab,
  insets = { bottom: 0 },
}) => {
  return (
    <View style={[styles.bottomNav, { paddingBottom: insets?.bottom || 0 }]}>
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
              activeTab === index && [styles.activeTabIconContainer],
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
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
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
    paddingHorizontal: 4,
  },
  activeTabButton: {
    // Additional styles for active tab if needed
  },
  tabIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
});

export { tabs };
