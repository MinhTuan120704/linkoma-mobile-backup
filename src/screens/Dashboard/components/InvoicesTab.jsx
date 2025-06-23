import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { List, Card } from "@ant-design/react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { renderEmptyState, renderStatsCard } from "./AdminSharedComponents";
import { tabStyles } from "./AdminTabStyles";

export default function InvoicesTab({
  invoices = [], // Default to empty array if undefined
  tabs,
  refreshing,
  onRefresh,
  handleCreateInvoice,
  handleViewInvoice,
  handleEditInvoice,
  handleDeleteInvoice,
}) {
  return (
    <ScrollView
      style={tabStyles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={tabStyles.headerCard}>
        <Text style={tabStyles.headerTitle}>Quản lý Hóa đơn</Text>
        <Text style={tabStyles.headerSubtitle}>
          Tổng số: {invoices.length} hóa đơn
        </Text>
        {renderStatsCard(
          "Tổng hóa đơn",
          invoices.length,
          tabs[5].color,
          "receipt"
        )}
      </Card>
      <View style={tabStyles.actionContainer}>
        <TouchableOpacity
          style={[tabStyles.addButton, { backgroundColor: tabs[5].color }]}
          onPress={handleCreateInvoice}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={tabStyles.addButtonText}>Thêm hóa đơn</Text>
        </TouchableOpacity>
      </View>
      {invoices.length === 0 ? (
        renderEmptyState(
          "Chưa có hóa đơn nào",
          "Hãy tạo hóa đơn đầu tiên",
          "receipt_long"
        )
      ) : (
        <Card style={tabStyles.listCard}>
          <List>
            {invoices.map((invoice) => (
              <List.Item
                key={invoice.id}
                extra={
                  <View style={tabStyles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.viewButton]}
                      onPress={() => handleViewInvoice(invoice)}
                    >
                      <MaterialIcons name="visibility" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.editButton]}
                      onPress={() => handleEditInvoice(invoice)}
                    >
                      <MaterialIcons name="edit" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[tabStyles.actionButton, tabStyles.deleteButton]}
                      onPress={() => handleDeleteInvoice(invoice.id)}
                    >
                      <MaterialIcons name="delete" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                }
              >
                <View
                  key={`content-${invoice.id}`}
                  style={tabStyles.listItemContent}
                >
                  <MaterialIcons
                    key={`icon-${invoice.id}`}
                    name="receipt"
                    size={18}
                    color={tabs[5].color}
                  />
                  <Text
                    key={`code-${invoice.id}`}
                    style={tabStyles.listItemText}
                  >
                    {invoice.code}
                  </Text>
                </View>
              </List.Item>
            ))}
          </List>
        </Card>
      )}
    </ScrollView>
  );
}
