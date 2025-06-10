import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const AdminHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Admin Dashboard</Text>
      <Text style={styles.headerSubtitle}>Quản lý tòa nhà Linkoma</Text>
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
});
