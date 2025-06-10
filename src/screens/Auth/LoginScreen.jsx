import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../components";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData.username, formData.password);

      // Check if this is first time login
      if (response.isFirstLogin) {
        // Navigate to change password screen with first login flag
        navigation.navigate("ChangePassword", { isFirstLogin: true });
        return;
      }

      // Normal login flow - navigate to appropriate dashboard
      if (response.user.role === "admin") {
        navigation.reset({
          index: 0,
          routes: [{ name: "AdminDashboard" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "ResidentDashboard" }],
        });
      }
    } catch (error) {
      Alert.alert(
        "Lỗi đăng nhập",
        error.message || "Sai tên đăng nhập hoặc mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernScreenWrapper
      title="Đăng nhập"
      subtitle="Vui lòng đăng nhập để tiếp tục"
      headerColor="#2C3E50"
      loading={loading}
      showBackButton={false}
    >
      <View style={styles.container}>
        <ModernFormInput
          label="Tên đăng nhập"
          value={formData.username}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, username: value }))
          }
          placeholder="Nhập tên đăng nhập"
          icon="person"
          autoCapitalize="none"
        />

        <ModernFormInput
          label="Mật khẩu"
          value={formData.password}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, password: value }))
          }
          placeholder="Nhập mật khẩu"
          icon="lock"
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <ModernButton
            title="Đăng nhập"
            onPress={handleLogin}
            loading={loading}
            icon="login"
            fullWidth
          />

          <ModernButton
            title="Quên mật khẩu?"
            onPress={() => navigation.navigate("ForgotPassword")}
            type="outline"
            fullWidth
            style={styles.forgotButton}
          />
        </View>
      </View>
    </ModernScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  forgotButton: {
    marginTop: 8,
  },
});
