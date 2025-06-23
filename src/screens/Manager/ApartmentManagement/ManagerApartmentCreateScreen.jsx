import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernPicker,
} from "../../../components";
import apartmentService from "../../../services/apartmentService";
import apartmentTypeService from "../../../services/apartmentTypeService";

export default function ManagerApartmentCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [formData, setFormData] = useState({
    apartmentTypeId: "",
    floor: "",
    status: "available",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.apartmentTypeId) {
      newErrors.apartmentTypeId = "Loại căn hộ là bắt buộc";
    }

    if (!formData.floor.trim()) {
      newErrors.floor = "Tầng là bắt buộc";
    }

    if (!formData.status) {
      newErrors.status = "Trạng thái là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load apartment types on component mount
  useEffect(() => {
    loadApartmentTypes();
  }, []);

  const loadApartmentTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await apartmentTypeService.getAllApartmentTypes({
        limit: 100,
        sortBy: "typeName:asc",
      });

      if (response.success) {
        const types = response.data.results || response.data || [];
        setApartmentTypes(types);
      } else {
        console.log("Error loading apartment types:", response.message);
        Alert.alert("Lỗi", "Không thể tải danh sách loại căn hộ");
      }
    } catch (error) {
      console.log("Error loading apartment types:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách loại căn hộ");
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const apartmentData = {
        apartmentTypeId: parseInt(formData.apartmentTypeId),
        floor: parseInt(formData.floor),
        status: formData.status,
      };

      const response = await apartmentService.createApartment(apartmentData);
      if (response.success) {
        Alert.alert("Thành công", "Tạo căn hộ thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tạo căn hộ. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("Error creating apartment:", error);
      Alert.alert("Lỗi", "Không thể tạo căn hộ. Vui lòng thử lại.");
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
      title="Tạo căn hộ mới"
      subtitle="Nhập thông tin căn hộ"
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernPicker
          label="Loại căn hộ"
          value={formData.apartmentTypeId}
          onValueChange={(value) => updateField("apartmentTypeId", value)}
          items={(apartmentTypes || []).map((type) => ({
            label: `${type.typeName} (${type.area}m², ${type.numBedrooms} phòng ngủ, ${type.numBathrooms} phòng tắm)`,
            value: type.apartmentTypeId.toString(),
          }))}
          placeholder={loadingTypes ? "Đang tải..." : "Chọn loại căn hộ"}
          icon="home"
          required
          disabled={loadingTypes}
          error={errors.apartmentTypeId}
        />

        <ModernFormInput
          label="Tầng"
          value={formData.floor}
          onChangeText={(value) => updateField("floor", value)}
          placeholder="Nhập tầng"
          icon="layers"
          keyboardType="numeric"
          required
          error={errors.floor}
        />

        <ModernPicker
          label="Trạng thái"
          value={formData.status}
          onValueChange={(value) => updateField("status", value)}
          items={[
            { label: "Có sẵn", value: "available" },
            { label: "Đã thuê", value: "rented" },
            { label: "Bảo trì", value: "maintenance" },
          ]}
          placeholder="Chọn trạng thái"
          icon="info"
          required
          error={errors.status}
        />

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Tạo căn hộ"
            onPress={handleSubmit}
            loading={loading}
            icon="add"
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
