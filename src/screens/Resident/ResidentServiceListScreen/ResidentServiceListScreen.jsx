import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  ModernScreenWrapper,
  ModernCard,
  ModernButton,
} from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import serviceRegistrationService from "../../../services/serviceRegistrationService";
// Import serviceRegistrationService để thực hiện các chức năng:
// - Lấy danh sách dịch vụ đã đăng ký của cư dân
// - Xem chi tiết dịch vụ
// - Đăng ký dịch vụ mới
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";

export default function ResidentServiceListScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchServices = async () => {
    if (!user) return setLoading(false);
    setLoading(true);
    try {
      // TODO: Call API getServicesByResident(userId) để lấy danh sách dịch vụ đã đăng ký
      // Hiện tại trả về mảng rỗng để test giao diện
      setServices([]);
    } catch (e) {
      console.error("Error fetching services:", e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [user]);

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
      case "active":
        return "#27AE60";
      case "pending":
        return "#F39C12";
      case "suspended":
        return "#E74C3C";
      case "expired":
        return "#95A5A6";
      default:
        return "#7F8C8D";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang sử dụng";
      case "pending":
        return "Chờ kích hoạt";
      case "suspended":
        return "Tạm dừng";
      case "expired":
        return "Đã hết hạn";
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

  const renderServiceItem = (service) => (
    <ModernCard key={service.id} style={{ marginBottom: 12 }}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceIcon}>
          <MaterialIcons
            name={getServiceIcon(service.category)}
            size={24}
            color="#1976D2"
          />
        </View>

        <View style={styles.serviceContent}>
          <Text style={styles.serviceName} numberOfLines={2}>
            {service.name}
          </Text>
          <Text style={styles.serviceDescription} numberOfLines={2}>
            {service.description || "Không có mô tả"}
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
            {formatCurrency(service.amount)}
            {service.billingPeriod &&
              ` /${
                service.billingPeriod === "monthly"
                  ? "tháng"
                  : service.billingPeriod === "yearly"
                  ? "năm"
                  : service.billingPeriod
              }`}
          </Text>
        </View>

        {service.registeredAt && (
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={16} color="#7F8C8D" />
            <Text style={styles.dateText}>
              Đăng ký: {formatDate(service.registeredAt)}
            </Text>
          </View>
        )}

        {service.expiresAt && (
          <View style={styles.detailRow}>
            <MaterialIcons name="event-available" size={16} color="#7F8C8D" />
            <Text style={styles.dateText}>
              Hết hạn: {formatDate(service.expiresAt)}
            </Text>
          </View>
        )}

        {service.category && (
          <View style={styles.detailRow}>
            <MaterialIcons name="category" size={16} color="#7F8C8D" />
            <Text style={styles.categoryText}>{service.category}</Text>
          </View>
        )}
      </View>
    </ModernCard>
  );

  return (
    <ModernScreenWrapper
      title="Dịch vụ đã đăng ký"
      subtitle={`${services.length} dịch vụ`}
      headerColor="#1976D2"
      loading={loading}
      onRefresh={fetchServices}
      rightHeaderComponent={
        <ModernButton
          title="Đăng ký"
          onPress={handleRegister}
          type="outline"
          size="small"
        />
      }
    >
      <View style={styles.container}>
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
