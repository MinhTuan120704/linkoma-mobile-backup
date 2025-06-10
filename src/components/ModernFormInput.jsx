import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModernFormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  required = false,
  error = null,
  disabled = false,
  icon = null,
  rightIcon = null,
  onRightIconPress = null,
  style = {},
  inputStyle = {},
}) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <View
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

        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            icon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#BDC3C7"
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          editable={!disabled}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <MaterialIcons name={rightIcon} size={20} color="#7F8C8D" />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    paddingVertical: 14,
  },
  multilineInput: {
    textAlignVertical: "top",
    paddingTop: 14,
    paddingBottom: 14,
  },
  inputWithLeftIcon: {
    marginLeft: 0,
  },
  inputWithRightIcon: {
    marginRight: 0,
  },
  rightIconContainer: {
    marginLeft: 12,
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    color: "#E74C3C",
    marginTop: 4,
    marginLeft: 4,
  },
});
