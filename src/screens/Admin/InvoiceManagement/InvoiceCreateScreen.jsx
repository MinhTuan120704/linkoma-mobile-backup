import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
} from "../../../components";
// Import invoiceService để thực hiện chức năng:
// - Tạo hóa đơn mới (createInvoice)

export default function InvoiceCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    amount: "",
    dueDate: "",
    description: "",
    apartmentId: "",
    status: "pending",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Mã hóa đơn là bắt buộc";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Số tiền là bắt buộc";
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
      await createInvoice(formData);
      Alert.alert("Thành công", "Tạo hóa đơn thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo hóa đơn. Vui lòng thử lại.");
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
      title="Tạo hóa đơn mới"
      subtitle="Nhập thông tin hóa đơn"
      headerColor="#2C3E50"
    >
      <View style={{ paddingBottom: 20 }}>
        <ModernFormInput
          label="Mã hóa đơn"
          value={formData.code}
          onChangeText={(value) => updateField("code", value)}
          placeholder="Nhập mã hóa đơn"
          icon="receipt"
          required
          error={errors.code}
        />

        <ModernFormInput
          label="Tiêu đề hóa đơn"
          value={formData.title}
          onChangeText={(value) => updateField("title", value)}
          placeholder="Nhập tiêu đề hóa đơn"
          icon="title"
          required
          error={errors.title}
        />

        <ModernFormInput
          label="Số tiền"
          value={formData.amount}
          onChangeText={(value) => updateField("amount", value)}
          placeholder="Nhập số tiền"
          icon="attach_money"
          keyboardType="numeric"
          required
          error={errors.amount}
        />

        <ModernFormInput
          label="Hạn thanh toán"
          value={formData.dueDate}
          onChangeText={(value) => updateField("dueDate", value)}
          placeholder="DD/MM/YYYY"
          icon="schedule"
          error={errors.dueDate}
        />

        <ModernFormInput
          label="Căn hộ"
          value={formData.apartmentId}
          onChangeText={(value) => updateField("apartmentId", value)}
          placeholder="Nhập ID căn hộ"
          icon="home"
          error={errors.apartmentId}
        />

        <ModernFormInput
          label="Trạng thái"
          value={formData.status}
          onChangeText={(value) => updateField("status", value)}
          placeholder="pending/paid/overdue"
          icon="assignment"
          error={errors.status}
        />

        <ModernFormInput
          label="Mô tả"
          value={formData.description}
          onChangeText={(value) => updateField("description", value)}
          placeholder="Nhập mô tả hóa đơn"
          icon="description"
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <View style={{ marginTop: 20, gap: 12 }}>
          <ModernButton
            title="Tạo hóa đơn"
            onPress={handleSubmit}
            loading={loading}
            icon="receipt"
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
