import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Empty state component
export const renderEmptyState = (title, subtitle, icon) => (
  <View style={styles.emptyState}>
    <MaterialIcons name={icon} size={64} color="#BDC3C7" />
    <Text style={styles.emptyStateTitle}>{title}</Text>
    <Text style={styles.emptyStateSubtitle}>{subtitle}</Text>
  </View>
);

// Statistics card component
export const renderStatsCard = (title, count, color, icon) => (
  <View style={[styles.statsCard, { borderLeftColor: color }]}>
    <View style={styles.statsContent}>
      <View>
        <Text style={styles.statsTitle}>{title}</Text>
        <Text style={[styles.statsCount, { color }]}>{count}</Text>
      </View>
      <View style={[styles.statsIcon, { backgroundColor: color + "20" }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsTitle: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 4,
  },
  statsCount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
