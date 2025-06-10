import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { InputItem, Button, Toast, List } from "@ant-design/react-native";
import { useAuth } from "../../context/AuthContext";
import axios from "axios"; // Thêm axios để test trực tiếp

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const { login } = useAuth();

  // Test API trực tiếp
  const testDirectAPI = async () => {
    try {
      console.log("Bắt đầu test API trực tiếp");
      Alert.alert("Debug", "Test API trực tiếp...");

      // Thêm timeout promise
      const apiPromise = axios.post(
        "https://linkoma-be.onrender.com/v1/auth/login",
        {
          email: username,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000, // Giảm xuống 5 giây
        }
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API timeout sau 5 giây")), 5000)
      );

      console.log("Đang gọi API...");
      const response = await Promise.race([apiPromise, timeoutPromise]);
      console.log("API response:", response);

      Alert.alert(
        "API Success",
        "Response: " + JSON.stringify(response.data, null, 2)
      );
    } catch (error) {
      console.log("API error:", error);
      Alert.alert(
        "API Error",
        "Error: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // Test network cơ bản
  const testNetwork = async () => {
    try {
      Alert.alert("Debug", "Test network cơ bản...");
      console.log("Bắt đầu test network");

      const response = await fetch("https://httpbin.org/get", {
        method: "GET",
        timeout: 5000,
      });

      const data = await response.json();
      console.log("Network test success:", data);
      Alert.alert("Network Success", "Kết nối internet OK!");
    } catch (error) {
      console.log("Network test error:", error);
      Alert.alert("Network Error", "Lỗi mạng: " + error.message);
    }
  };

  const handleLogin = async () => {
    if (username && password) {
      try {
        Alert.alert("Debug", "Bắt đầu gọi login...");
        setDebugInfo("Đang gọi login...");

        // Thêm timeout để tránh treo vô hạn
        const loginPromise = login(username, password);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Login timeout sau 10 giây")),
            10000
          )
        );

        const user = await Promise.race([loginPromise, timeoutPromise]);

        Alert.alert("Debug", "Login trả về user: " + JSON.stringify(user));
        setDebugInfo("Login thành công: " + JSON.stringify(user));

        Toast.info("Đăng nhập thành công!", 1);
        // Đợi Toast hiển thị xong rồi mới điều hướng
        setTimeout(() => {
          if (user.role === "admin") {
            navigation.reset({
              index: 0,
              routes: [{ name: "AdminDashboard" }],
            });
          } else if (user.role === "employee") {
            navigation.reset({
              index: 0,
              routes: [{ name: "EmployeeDashboard" }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "ResidentDashboard" }],
            });
          }
        }, 1200);
      } catch (e) {
        Alert.alert("Debug Error", "Lỗi: " + e.message);
        setDebugInfo("Lỗi: " + e.message);
        Toast.fail("Sai tài khoản hoặc mật khẩu hoặc lỗi kết nối", 2);
        console.log("Lỗi đăng nhập:", e);
      }
    } else {
      Toast.fail("Vui lòng nhập đủ thông tin", 1);
    }
  };

  return (
    <View style={styles.container}>
      <List renderHeader={"Đăng nhập"}>
        <InputItem
          value={username}
          onChange={setUsername}
          placeholder="Tên đăng nhập"
        >
          Tên
        </InputItem>
        <InputItem
          value={password}
          onChange={setPassword}
          placeholder="Mật khẩu"
          type="password"
        >
          Mật khẩu
        </InputItem>
      </List>
      <Button style={styles.button} type="primary" onPress={handleLogin}>
        Đăng nhập
      </Button>
      {/* Thêm nút test API trực tiếp */}
      <Button
        style={[styles.button, { backgroundColor: "#orange" }]}
        onPress={testDirectAPI}
      >
        Test API trực tiếp
      </Button>
      {/* Thêm nút test network */}
      <Button
        style={[styles.button, { backgroundColor: "#green" }]}
        onPress={testNetwork}
      >
        Test Network
      </Button>
      <Button onPress={() => navigation.navigate("Signup")} style={styles.link}>
        Đăng ký
      </Button>
      <Button
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.link}
      >
        Quên mật khẩu?
      </Button>
      {/* Shortcut tạm thời để vào ResidentDashboard không cần đăng nhập */}
      <Button
        style={[styles.link, { backgroundColor: "#e6f7ff" }]}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "ResidentDashboard" }],
          })
        }
      >
        Shortcut Resident Dashboard
      </Button>
      {/* Shortcut tạm thời để vào AdminDashboard không cần đăng nhập */}
      <Button
        style={[styles.link, { backgroundColor: "#fff7e6" }]}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "AdminDashboard" }],
          })
        }
      >
        Shortcut Admin Dashboard
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  button: { marginTop: 20 },
  link: { marginTop: 10 },
});
