"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TextInput, RefreshControl } from "react-native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { Search } from "react-native-feather"

// Mock data for department statistics
const departmentData = [
  { id: "1", name: "Tikuv", sent: 120, received: 110, efficiency: 92 },
  { id: "2", name: "Ombor", sent: 85, received: 80, efficiency: 94 },
  { id: "3", name: "Bichish", sent: 65, received: 60, efficiency: 92 },
  { id: "4", name: "Qadoqlash", sent: 45, received: 40, efficiency: 89 },
  { id: "5", name: "Dizayn", sent: 30, received: 28, efficiency: 93 },
  { id: "6", name: "Nazorat", sent: 55, received: 50, efficiency: 91 },
  { id: "7", name: "Yuvish", sent: 40, received: 38, efficiency: 95 },
  { id: "8", name: "Dazmollash", sent: 70, received: 65, efficiency: 93 },
  { id: "9", name: "Tugmalar", sent: 25, received: 23, efficiency: 92 },
  { id: "10", name: "Choklar", sent: 60, received: 55, efficiency: 92 },
  { id: "11", name: "Kesish", sent: 50, received: 48, efficiency: 96 },
  { id: "12", name: "Yopishtirish", sent: 35, received: 32, efficiency: 91 },
]

const DepartmentStatsScreen = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [departments, setDepartments] = useState(departmentData)

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false)
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    }, 1500)
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    if (text.trim() === "") {
      setDepartments(departmentData)
    } else {
      const filtered = departmentData.filter((dept) => dept.name.toLowerCase().includes(text.toLowerCase()))
      setDepartments(filtered)
    }
  }

  const renderDepartmentItem = ({ item }: { item: (typeof departmentData)[0] }) => (
    <View style={styles.departmentCard}>
      <View style={styles.departmentHeader}>
        <Text style={styles.departmentName}>{item.name}</Text>
        <View style={styles.efficiencyBadge}>
          <Text style={styles.efficiencyText}>{item.efficiency}%</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.sent}</Text>
          <Text style={styles.statLabel}>Yuborilgan</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.received}</Text>
          <Text style={styles.statLabel}>Qabul qilingan</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.sent - item.received}</Text>
          <Text style={styles.statLabel}>Farq</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.efficiency}%`,
                backgroundColor: getEfficiencyColor(item.efficiency),
              },
            ]}
          />
        </View>
      </View>
    </View>
  )

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "#27ae60"
    if (efficiency >= 90) return "#2ecc71"
    if (efficiency >= 80) return "#f39c12"
    return "#e74c3c"
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bo'limlar statistikasi</Text>
        <Text style={styles.subtitle}>{user?.department} bo'limi</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search width={20} height={20} color="#95a5a6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Bo'lim nomini qidirish..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{departmentData.length}</Text>
          <Text style={styles.summaryLabel}>Jami bo'limlar</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{departmentData.reduce((sum, dept) => sum + dept.sent, 0)}</Text>
          <Text style={styles.summaryLabel}>Jami yuborilgan</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{departmentData.reduce((sum, dept) => sum + dept.received, 0)}</Text>
          <Text style={styles.summaryLabel}>Jami qabul qilingan</Text>
        </View>
      </View>

      <FlatList
        data={departments}
        renderItem={renderDepartmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3498db"]} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 0,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    width: "32%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  departmentCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  departmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  departmentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  efficiencyBadge: {
    backgroundColor: "#3498db",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  efficiencyText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
})

export default DepartmentStatsScreen
