import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../components";
import { useAuth } from "../../contexts/AuthContext";

export default function ChangePasswordScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { user, changePassword, logout, refreshAuth } = useAuth();

  // Get user data from route params
  const { 
    isFirstLogin, 
    userId, 
    userEmail, 
    userData 
  } = route.params || {};

  // Log user info for debugging
  React.useEffect(() => {
    if (isFirstLogin) {
      console.log('ChangePasswordScreen - First login detected');
      console.log('User ID:', userId);
      console.log('User Email:', userEmail);
      console.log('User Data:', userData);
    }
  }, [isFirstLogin, userId, userEmail, userData]);

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
      
      let response;
      
      if (route.params?.isFirstLogin) {
        // Use changePassword for first login (userId, newPassword, isFirstLogin=true)
        response = await changePassword(userId, formData.newPassword, true);
      } else {
        // Use changePassword for normal password change (currentPassword, newPassword, isFirstLogin=false)
        response = await changePassword(formData.currentPassword, formData.newPassword, false);
      }

      if (response.success) {
        Alert.alert("Thành công", "Đổi mật khẩu thành công!");

        // If this is first time login, refresh auth to update user data
        // AppNavigator will automatically navigate to next step
        if (route.params?.isFirstLogin) {
          console.log('First login password change successful for user:', userId);
          await refreshAuth();
          // AppNavigator sẽ tự động chuyển đến UpdateUserInfo
        } else {
          navigation.goBack();
        }
      } else {
        Alert.alert("Lỗi", response.message || "Không thể đổi mật khẩu");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      "Xác nhận", 
      "Bạn có muốn hủy và đăng xuất?",
      [
        {
          text: "Không",
          style: "cancel"
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              // AppNavigator sẽ tự động điều hướng về màn hình login
            } catch (error) {
              console.error("Logout error:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <ModernScreenWrapper
      title="Đổi mật khẩu"
      subtitle="Vui lòng cập nhật mật khẩu mới"
      loading={loading}
      showBackButton={!route.params?.isFirstLogin}
      onBackPress={route.params?.isFirstLogin ? undefined : handleCancel}
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
              onPress={handleCancel}
              type="outline"
              fullWidth
              style={styles.cancelButton}
            />
          )}

          {route.params?.isFirstLogin && (
            <ModernButton
              title="Quay lại đăng nhập"
              onPress={handleCancel}
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
