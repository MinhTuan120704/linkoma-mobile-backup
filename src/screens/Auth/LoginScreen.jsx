import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import { Toast } from "@ant-design/react-native";


export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "", // Đổi từ username thành email
    password: "",
  });
  const { login } = useAuth();

  const handleLogin = async () => {
    // Validation
    if (!formData.email || !formData.password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      
      // Call login from AuthContext
      const response = await login(formData.email, formData.password);

      if (response.success === true) {
        Toast.success("Đăng nhập thành công", 2);
        
      } else {
        Alert.alert("Lỗi đăng nhập", response.message || "Sai email hoặc mật khẩu");
      }
      
    } catch (error) {
      console.error("Login error in component:", error);
      Alert.alert(
        "Lỗi đăng nhập",
        error.message || "Có lỗi xảy ra khi đăng nhập"
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
          label="Email"
          value={formData.email}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, email: value }))
          }
          placeholder="Nhập email"
          icon="email"
          autoCapitalize="none"
          keyboardType="email-address"
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
