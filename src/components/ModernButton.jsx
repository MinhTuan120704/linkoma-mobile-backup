import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModernButton({
  title,
  onPress,
  type = "primary", // primary, secondary, danger, outline
  size = "medium", // small, medium, large
  loading = false,
  disabled = false,
  icon = null,
  style = {},
  textStyle = {},
  fullWidth = false,
}) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    } else {
      baseStyle.push(styles[type]);
    }

    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];

    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    } else {
      baseStyle.push(styles[`${type}Text`]);
    }

    return [...baseStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              type === "outline" || type === "secondary" ? "#2C3E50" : "#FFFFFF"
            }
          />
        ) : (
          <>
            {icon && (
              <MaterialIcons
                name={icon}
                size={size === "small" ? 16 : size === "large" ? 24 : 20}
                color={
                  type === "outline" || type === "secondary"
                    ? "#2C3E50"
                    : "#FFFFFF"
                }
                style={styles.icon}
              />
            )}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },

  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },

  // Types
  primary: {
    backgroundColor: "#2C3E50",
  },
  secondary: {
    backgroundColor: "#ECF0F1",
    borderWidth: 1,
    borderColor: "#BDC3C7",
  },
  danger: {
    backgroundColor: "#E74C3C",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2C3E50",
  },

  // Disabled
  disabled: {
    backgroundColor: "#BDC3C7",
    shadowOpacity: 0,
    elevation: 0,
  },

  // Text styles
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Text colors
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#2C3E50",
  },
  dangerText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#2C3E50",
  },
  disabledText: {
    color: "#7F8C8D",
  },

  icon: {
    marginRight: 8,
  },
});
