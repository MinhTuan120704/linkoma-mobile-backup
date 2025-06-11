import React, { useState } from "react";
import { View, Alert, Text } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
import { useNavigation } from "@react-navigation/native";
/* import { useAuth } from "../../context/AuthContext"; */
// useAuth để lấy thông tin người dùng hiện tại
// Import serviceFeeService để thực hiện chức năng:
// - Đăng ký dịch vụ mới (registerService)

export default function ResidentServiceRegisterScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên dịch vụ là bắt buộc";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Danh mục dịch vụ là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true); // TODO: Call API registerService(data) để đăng ký dịch vụ mới
      Alert.alert(
        "Thành công",
        "Đăng ký dịch vụ thành công! Chờ xác nhận từ ban quản lý.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      console.error("Service registration error:", e);
      Alert.alert("Lỗi", "Không đăng ký được dịch vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  return (
    <ModernScreenWrapper
      title="Đăng ký dịch vụ"
      subtitle="Đăng ký dịch vụ mới"
      headerColor="#1976D2"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Thông tin dịch vụ">
          <ModernFormInput
            label="Tên dịch vụ"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder="Nhập tên dịch vụ cần đăng ký"
            icon="room_service"
            error={errors.name}
          />

          <ModernFormInput
            label="Mô tả"
            value={formData.description}
            onChangeText={(value) => updateField("description", value)}
            placeholder="Mô tả chi tiết về dịch vụ"
            icon="description"
            multiline
            numberOfLines={3}
          />

          <ModernFormInput
            label="Danh mục dịch vụ"
            value={formData.category}
            onChangeText={(value) => updateField("category", value)}
            placeholder="Ví dụ: Vệ sinh, Bảo trì, Bảo vệ, v.v."
            icon="category"
            error={errors.category}
          />

          <ModernFormInput
            label="Ghi chú thêm"
            value={formData.notes}
            onChangeText={(value) => updateField("notes", value)}
            placeholder="Ghi chú thêm về yêu cầu đặc biệt"
            icon="note"
            multiline
            numberOfLines={2}
          />
        </ModernCard>

        <ModernCard title="Thông tin quan trọng">
          <View style={{ paddingVertical: 16 }}>
            <View
              style={{
                backgroundColor: "#E3F2FD",
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#1976D2",
                  lineHeight: 20,
                  fontWeight: "500",
                }}
              >
                📋 Lưu ý khi đăng ký dịch vụ:
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#424242",
                  lineHeight: 20,
                  marginTop: 8,
                }}
              >
                • Đơn đăng ký sẽ được xem xét trong vòng 1-2 ngày làm việc
                {"\n"}• Phí dịch vụ sẽ được thông báo sau khi duyệt
                {"\n"}• Bạn có thể hủy đăng ký bất kỳ lúc nào
                {"\n"}• Liên hệ ban quản lý nếu cần hỗ trợ thêm
              </Text>
            </View>
          </View>
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Gửi đăng ký"
            onPress={handleSubmit}
            loading={loading}
            icon="send"
            fullWidth
          />

          <ModernButton
            title="Hủy"
            onPress={() => navigation.goBack()}
            type="outline"
            fullWidth
          />
        </View>
      </View>
    </ModernScreenWrapper>
  );
}
