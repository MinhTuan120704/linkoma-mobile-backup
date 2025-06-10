import React, { useEffect, useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import { ModernScreenWrapper, ModernCard, InfoRow } from "../../components";
import { useAuth } from "../../context/AuthContext";

// Import apartmentService để thực hiện chức năng:
// - Lấy thông tin căn hộ (getApartmentById)

export default function ResidentApartmentInfoScreen() {
  const { user } = useAuth();
  const [apartmentData, setApartmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApartment = async () => {
    if (!user || !user.apartmentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API getApartmentById(apartmentId) để lấy thông tin căn hộ
      // Hiện tại set empty object để test giao diện
      setApartmentData({});
    } catch (error) {
      console.error("Error fetching apartment:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin căn hộ");
      setApartmentData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartment();
  }, [user]);

  const formatCurrency = (amount) => {
    if (!amount) return "Không có dữ liệu";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "occupied":
      case "active":
        return "highlight";
      case "vacant":
        return "warning";
      case "maintenance":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "occupied":
        return "Đang có người ở";
      case "active":
        return "Đang hoạt động";
      case "vacant":
        return "Trống";
      case "maintenance":
        return "Bảo trì";
      default:
        return "Không xác định";
    }
  };

  if (!user?.apartmentId && !loading) {
    return (
      <ModernScreenWrapper
        title="Thông tin căn hộ"
        subtitle="Không có căn hộ"
        headerColor="#1976D2"
      >
        <ModernCard>
          <InfoRow
            label="Thông báo"
            value="Bạn chưa được gán căn hộ nào"
            icon="info"
            type="warning"
          />
        </ModernCard>
      </ModernScreenWrapper>
    );
  }

  return (
    <ModernScreenWrapper
      title="Thông tin căn hộ"
      subtitle="Chi tiết căn hộ của bạn"
      headerColor="#1976D2"
      loading={loading}
      onRefresh={fetchApartment}
    >
      {apartmentData && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ModernCard title="Thông tin cơ bản">
            <InfoRow
              label="Tên căn hộ"
              value={apartmentData.name || apartmentData.apartmentName}
              icon="home"
              type="highlight"
            />

            <InfoRow
              label="Số căn hộ"
              value={apartmentData.apartmentNumber}
              icon="door-front"
            />

            <InfoRow
              label="Block"
              value={apartmentData.block}
              icon="business"
            />

            <InfoRow
              label="Tầng"
              value={apartmentData.floor?.toString()}
              icon="layers"
            />

            <InfoRow
              label="Diện tích"
              value={
                apartmentData.area
                  ? `${apartmentData.area} m²`
                  : "Không có dữ liệu"
              }
              icon="square-foot"
            />
          </ModernCard>

          <ModernCard title="Thông tin địa chỉ">
            <InfoRow
              label="Địa chỉ"
              value={apartmentData.address}
              icon="location-on"
            />

            <InfoRow
              label="Mã bưu điện"
              value={apartmentData.postalCode}
              icon="markunread-mailbox"
            />

            <InfoRow
              label="Quận/Huyện"
              value={apartmentData.district}
              icon="map"
            />

            <InfoRow
              label="Thành phố"
              value={apartmentData.city}
              icon="location-city"
            />
          </ModernCard>

          <ModernCard title="Thông tin phòng">
            <InfoRow
              label="Số phòng ngủ"
              value={apartmentData.bedrooms?.toString() || "Không có dữ liệu"}
              icon="bed"
            />

            <InfoRow
              label="Số phòng tắm"
              value={apartmentData.bathrooms?.toString() || "Không có dữ liệu"}
              icon="bathtub"
            />

            <InfoRow
              label="Có ban công"
              value={apartmentData.hasBalcony ? "Có" : "Không"}
              icon="balcony"
            />

            <InfoRow
              label="Có thang máy"
              value={apartmentData.hasElevator ? "Có" : "Không"}
              icon="elevator"
            />
          </ModernCard>

          <ModernCard title="Thông tin tài chính">
            <InfoRow
              label="Giá thuê"
              value={formatCurrency(apartmentData.rentPrice)}
              icon="attach-money"
              type="highlight"
            />

            <InfoRow
              label="Phí dịch vụ"
              value={formatCurrency(apartmentData.servicePrice)}
              icon="receipt-long"
            />

            <InfoRow
              label="Tiền cọc"
              value={formatCurrency(apartmentData.deposit)}
              icon="account-balance-wallet"
            />
          </ModernCard>

          <ModernCard title="Thông tin khác">
            <InfoRow
              label="Trạng thái"
              value={getStatusText(apartmentData.status)}
              icon="info"
              type={getStatusColor(apartmentData.status)}
            />

            <InfoRow
              label="Chủ sở hữu"
              value={apartmentData.owner || apartmentData.ownerName}
              icon="person"
            />

            <InfoRow
              label="Năm xây dựng"
              value={apartmentData.yearBuilt?.toString()}
              icon="construction"
            />
          </ModernCard>

          {apartmentData.description && (
            <ModernCard title="Mô tả">
              <InfoRow
                label="Mô tả"
                value={apartmentData.description}
                icon="description"
              />
            </ModernCard>
          )}
        </ScrollView>
      )}
    </ModernScreenWrapper>
  );
}
