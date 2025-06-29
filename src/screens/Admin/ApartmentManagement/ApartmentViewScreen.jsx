import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  InfoRow,
  ModernButton,
} from "../../../components";
import apartmentService from "../../../services/apartmentService";
import apartmentTypeService from "../../../services/apartmentTypeService";

export default function ApartmentViewScreen({ route, navigation }) {
  const { apartment } = route.params || {};
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [apartmentType, setApartmentType] = useState(null);
  const [loadingType, setLoadingType] = useState(true);

  useEffect(() => {
    if (apartment?.apartmentTypeId) {
      loadApartmentType();
    }
  }, [apartment]);

  const loadApartmentType = async () => {
    try {
      setLoadingType(true);
      const response = await apartmentTypeService.getApartmentTypeById(
        apartment.apartmentTypeId
      );

      if (response.success) {
        setApartmentType(response.data);
      } else {
        console.log("Error loading apartment type:", response.message);
      }
    } catch (error) {
      console.log("Error loading apartment type:", error);
    } finally {
      setLoadingType(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate("ApartmentEdit", { apartment });
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
              apartment.apartmentId
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

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <ModernScreenWrapper
      title="Chi tiết căn hộ"
      subtitle={`Căn hộ số ${apartment?.apartmentId}`}
      headerColor="#2C3E50"
      rightHeaderComponent={
        <ModernButton
          title="Sửa"
          onPress={handleEdit}
          type="secondary"
          size="small"
        />
      }
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernCard title="Thông tin cơ bản">
          <InfoRow
            label="ID Căn hộ"
            value={apartment?.apartmentId?.toString()}
            icon="home"
            type="highlight"
          />
          <InfoRow
            label="Loại căn hộ"
            value={
              loadingType
                ? "Đang tải..."
                : apartmentType
                ? `${apartmentType.typeName} (${apartmentType.area}m²)`
                : `ID: ${apartment?.apartmentTypeId}`
            }
            icon="business"
          />
          <InfoRow
            label="Chi tiết loại căn hộ"
            value={
              loadingType
                ? "Đang tải..."
                : apartmentType
                ? `${apartmentType.numBedrooms} phòng ngủ, ${apartmentType.numBathrooms} phòng tắm`
                : "Không có dữ liệu"
            }
            icon="info"
          />
          <InfoRow
            label="Tầng"
            value={apartment?.floor?.toString()}
            icon="layers"
          />
          <InfoRow
            label="Trạng thái"
            value={apartment?.status}
            icon="info"
            type={apartment?.status === "rented" ? "warning" : "highlight"}
          />
        </ModernCard>

        <ModernCard title="Thông tin khác">
          <InfoRow
            label="Ngày tạo"
            value={formatDate(apartment?.createdAt)}
            icon="calendar-today"
          />

          <InfoRow
            label="Cập nhật lần cuối"
            value={formatDate(apartment?.updatedAt)}
            icon="update"
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Chỉnh sửa"
            onPress={handleEdit}
            icon="edit"
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
        </View>
      </View>
    </ModernScreenWrapper>
  );
}
