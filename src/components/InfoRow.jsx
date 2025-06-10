import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function InfoRow({
  label,
  value,
  icon,
  onPress,
  type = "default", // default, highlight, warning, danger
  copyable = false,
  style = {},
}) {
  const getValueStyle = () => {
    switch (type) {
      case "highlight":
        return styles.highlightValue;
      case "warning":
        return styles.warningValue;
      case "danger":
        return styles.dangerValue;
      default:
        return styles.defaultValue;
    }
  };

  const handleCopy = () => {
    if (copyable && value) {
      // In a real app, you would use Clipboard API
      console.log("Copied:", value);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color="#7F8C8D"
            style={styles.icon}
          />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, getValueStyle()]} numberOfLines={3}>
            {value || "Không có dữ liệu"}
          </Text>
        </View>

        {(copyable || onPress) && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={copyable ? handleCopy : onPress}
          >
            <MaterialIcons
              name={copyable ? "content-copy" : "chevron-right"}
              size={20}
              color="#7F8C8D"
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F2F6",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 4,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
  },
  defaultValue: {
    color: "#2C3E50",
  },
  highlightValue: {
    color: "#3498DB",
    fontWeight: "600",
  },
  warningValue: {
    color: "#F39C12",
    fontWeight: "600",
  },
  dangerValue: {
    color: "#E74C3C",
    fontWeight: "600",
  },
  actionButton: {
    marginLeft: 12,
    padding: 4,
  },
});
