import React, { useState } from "react";
import { Alert, View } from "react-native";
import {
  ModernScreenWrapper,
  ModernFormInput,
  ModernButton,
  ModernDateTimePicker,
} from "../../../components";
import invoiceService from "../../../services/invoiceService";

export default function InvoiceCreateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    apartmentId: "",
    rentFee: "",
    serviceFee: "",
    dueDate: "",
    status: "Unpaid", // Enum: Unpaid, Paid, Overdue
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.apartmentId.trim()) {
      newErrors.apartmentId = "ID căn hộ là bắt buộc";
    }

    if (!formData.rentFee.trim()) {
      newErrors.rentFee = "Phí thuê là bắt buộc";
    }

    if (!formData.serviceFee.trim()) {
      newErrors.serviceFee = "Phí dịch vụ là bắt buộc";
    }

    if (!formData.dueDate.trim()) {
      newErrors.dueDate = "Hạn thanh toán là bắt buộc";
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
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount),
        apartmentId: formData.apartmentId || null,
      };

      const response = await invoiceService.createInvoice(invoiceData);
      if (response.success) {
        Alert.alert("Thành công", "Tạo hóa đơn thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tạo hóa đơn. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.log("Error creating invoice:", error);
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
          icon="attach-money"
          keyboardType="numeric"
          required
          error={errors.amount}
        />
        <ModernDateTimePicker
          label="Hạn thanh toán"
          value={formData.dueDate ? new Date(formData.dueDate) : null}
          onChange={(date) => updateField("dueDate", date.toISOString())}
          icon="schedule"
          minimumDate={new Date()}
          error={errors.dueDate}
          required
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
            icon="receipt-long"
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
