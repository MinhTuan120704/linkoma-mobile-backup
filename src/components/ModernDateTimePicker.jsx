import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModernDateTimePicker({
  label,
  value,
  onChange,
  mode = "date",
  minimumDate,
  maximumDate,
  required = false,
  error = null,
  disabled = false,
  icon = null,
  style = {},
  placeholder = "Chọn ngày",
}) {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    if (event.type === "dismissed") {
      return;
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    if (mode === "time") {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (mode === "datetime") {
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setShow(true)}
        style={[
          styles.inputContainer,
          disabled && styles.disabled,
          error && styles.error,
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color="#7F8C8D"
            style={styles.leftIcon}
          />
        )}
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <MaterialIcons
          name="event"
          size={20}
          color="#7F8C8D"
          style={styles.rightIcon}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          is24Hour={true}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  required: {
    color: "#E74C3C",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8F4FD",
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    backgroundColor: "#F8F9FA",
    borderColor: "#BDC3C7",
  },
  error: {
    borderColor: "#E74C3C",
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: "auto",
  },
  valueText: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
  },
  placeholder: {
    color: "#BDC3C7",
  },
  errorText: {
    fontSize: 14,
    color: "#E74C3C",
    marginTop: 4,
    marginLeft: 4,
  },
});
