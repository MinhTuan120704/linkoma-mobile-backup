import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../components";
import { useAuth } from "../../context/AuthContext";

export default function UpdateUserInfoScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const { user, updateUserInfo } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",
    idCard: user?.idCard || "",
    address: user?.address || "",
    emergencyContact: user?.emergencyContact || "",
    emergencyPhone: user?.emergencyPhone || "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.idCard.trim()) {
      newErrors.idCard = "CMND/CCCD là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      // This is a placeholder for the actual API call
      await updateUserInfo(formData);

      Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to the appropriate dashboard based on user role
            if (user?.role === "admin") {
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
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernScreenWrapper
      title="Cập nhật thông tin"
      subtitle="Vui lòng cập nhật thông tin cá nhân"
      loading={loading}
    >
      <View style={styles.container}>
        <ModernFormInput
          label="Họ và tên"
          value={formData.fullName}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, fullName: value }))
          }
          placeholder="Nhập họ và tên"
          icon="person"
          required
          error={errors.fullName}
        />

        <ModernFormInput
          label="Số điện thoại"
          value={formData.phone}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, phone: value }))
          }
          placeholder="Nhập số điện thoại"
          icon="phone"
          keyboardType="phone-pad"
          required
          error={errors.phone}
        />

        <ModernFormInput
          label="Ngày sinh"
          value={formData.dateOfBirth}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, dateOfBirth: value }))
          }
          placeholder="DD/MM/YYYY"
          icon="cake"
          error={errors.dateOfBirth}
        />

        <ModernFormInput
          label="CMND/CCCD"
          value={formData.idCard}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, idCard: value }))
          }
          placeholder="Nhập CMND/CCCD"
          icon="badge"
          required
          error={errors.idCard}
        />

        <ModernFormInput
          label="Địa chỉ"
          value={formData.address}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, address: value }))
          }
          placeholder="Nhập địa chỉ"
          icon="home"
          multiline
          error={errors.address}
        />

        <ModernFormInput
          label="Người liên hệ khẩn cấp"
          value={formData.emergencyContact}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, emergencyContact: value }))
          }
          placeholder="Nhập tên người liên hệ"
          icon="contacts"
          error={errors.emergencyContact}
        />

        <ModernFormInput
          label="SĐT liên hệ khẩn cấp"
          value={formData.emergencyPhone}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, emergencyPhone: value }))
          }
          placeholder="Nhập số điện thoại"
          icon="phone"
          keyboardType="phone-pad"
          error={errors.emergencyPhone}
        />

        <View style={styles.buttonContainer}>
          <ModernButton
            title="Hoàn tất"
            onPress={handleSubmit}
            loading={loading}
            icon="check"
            fullWidth
          />
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
  },
});
