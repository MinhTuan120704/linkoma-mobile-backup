import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernCard,
} from "../../../components";
// Import invoiceService để thực hiện các chức năng:
// - Cập nhật hóa đơn (updateInvoice)
// - Xóa hóa đơn (deleteInvoice)

export default function InvoiceEditScreen({ route, navigation }) {
  const { invoice } = route.params || {};

  const [formData, setFormData] = useState({
    invoiceCode: invoice?.invoiceCode || "",
    apartmentId: invoice?.apartmentId || "",
    residentId: invoice?.residentId || "",
    amount: invoice?.amount?.toString() || "",
    dueDate: invoice?.dueDate || "",
    issueDate: invoice?.issueDate || "",
    status: invoice?.status || "pending",
    description: invoice?.description || "",
    serviceType: invoice?.serviceType || "",
    period: invoice?.period || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.invoiceCode.trim()) {
      newErrors.invoiceCode = "Mã hóa đơn không được để trống";
    }

    if (!formData.apartmentId.trim()) {
      newErrors.apartmentId = "Căn hộ không được để trống";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Số tiền không được để trống";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Số tiền phải là số hợp lệ và lớn hơn 0";
    }

    if (!formData.dueDate.trim()) {
      newErrors.dueDate = "Ngày đến hạn không được để trống";
    }

    if (!formData.issueDate.trim()) {
      newErrors.issueDate = "Ngày phát hành không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      // TODO: Call API updateInvoice(id, data) để cập nhật hóa đơn
      Alert.alert("Thành công", "Cập nhật hóa đơn thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating invoice:", error);
      Alert.alert("Lỗi", "Không thể cập nhật hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa hóa đơn này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            // TODO: Call API deleteInvoice(id) để xóa hóa đơn
            Alert.alert("Thành công", "Xóa hóa đơn thành công", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            console.error("Error deleting invoice:", error);
            Alert.alert("Lỗi", "Không thể xóa hóa đơn");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <ModernScreenWrapper
      title="Chỉnh sửa hóa đơn"
      subtitle="Cập nhật thông tin hóa đơn"
      headerColor="#2C3E50"
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ModernCard title="Thông tin hóa đơn">
          <ModernFormInput
            label="Mã hóa đơn"
            value={formData.invoiceCode}
            onChangeText={(value) => updateField("invoiceCode", value)}
            placeholder="Nhập mã hóa đơn"
            icon="receipt"
            error={errors.invoiceCode}
          />

          <ModernFormInput
            label="ID Căn hộ"
            value={formData.apartmentId}
            onChangeText={(value) => updateField("apartmentId", value)}
            placeholder="Nhập ID căn hộ"
            icon="home"
            error={errors.apartmentId}
          />

          <ModernFormInput
            label="ID Cư dân"
            value={formData.residentId}
            onChangeText={(value) => updateField("residentId", value)}
            placeholder="Nhập ID cư dân"
            icon="person"
          />
        </ModernCard>

        <ModernCard title="Thông tin dịch vụ">
          <ModernFormInput
            label="Loại dịch vụ"
            value={formData.serviceType}
            onChangeText={(value) => updateField("serviceType", value)}
            placeholder="Ví dụ: Điện, nước, internet..."
            icon="build"
          />

          <ModernFormInput
            label="Kỳ thanh toán"
            value={formData.period}
            onChangeText={(value) => updateField("period", value)}
            placeholder="Ví dụ: Tháng 12/2024"
            icon="date_range"
          />

          <ModernFormInput
            label="Mô tả"
            value={formData.description}
            onChangeText={(value) => updateField("description", value)}
            placeholder="Mô tả chi tiết về hóa đơn"
            icon="description"
            multiline
          />
        </ModernCard>

        <ModernCard title="Thông tin thanh toán">
          <ModernFormInput
            label="Số tiền (VNĐ)"
            value={formData.amount}
            onChangeText={(value) => updateField("amount", value)}
            placeholder="Nhập số tiền"
            icon="attach_money"
            keyboardType="numeric"
            error={errors.amount}
          />

          <ModernFormInput
            label="Ngày phát hành"
            value={formData.issueDate}
            onChangeText={(value) => updateField("issueDate", value)}
            placeholder="DD/MM/YYYY"
            icon="today"
            error={errors.issueDate}
          />

          <ModernFormInput
            label="Ngày đến hạn"
            value={formData.dueDate}
            onChangeText={(value) => updateField("dueDate", value)}
            placeholder="DD/MM/YYYY"
            icon="schedule"
            error={errors.dueDate}
          />
        </ModernCard>

        <View style={{ marginTop: 20, gap: 12, paddingBottom: 20 }}>
          <ModernButton
            title="Cập nhật hóa đơn"
            onPress={handleUpdate}
            loading={loading}
            icon="save"
          />

          <ModernButton
            title="Xóa hóa đơn"
            onPress={handleDelete}
            variant="danger"
            icon="delete"
          />
        </View>
      </ScrollView>
    </ModernScreenWrapper>
  );
}
