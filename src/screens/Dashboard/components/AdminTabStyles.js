import { StyleSheet } from "react-native";

export const tabStyles = StyleSheet.create({
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Add padding to avoid bottom navigation
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  actionContainer: {
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  viewButton: {
    backgroundColor: "#17A2B8",
  },
  editButton: {
    backgroundColor: "#FFC107",
  },
  deleteButton: {
    backgroundColor: "#DC3545",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listItemText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
  },
  listItemSubText: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "200",
  },
});
