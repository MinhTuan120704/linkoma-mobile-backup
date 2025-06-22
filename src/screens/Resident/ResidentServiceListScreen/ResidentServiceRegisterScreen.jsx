import React, { useState, useEffect } from "react";
import { View, Alert, Text } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
  ModernPicker,
} from "../../../components";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import serviceRegistrationService from "../../../services/serviceRegistrationService";
import serviceTypeService from "../../../services/serviceTypeService";
import apartmentService from "../../../services/apartmentService";
import userService from "../../../services/userService";

export default function ResidentServiceRegisterScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [userApartment, setUserApartment] = useState(null);
  const [formData, setFormData] = useState({
    apartmentId: "",
    serviceTypeId: "",
    note: "",
    quantity: 1,
    startDate: new Date().toISOString().split("T")[0], // Today's date
  });
  const [errors, setErrors] = useState({});
  // Fetch user's apartment and available service types
  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch user's apartment info
      if (user?.userId) {
        const userResult = await userService.getUserById(user.userId);
        console.log("User data API fetched:", userResult.data);
        
        if (userResult.success && userResult.data.apartmentId) {
          const apartmentResult = await apartmentService.getApartmentById(
            userResult.data.apartmentId
          );
          console.log("Apartment data API fetched:", apartmentResult.data);
          if (apartmentResult.success) {
            setUserApartment(apartmentResult.data);
            setFormData((prev) => ({
              ...prev,
              apartmentId: apartmentResult.data.apartmentId,
            }));
          }
        }
      }
      console.log("User's apartment fetched:", userApartment);

      // Fetch available service types
      const serviceTypesResult = await serviceTypeService.getAllServiceTypes({
        limit: 100,
        sortBy: "serviceName:asc",
      });
      console.log("Service types fetched:", serviceTypesResult.data.results);

      if (serviceTypesResult.success) {
        setServiceTypes(serviceTypesResult.data.results || []);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu ban đầu");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.apartmentId) {
      newErrors.apartmentId =
        "Vui lòng liên hệ ban quản lý để được phân bổ căn hộ";
    }

    if (!formData.serviceTypeId) {
      newErrors.serviceTypeId = "Vui lòng chọn loại dịch vụ";
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const registrationData = {
        apartmentId: parseInt(formData.apartmentId),
        serviceTypeId: parseInt(formData.serviceTypeId),
        note: formData.note.trim() || null,
        quantity: parseInt(formData.quantity),
        startDate: formData.startDate,
        status: "Active", // Default status for new registrations
      };

      const result = await serviceRegistrationService.createServiceRegistration(
        registrationData
      );

      if (result.success) {
        Alert.alert(
          "Thành công",
          "Đăng ký dịch vụ thành công! Dịch vụ đã được kích hoạt.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Không thể đăng ký dịch vụ");
      }
    } catch (error) {
      console.error("Service registration error:", error);
      Alert.alert(
        "Lỗi",
        "Có lỗi xảy ra khi đăng ký dịch vụ. Vui lòng thử lại."
      );
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
        <ModernCard title="Thông tin căn hộ">
          <ModernFormInput
            label="Căn hộ"
            value={formData.apartmentId?.toString() || ""}
            
            placeholder="Đang tải thông tin căn hộ..."
            icon="home"
            editable={false}
            error={errors.apartmentId}
          />
        </ModernCard>

        <ModernCard title="Thông tin dịch vụ">
          <ModernPicker
            label="Loại dịch vụ"
            value={formData.serviceTypeId}
            onValueChange={(value) => updateField("serviceTypeId", value)}
            placeholder="Chọn loại dịch vụ"
            icon="room-service"
            required
            error={errors.serviceTypeId}
            items={serviceTypes.map((serviceType) => ({
              label: `${
                serviceType.serviceName
              } - ${serviceType.unitPrice?.toLocaleString("vi-VN")}đ/${
                serviceType.unit || "đơn vị"
              }`,
              value: serviceType.serviceTypeId?.toString(),
              key: serviceType.serviceTypeId?.toString(),
            }))}
          />

          <ModernFormInput
            label="Số lượng"
            value={formData.quantity?.toString()}
            onChangeText={(value) => updateField("quantity", value)}
            placeholder="Nhập số lượng dịch vụ"
            icon="numbers"
            required
            error={errors.quantity}
            keyboardType="numeric"
          />

          <ModernFormInput
            label="Ngày bắt đầu"
            value={formData.startDate}
            onChangeText={(value) => updateField("startDate", value)}
            placeholder="YYYY-MM-DD"
            icon="event"
            required
            error={errors.startDate}
          />

          <ModernFormInput
            label="Ghi chú"
            value={formData.note}
            onChangeText={(value) => updateField("note", value)}
            placeholder="Ghi chú thêm về yêu cầu đặc biệt"
            icon="note"
            multiline
            numberOfLines={3}
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
