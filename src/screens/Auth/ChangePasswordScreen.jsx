import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../components";
import { useAuth } from "../../context/AuthContext";

export default function ChangePasswordScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { user, changePassword } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      // This is a placeholder for the actual API call
      await changePassword(formData.currentPassword, formData.newPassword);

      Alert.alert("Thành công", "Đổi mật khẩu thành công!");

      // If this is first time login, navigate to update info
      if (route.params?.isFirstLogin) {
        navigation.navigate("UpdateUserInfo");
      } else {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernScreenWrapper
      title="Đổi mật khẩu"
      subtitle="Vui lòng cập nhật mật khẩu mới"
      loading={loading}
    >
      <View style={styles.container}>
        {!route.params?.isFirstLogin && (
          <ModernFormInput
            label="Mật khẩu hiện tại"
            value={formData.currentPassword}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, currentPassword: value }))
            }
            placeholder="Nhập mật khẩu hiện tại"
            secureTextEntry
            icon="lock"
            required
            error={errors.currentPassword}
          />
        )}

        <ModernFormInput
          label="Mật khẩu mới"
          value={formData.newPassword}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, newPassword: value }))
          }
          placeholder="Nhập mật khẩu mới"
          secureTextEntry
          icon="lock"
          required
          error={errors.newPassword}
        />

        <ModernFormInput
          label="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, confirmPassword: value }))
          }
          placeholder="Nhập lại mật khẩu mới"
          secureTextEntry
          icon="lock"
          required
          error={errors.confirmPassword}
        />

        <View style={styles.buttonContainer}>
          <ModernButton
            title={route.params?.isFirstLogin ? "Tiếp tục" : "Cập nhật"}
            onPress={handleSubmit}
            loading={loading}
            icon="check"
            fullWidth
          />

          {!route.params?.isFirstLogin && (
            <ModernButton
              title="Hủy"
              onPress={() => navigation.goBack()}
              type="outline"
              fullWidth
              style={styles.cancelButton}
            />
          )}
        </View>
      </View>
    </ModernScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    marginTop: 8,
  },
});
