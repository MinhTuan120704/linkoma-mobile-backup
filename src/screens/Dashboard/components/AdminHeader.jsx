import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export const AdminHeader = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

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

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Quản lý tòa nhà Linkoma</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2C3E50",
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
});
