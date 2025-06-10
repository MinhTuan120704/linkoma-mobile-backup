import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModernCard({
  title,
  subtitle,
  children,
  onPress,
  rightIcon = "chevron-right",
  showRightIcon = true,
  style = {},
  titleStyle = {},
  subtitleStyle = {},
  headerStyle = {},
  contentStyle = {},
}) {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {(title || subtitle) && (
        <View style={[styles.header, headerStyle]}>
          <View style={styles.headerLeft}>
            {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            {subtitle && (
              <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
            )}
          </View>

          {onPress && showRightIcon && (
            <View style={styles.headerRight}>
              <MaterialIcons name={rightIcon} size={24} color="#7F8C8D" />
            </View>
          )}
        </View>
      )}

      {children && (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F2F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  content: {
    marginTop: 16,
  },
});
