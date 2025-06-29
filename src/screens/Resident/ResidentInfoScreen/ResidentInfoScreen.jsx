import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { ModernScreenWrapper, ModernCard, InfoRow } from "../../../components";
import { useUserSetup } from "../../../hooks/useUserSetup";
import apartmentService from "../../../services/apartmentService";

export default function ResidentInfoScreen() {
  const { user } = useUserSetup(); // Sử dụng useUserSetup thay vì useAuth
  const [residentData, setResidentData] = useState(null);
  const [apartmentData, setApartmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchApartmentData = async () => {
    if (!user?.apartmentId) {
      console.log("No apartment ID available");
      return;
    }

    try {
      const apartmentResult = await apartmentService.getApartmentById(
        user.apartmentId
      );
      if (apartmentResult.success && apartmentResult.data) {
        setApartmentData(apartmentResult.data);
      }
    } catch (apartmentError) {
      console.log("Error fetching apartment data:", apartmentError);
      // Don't show error for apartment as it's secondary data
    }
  };

  const loadData = async () => {
    console.log("Loading data for user at ResidentInfo:", user);

    if (!user) {
      console.log("No user data available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Use existing user data from login
      setResidentData({
        ...user,
        status: user.status || "active",
      });

      // Only fetch apartment data if apartmentId exists
      await fetchApartmentData();
    } catch (error) {
      console.log("Error loading data:", error);
      // Still set user data even if apartment fetch fails
      setResidentData({
        ...user,
        status: user.status || "active",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("Current user in effect:", user);
    loadData();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  return (
    <ModernScreenWrapper
      title="Thông tin cá nhân"
      subtitle={
        residentData ? `${residentData.name || "Cư dân"}` : "Thông tin cư dân"
      }
      headerColor="#1976D2"
      loading={loading}
      onRefresh={loadData}
    >
      {!loading && !residentData && (
        <ModernCard>
          <InfoRow
            label="Thông báo"
            value="Không thể tải thông tin cư dân. Vui lòng thử lại."
            icon="error"
            type="warning"
          />
        </ModernCard>
      )}

      {!loading && residentData && (
        <View style={{ paddingBottom: 20 }}>
          <ModernCard title="Thông tin cơ bản">
            <InfoRow
              label="Họ và tên"
              value={residentData.name || "Chưa cập nhật"}
              icon="person"
              type="highlight"
            />

            <InfoRow
              label="Email"
              value={residentData.email || "Chưa cập nhật"}
              icon="email"
              copyable
            />

            <InfoRow
              label="Số điện thoại"
              value={residentData.phoneNumber || "Chưa cập nhật"}
              icon="phone"
              copyable
            />

            <InfoRow
              label="Ngày sinh"
              value={formatDate(residentData.dateOfBirth)}
              icon="cake"
            />

            <InfoRow
              label="CMND/CCCD"
              value={residentData.citizenId || "Chưa cập nhật"}
              icon="badge"
              copyable
            />

            {residentData.role && (
              <InfoRow
                label="Vai trò"
                value={
                  residentData.role === "resident"
                    ? "Cư dân"
                    : residentData.role === "admin"
                    ? "Quản trị viên"
                    : residentData.role === "manager"
                    ? "Quản lý"
                    : residentData.role
                }
                icon="admin-panel-settings"
                type="highlight"
              />
            )}
          </ModernCard>
          <ModernCard title="Thông tin liên hệ">
            <InfoRow
              label="Địa chỉ"
              value={residentData.address || "Chưa cập nhật"}
              icon="location-on"
            />

            <InfoRow
              label="Căn hộ số"
              value={
                apartmentData?.apartmentCode ||
                apartmentData?.apartmentNumber ||
                residentData.apartmentId?.toString() ||
                "Chưa được phân bổ"
              }
              icon="home"
              type="highlight"
            />

            {apartmentData && (
              <>
                <InfoRow
                  label="Tòa nhà"
                  value={apartmentData.block || "Không xác định"}
                  icon="business"
                />
                <InfoRow
                  label="Tầng"
                  value={apartmentData.floor?.toString() || "Không xác định"}
                  icon="layers"
                />
                <InfoRow
                  label="Loại căn hộ"
                  value={apartmentData.apartmentType?.name || "Không xác định"}
                  icon="category"
                />
                {apartmentData.area && (
                  <InfoRow
                    label="Diện tích"
                    value={`${apartmentData.area} m²`}
                    icon="square-foot"
                  />
                )}
              </>
            )}
          </ModernCard>
          <ModernCard title="Thông tin khác">
            <InfoRow
              label="Biển số xe"
              value={residentData.licensePlate || "Chưa cập nhật"}
              icon="directions-car"
            />
            <InfoRow
              label="Trạng thái"
              value={
                residentData.status === "active" || residentData.isActive
                  ? "Đang hoạt động"
                  : "Không hoạt động"
              }
              icon="info"
              type={
                residentData.status === "active" || residentData.isActive
                  ? "highlight"
                  : "warning"
              }
            />

            <InfoRow
              label="Ngày tham gia"
              value={formatDate(residentData.createdAt)}
              icon="calendar-today"
            />

            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDate(residentData.updatedAt)}
              icon="update"
            />
          </ModernCard>
          {(residentData.emergencyContact ||
            residentData.emergencyContactName) && (
            <ModernCard title="Liên hệ khẩn cấp">
              <InfoRow
                label="Người liên hệ"
                value={
                  residentData.emergencyContact ||
                  residentData.emergencyContactName
                }
                icon="contact-emergency"
              />

              <InfoRow
                label="Số điện thoại"
                value={
                  residentData.emergencyPhone ||
                  residentData.emergencyContactPhone
                }
                icon="phone-in-talk"
                copyable
              />
            </ModernCard>
          )}
        </View>
      )}
    </ModernScreenWrapper>
  );
}
