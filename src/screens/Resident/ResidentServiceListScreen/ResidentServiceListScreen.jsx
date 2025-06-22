import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  ModernButton,
  ModernPicker,
} from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import serviceRegistrationService from "../../../services/serviceRegistrationService";
import serviceTypeService from "../../../services/serviceTypeService";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export default function ResidentServiceListScreen() {
  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTypeParams, setServiceTypeParams] = useState({
    serviceName: "",
    unit: "",
    minUnitPrice: null,
    maxUnitPrice: null,
    sortBy: "serviceName:asc",
    limit: 50,
    page: 1,
  });
  const [serviceTypePagination, setServiceTypePagination] = useState({
    page: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 50,
  });
  const [loading, setLoading] = useState(true);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 10,
  });

  const [params, setParams] = useState({
    apartmentId: user?.apartmentId || null,
    serviceTypeId: null,
    status: "Active",
    startDate: null,
    endDate: null,
    sortBy: "startDate:desc",
    limit: 10,
    page: 1,
  });

  // Xử lý khi thay đổi trạng thái filter
  const handleFilterChange = (filterName, value) => {
    setParams((prev) => ({ ...prev, [filterName]: value, page: 1 }));
  };

  // Xử lý khi chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Xử lý khi thay đổi số lượng item mỗi trang
  const handleLimitChange = (newLimit) => {
    setParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Xử lý khi thay đổi sắp xếp
  const handleSortChange = (sortField, sortDirection) => {
    setParams((prev) => ({
      ...prev,
      sortBy: `${sortField}:${sortDirection}`,
      page: 1,
    }));
  };
  const fetchServiceTypes = async () => {
    setLoadingServiceTypes(true);
    try {
      // Build query params for service types
      const queryParams = new URLSearchParams();
      if (serviceTypeParams.serviceName)
        queryParams.append("serviceName", serviceTypeParams.serviceName);
      if (serviceTypeParams.unit)
        queryParams.append("unit", serviceTypeParams.unit);
      if (serviceTypeParams.minUnitPrice)
        queryParams.append("minUnitPrice", serviceTypeParams.minUnitPrice);
      if (serviceTypeParams.maxUnitPrice)
        queryParams.append("maxUnitPrice", serviceTypeParams.maxUnitPrice);
      if (serviceTypeParams.sortBy)
        queryParams.append("sortBy", serviceTypeParams.sortBy);
      if (serviceTypeParams.limit)
        queryParams.append("limit", serviceTypeParams.limit);
      if (serviceTypeParams.page)
        queryParams.append("page", serviceTypeParams.page);

      const response = await serviceTypeService.getAllServiceTypes(queryParams);

      if (response.success && response.data) {
        console.log("Service Types response:", response.data.results);
        setServiceTypes(response.data.results || []);
        setServiceTypePagination({
          page: response.data.page || 1,
          totalPages: response.data.totalPages || 1,
          totalResults: response.data.totalResults || 0,
          limit: response.data.limit || serviceTypeParams.limit,
        });
      } else {
        setServiceTypes([]);
      }
    } catch (e) {
      console.log("Error fetching service types:", e);
      Alert.alert("Lỗi", "Không thể tải danh sách loại dịch vụ");
      setServiceTypes([]);
    } finally {
      setLoadingServiceTypes(false);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, [serviceTypeParams]); // Re-fetch when params change

  // Effect để cập nhật apartmentId khi user thay đổi
  useEffect(() => {
    if (user?.apartmentId) {
      setParams((prev) => ({ ...prev, apartmentId: user.apartmentId }));
    }
  }, [user]);

  const fetchServices = async () => {
    if (!user) return setLoading(false);
    setLoading(true);
    try {
      // Xây dựng query params
      const queryParams = new URLSearchParams();

      // Chỉ thêm các params có giá trị
      if (params.apartmentId)
        queryParams.append("apartmentId", params.apartmentId);
      if (params.serviceTypeId)
        queryParams.append("serviceTypeId", params.serviceTypeId);
      if (params.status) queryParams.append("status", params.status);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.page) queryParams.append("page", params.page);
      const response =
        await serviceRegistrationService.getAllServiceRegistrations(
          queryParams
        );
      console.log("Service Registrations response:", response.data.results);

      if (response.data) {
        setServices(response.data.results || []);
        setPagination({
          page: response.data.page || 1,
          totalPages: response.data.totalPages || 1,
          totalResults: response.data.totalResults || 0,
          limit: response.data.limit || 10,
        });
      } else {
        setServices([]);
        setPagination({
          page: 1,
          totalPages: 1,
          totalResults: 0,
          limit: 10,
        });
      }
    } catch (e) {
      console.log("Error fetching services:", e);
      Alert.alert("Lỗi", "Không thể tải danh sách dịch vụ");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServices();
  }, [user, params]); // Re-fetch khi params thay đổi

  const handleRegister = () => navigation.navigate("ResidentServiceRegister");

  const getServiceIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "cleaning":
        return "cleaning-services";
      case "maintenance":
        return "build";
      case "security":
        return "security";
      case "parking":
        return "local-parking";
      case "utilities":
        return "electrical-services";
      case "internet":
        return "wifi";
      default:
        return "room-service";
    }
  };
  const getServiceColor = (status) => {
    switch (status) {
      case "Active":
        return "#27AE60";
      case "Inactive":
        return "#E74C3C";
      case "Cancelled":
        return "#95A5A6";
      case "Rejected":
        return "#F39C12";
      default:
        return "#7F8C8D";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Active":
        return "Đang sử dụng";
      case "Inactive":
        return "Không hoạt động";
      case "Cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const renderEmptyState = () => (
    <ModernCard>
      <View style={styles.emptyState}>
        <MaterialIcons name="room-service" size={64} color="#BDC3C7" />
        <Text style={styles.emptyTitle}>Chưa đăng ký dịch vụ</Text>
        <Text style={styles.emptySubtitle}>
          Bạn chưa đăng ký dịch vụ nào. Hãy đăng ký dịch vụ để tận hưởng tiện
          ích!
        </Text>
        <ModernButton
          title="Đăng ký dịch vụ mới"
          onPress={handleRegister}
          icon="add"
          style={{ marginTop: 16 }}
        />
      </View>
    </ModernCard>
  );
  const renderServiceItem = (service) => {
    const serviceType = serviceTypes.find(
      (type) => type.serviceTypeId === service.serviceTypeId
    );

    return (
      <ModernCard
        key={service.serviceRegistrationId}
        style={{ marginBottom: 12 }}
      >
        <View style={styles.serviceHeader}>
          <View style={styles.serviceIcon}>
            <MaterialIcons
              name={getServiceIcon(serviceType?.category || "default")}
              size={24}
              color="#1976D2"
            />
          </View>

          <View style={styles.serviceContent}>
            <Text style={styles.serviceName} numberOfLines={2}>
              {serviceType?.serviceName || "Dịch vụ không xác định"}
            </Text>
            <Text style={styles.serviceDescription} numberOfLines={2}>
              {service.note || "Không có ghi chú"}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getServiceColor(service.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(service.status)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.serviceDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="attach-money" size={16} color="#27AE60" />
            <Text style={styles.priceText}>
              {formatCurrency(serviceType?.unitPrice || 0)}
              {serviceType?.unit ? ` /${serviceType.unit}` : ""}
            </Text>
          </View>

          {service.startDate && (
            <View style={styles.detailRow}>
              <MaterialIcons name="event" size={16} color="#7F8C8D" />
              <Text style={styles.dateText}>
                Bắt đầu: {formatDate(service.startDate)}
              </Text>
            </View>
          )}

          {service.endDate && (
            <View style={styles.detailRow}>
              <MaterialIcons name="event-available" size={16} color="#7F8C8D" />
              <Text style={styles.dateText}>
                Kết thúc: {formatDate(service.endDate)}
              </Text>
            </View>
          )}

          {serviceType?.unit && (
            <View style={styles.detailRow}>
              <MaterialIcons name="straighten" size={16} color="#7F8C8D" />
              <Text style={styles.categoryText}>
                Đơn vị: {serviceType.unit}
              </Text>
            </View>
          )}

          {serviceType?.category && (
            <View style={styles.detailRow}>
              <MaterialIcons name="category" size={16} color="#7F8C8D" />
              <Text style={styles.categoryText}>
                Loại: {serviceType.category}
              </Text>
            </View>
          )}
        </View>
      </ModernCard>
    );
  };

  return (
    <ModernScreenWrapper
      title="Dịch vụ đã đăng ký"
      subtitle={`${pagination.totalResults} dịch vụ`}
      headerColor="#1976D2"
      loading={loading}
      onRefresh={fetchServices}
      rightHeaderComponent={
        <ModernButton
          title="Đăng ký"
          onPress={handleRegister}
          type="secondary"
          size="small"
        />
      }
    >
      <View style={styles.container}>
        {/* Filter Controls */}
        <ModernCard style={styles.filterCard}>
          <View style={styles.filterRow}>
            <ModernPicker
              label="Trạng thái"
              value={params.status}
              onValueChange={(value) => handleFilterChange("status", value)}
              items={[
                { label: "Đang hoạt động", value: "Active" },
                { label: "Không hoạt động", value: "Inactive" },
                { label: "Đã hủy", value: "Cancelled" },
              ]}
              placeholder="Chọn trạng thái"
              icon="filter-list"
            />
          </View>

          <View style={styles.filterRow}>
            <ModernPicker
              label="Loại dịch vụ"
              value={params.serviceTypeId}
              onValueChange={(value) =>
                handleFilterChange("serviceTypeId", value)
              }
              items={[
                { label: "Tất cả", value: null },
                ...(serviceTypes?.map((type) => ({
                  label: `${type.serviceName} (${type.unit} - ${formatCurrency(
                    type.unitPrice
                  )})`,
                  value: type.serviceTypeId,
                })) || []),
              ]}
              placeholder="Chọn loại dịch vụ"
              icon="category"
              disabled={loadingServiceTypes}
            />
          </View>

          <View style={styles.filterRow}>
            <ModernPicker
              label="Sắp xếp theo"
              value={params.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
              items={[
                { label: "Ngày bắt đầu (Mới nhất)", value: "startDate:desc" },
                { label: "Ngày bắt đầu (Cũ nhất)", value: "startDate:asc" },
                { label: "Ngày kết thúc (Mới nhất)", value: "endDate:desc" },
                { label: "Ngày kết thúc (Cũ nhất)", value: "endDate:asc" },
              ]}
              placeholder="Chọn cách sắp xếp"
              icon="sort"
            />
          </View>
        </ModernCard>

        {services.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <ModernButton
              title="Đăng ký dịch vụ mới"
              onPress={handleRegister}
              icon="add"
              fullWidth
              style={{ marginBottom: 20 }}
            />
            {services.map(renderServiceItem)}
            {/* Pagination Controls */}
            <View style={styles.paginationContainer}>
              <ModernButton
                title="Trước"
                onPress={() => handlePageChange(params.page - 1)}
                disabled={params.page <= 1}
                type="secondary"
                size="small"
              />
              <Text style={styles.paginationText}>
                Trang {params.page} / {pagination.totalPages}
              </Text>
              <ModernButton
                title="Sau"
                onPress={() => handlePageChange(params.page + 1)}
                disabled={params.page >= pagination.totalPages}
                type="secondary"
                size="small"
              />
            </View>
            {/* Items per page selector */}
            <View style={styles.limitContainer}>
              <Text style={styles.limitText}>Số lượng mỗi trang:</Text>
              <ModernPicker
                value={params.limit.toString()}
                onValueChange={(value) => handleLimitChange(parseInt(value))}
                items={[
                  { label: "10 dịch vụ", value: "10" },
                  { label: "20 dịch vụ", value: "20" },
                  { label: "50 dịch vụ", value: "50" },
                ]}
                placeholder="Số lượng hiển thị"
                icon="format-list-numbered"
                style={styles.limitPicker}
              />
            </View>
          </>
        )}
      </View>
    </ModernScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  filterCard: {
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },
  paginationText: {
    fontSize: 14,
    color: "#2C3E50",
  },
  limitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 12,
    gap: 8,
  },
  limitText: {
    fontSize: 14,
    color: "#2C3E50",
  },
  limitPicker: {
    width: 80,
    height: 80,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 24,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  serviceDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#27AE60",
  },
  dateText: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  categoryText: {
    fontSize: 14,
    color: "#7F8C8D",
    textTransform: "capitalize",
  },
});
