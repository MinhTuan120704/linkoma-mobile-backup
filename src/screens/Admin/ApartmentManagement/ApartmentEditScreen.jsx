import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../../components";
import apartmentService from "../../../services/apartmentService";

export default function ApartmentEditScreen({ route, navigation }) {
  const { apartment } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    block: "",
    floor: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (apartment) {
      setFormData({
        name: apartment.name || "",
        block: apartment.block || "",
        floor: apartment.floor?.toString() || "",
        area: apartment.area?.toString() || "",
        bedrooms: apartment.bedrooms?.toString() || "",
        bathrooms: apartment.bathrooms?.toString() || "",
        description: apartment.description || "",
      });
    }
  }, [apartment]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên căn hộ là bắt buộc";
    }

    if (!formData.block.trim()) {
      newErrors.block = "Block là bắt buộc";
    }

    if (!formData.floor.trim()) {
      newErrors.floor = "Tầng là bắt buộc";
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
      const updateData = {
        ...formData,
        floor: parseInt(formData.floor),
        area: formData.area ? parseFloat(formData.area) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      };

      const response = await apartmentService.updateApartment(
        apartment.id,
        updateData
      );
      if (response.success) {
        Alert.alert("Thành công", "Cập nhật căn hộ thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể cập nhật căn hộ. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("Error updating apartment:", error);
      Alert.alert("Lỗi", "Không thể cập nhật căn hộ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa căn hộ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleteLoading(true);
            const response = await apartmentService.deleteApartment(
              apartment.id
            );
            if (response.success) {
              Alert.alert("Thành công", "Xóa căn hộ thành công!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert(
                "Lỗi",
                response.message || "Không thể xóa căn hộ. Vui lòng thử lại."
              );
            }
          } catch (error) {
            console.log("Error deleting apartment:", error);
            Alert.alert("Lỗi", "Không thể xóa căn hộ. Vui lòng thử lại.");
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  return (
    <ModernScreenWrapper
      title="Chỉnh sửa căn hộ"
      subtitle={`${apartment?.name || "Căn hộ"} - ${apartment?.block || ""}`}
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernFormInput
          label="Tên căn hộ"
          value={formData.name}
          onChangeText={(value) => updateField("name", value)}
          placeholder="Nhập tên căn hộ"
          icon="home"
          required
          error={errors.name}
        />

        <ModernFormInput
          label="Block"
          value={formData.block}
          onChangeText={(value) => updateField("block", value)}
          placeholder="Nhập block"
          icon="business"
          required
          error={errors.block}
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

        <ModernFormInput
          label="Diện tích (m²)"
          value={formData.area}
          onChangeText={(value) => updateField("area", value)}
          placeholder="Nhập diện tích"
          icon="square-foot"
          keyboardType="numeric"
          error={errors.area}
        />

        <ModernFormInput
          label="Số phòng ngủ"
          value={formData.bedrooms}
          onChangeText={(value) => updateField("bedrooms", value)}
          placeholder="Nhập số phòng ngủ"
          icon="bed"
          keyboardType="numeric"
          error={errors.bedrooms}
        />

        <ModernFormInput
          label="Số phòng tắm"
          value={formData.bathrooms}
          onChangeText={(value) => updateField("bathrooms", value)}
          placeholder="Nhập số phòng tắm"
          icon="bathtub"
          keyboardType="numeric"
          error={errors.bathrooms}
        />

        <ModernFormInput
          label="Mô tả"
          value={formData.description}
          onChangeText={(value) => updateField("description", value)}
          placeholder="Nhập mô tả căn hộ"
          icon="description"
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Cập nhật căn hộ"
            onPress={handleSubmit}
            loading={loading}
            icon="save"
            fullWidth
          />

          <ModernButton
            title="Xóa căn hộ"
            onPress={handleDelete}
            type="danger"
            loading={deleteLoading}
            icon="delete"
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
