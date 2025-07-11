import React, { useState, useCallback } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import { Toast } from "@ant-design/react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { navigateBasedOnRole } = useAuthNavigation();

  const validateInput = useCallback(() => {
    if (!email) {
      Toast.info("Vui lòng nhập email", 2);
      return false;
    }
    if (!password) {
      Toast.info("Vui lòng nhập mật khẩu", 2);
      return false;
    }
    return true;
  }, [email, password]);

  const handleLogin = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        Toast.success("Đăng nhập thành công", 2);
        // Role-based navigation will be handled by AppNavigator
      } else {
        Toast.fail(response.message || "Đăng nhập thất bại", 2);

        // Clear password on failure
        setPassword("");
      }
    } catch (error) {
      console.log("Login error:", error);
      Toast.fail("Đã xảy ra lỗi. Vui lòng thử lại sau.", 2);
      setPassword("");
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
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/LINKOMA_MOBILE.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.imageText}>Kết nối số với mái ấm của bạn</Text>
        </View>
        <ModernFormInput
          label="Email "
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          autoCapitalize="none"
          editable={!loading}
          returnKeyType="next"
        />
        <ModernFormInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          rightIcon={showPassword ? "visibility-off" : "visibility"}
          onRightIconPress={() => setShowPassword(!showPassword)}
        />
        <View style={styles.buttonContainer}>
          <ModernButton
            title="Đăng nhập"
            onPress={handleLogin}
            loading={loading}
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  imageText: {
    fontSize: 16,
    color: "#2C3E50",
    textAlign: "center",
    marginTop: 8,
  },
});
