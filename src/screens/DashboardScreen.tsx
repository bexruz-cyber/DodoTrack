"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import ItemJourney from "../components/ItemJourney"
import type { ProductTrackingItem } from "../types"
import { ChevronRight } from "react-native-feather"

// Mock data for charts
const departmentData = [
  { name: "Tikuv", sent: 120, received: 110 },
  { name: "Ombor", sent: 85, received: 80 },
  { name: "Bichish", sent: 65, received: 60 },
  { name: "Qadoqlash", sent: 45, received: 40 },
  { name: "Dizayn", sent: 30, received: 28 },
  { name: "Nazorat", sent: 55, received: 50 },
  { name: "Yuvish", sent: 40, received: 38 },
  { name: "Dazmollash", sent: 70, received: 65 },
]

const statusData = [
  { name: "Kutilmoqda", value: 25, color: "#f39c12" },
  { name: "Qisman", value: 35, color: "#3498db" },
  { name: "Yakunlangan", value: 40, color: "#2ecc71" },
]

const monthlyData = [
  { month: "Yan", sent: 45, received: 40 },
  { month: "Fev", sent: 50, received: 45 },
  { month: "Mar", sent: 60, received: 55 },
  { month: "Apr", sent: 70, received: 65 },
  { month: "May", sent: 80, received: 75 },
  { month: "Iyn", sent: 90, received: 85 },
]

// Mock data for product tracking with more items
const productTrackingData: ProductTrackingItem[] = [
  {
    id: "1",
    model: "Model A",
    materialType: "Paxta",
    color: "Ko'k",
    size: "M",
    currentDepartment: "Tikuv",
    journey: [
      { department: "Ombor", date: "2023-05-10", status: "completed" },
      { department: "Bichish", date: "2023-05-12", status: "completed" },
      { department: "Tikuv", date: "2023-05-15", status: "current" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
  {
    id: "2",
    model: "Model B",
    materialType: "Ipak",
    color: "Qizil",
    size: "L",
    currentDepartment: "Bichish",
    journey: [
      { department: "Ombor", date: "2023-05-14", status: "completed" },
      { department: "Bichish", date: "2023-05-16", status: "current" },
      { department: "Tikuv", date: "", status: "pending" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
  {
    id: "3",
    model: "Model C",
    materialType: "Jun",
    color: "Qora",
    size: "XL",
    currentDepartment: "Qadoqlash",
    journey: [
      { department: "Ombor", date: "2023-05-11", status: "completed" },
      { department: "Bichish", date: "2023-05-13", status: "completed" },
      { department: "Tikuv", date: "2023-05-15", status: "completed" },
      { department: "Qadoqlash", date: "2023-05-17", status: "current" },
    ],
  },
  {
    id: "4",
    model: "Model D",
    materialType: "Paxta",
    color: "Yashil",
    size: "S",
    currentDepartment: "Bichish",
    journey: [
      { department: "Ombor", date: "2023-05-18", status: "completed" },
      { department: "Bichish", date: "2023-05-20", status: "current" },
      { department: "Tikuv", date: "", status: "pending" },
    ],
  },
  {
    id: "5",
    model: "Model A",
    materialType: "Sintetika",
    color: "Ko'k",
    size: "XL",
    currentDepartment: "Ombor",
    journey: [
      { department: "Tikuv", date: "2023-05-15", status: "completed" },
      { department: "Qadoqlash", date: "2023-05-17", status: "completed" },
      { department: "Ombor", date: "2023-05-19", status: "current" },
    ],
  },
  {
    id: "6",
    model: "Model B",
    materialType: "Jun",
    color: "Qora",
    size: "M",
    currentDepartment: "Tikuv",
    journey: [
      { department: "Ombor", date: "2023-05-12", status: "completed" },
      { department: "Bichish", date: "2023-05-14", status: "completed" },
      { department: "Tikuv", date: "2023-05-16", status: "current" },
      { department: "Qadoqlash", date: "", status: "pending" },
    ],
  },
]

const { width } = Dimensions.get("window")
const barWidth = (width - 64) / monthlyData.length - 10

const DashboardScreen = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigation = useNavigation()
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("month")
  const [refreshing, setRefreshing] = useState(false)

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

  const renderBarChart = () => {
    const maxValue = Math.max(...monthlyData.map((item) => Math.max(item.sent, item.received)))

    return (
      <View style={styles.barChartContainer}>
        <View style={styles.barChart}>
          {monthlyData.map((item, index) => (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barLabels}>
                <Text style={styles.barLabel}>{item.month}</Text>
              </View>
              <View style={styles.bars}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      styles.sentBar,
                      {
                        height: (item.sent / maxValue) * 150,
                        width: barWidth / 2 - 2,
                      },
                    ]}
                  />
                </View>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      styles.receivedBar,
                      {
                        height: (item.received / maxValue) * 150,
                        width: barWidth / 2 - 2,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#3498db" }]} />
            <Text style={styles.legendText}>Yuborilgan</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#2ecc71" }]} />
            <Text style={styles.legendText}>Qabul qilingan</Text>
          </View>
        </View>
      </View>
    )
  }

  const renderPieChart = () => {
    const total = statusData.reduce((sum, item) => sum + item.value, 0)
    let startAngle = 0

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {statusData.map((item, index) => {
            const angle = (item.value / total) * 360
            const endAngle = startAngle + angle

            // This is a simplified representation since React Native doesn't have native pie charts
            // In a real app, you would use a library like react-native-svg or victory-native
            const segment = (
              <View
                key={index}
                style={[
                  styles.pieSegment,
                  {
                    backgroundColor: item.color,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    margin: 5,
                  },
                ]}
              />
            )

            startAngle = endAngle
            return segment
          })}
        </View>
        <View style={styles.chartLegend}>
          {statusData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.name}: {item.value}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  const renderDepartmentStats = () => {
    // Only show the first 5 departments
    const displayDepartments = departmentData.slice(0, 5)

    return (
      <View style={styles.departmentStatsContainer}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Bo'lim</Text>
            <Text style={styles.tableHeaderCell}>Yuborilgan</Text>
            <Text style={styles.tableHeaderCell}>Qabul qilingan</Text>
            <Text style={styles.tableHeaderCell}>Farq</Text>
          </View>
          {displayDepartments.map((dept, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{dept.name}</Text>
              <Text style={styles.tableCell}>{dept.sent}</Text>
              <Text style={styles.tableCell}>{dept.received}</Text>
              <Text style={styles.tableCell}>{dept.sent - dept.received}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("DepartmentStats" as never)}>
          <Text style={styles.viewAllButtonText}>Hammasini ko'rish</Text>
          <ChevronRight width={20} height={20} color="#3498db" />
        </TouchableOpacity>
      </View>
    )
  }

  const renderProductTracking = () => {
    // Only show the last 3 items
    const displayItems = productTrackingData.slice(0, 3)

    return (
      <View style={styles.productTrackingContainer}>
        {displayItems.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productHeader}>
              <Text style={styles.productTitle}>{product.model}</Text>
              <View style={styles.productBadge}>
                <Text style={styles.productBadgeText}>{product.currentDepartment}</Text>
              </View>
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productDetail}>Mato: {product.materialType}</Text>
              <Text style={styles.productDetail}>Rang: {product.color}</Text>
              <Text style={styles.productDetail}>O'lcham: {product.size}</Text>
            </View>
            <ItemJourney steps={product.journey} />
          </View>
        ))}

        <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("ProductTracking" as never)}>
          <Text style={styles.viewAllButtonText}>Hammasini ko'rish</Text>
          <ChevronRight width={20} height={20} color="#3498db" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3498db"]} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Statistika</Text>
        <Text style={styles.subtitle}>{user?.department} bo'limi</Text>
      </View>

      <View style={styles.timeRangeContainer}>
        <TouchableOpacity
          style={[styles.timeRangeButton, timeRange === "day" && styles.activeTimeRange]}
          onPress={() => setTimeRange("day")}
        >
          <Text style={[styles.timeRangeText, timeRange === "day" && styles.activeTimeRangeText]}>Kun</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeRangeButton, timeRange === "week" && styles.activeTimeRange]}
          onPress={() => setTimeRange("week")}
        >
          <Text style={[styles.timeRangeText, timeRange === "week" && styles.activeTimeRangeText]}>Hafta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeRangeButton, timeRange === "month" && styles.activeTimeRange]}
          onPress={() => setTimeRange("month")}
        >
          <Text style={[styles.timeRangeText, timeRange === "month" && styles.activeTimeRangeText]}>Oy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeRangeButton, timeRange === "year" && styles.activeTimeRange]}
          onPress={() => setTimeRange("year")}
        >
          <Text style={[styles.timeRangeText, timeRange === "year" && styles.activeTimeRangeText]}>Yil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>245</Text>
          <Text style={styles.summaryLabel}>Jami yuborilgan</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>230</Text>
          <Text style={styles.summaryLabel}>Jami qabul qilingan</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>15</Text>
          <Text style={styles.summaryLabel}>Farq</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>94%</Text>
          <Text style={styles.summaryLabel}>Samaradorlik</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Oylik statistika</Text>
        {renderBarChart()}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Status bo'yicha</Text>
        {renderPieChart()}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Bo'limlar bo'yicha</Text>
        {renderDepartmentStats()}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Tovar haritasi</Text>
        {renderProductTracking()}
        <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("ProductTracking" as never)}>
          <Text style={styles.viewAllButtonText}>Hammasini ko'rish</Text>
          <ChevronRight width={20} height={20} color="#3498db" />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  timeRangeContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTimeRange: {
    backgroundColor: "#3498db",
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  activeTimeRangeText: {
    color: "white",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  barChartContainer: {
    height: 200,
  },
  barChart: {
    flexDirection: "row",
    height: 150,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barGroup: {
    alignItems: "center",
  },
  barLabels: {
    marginTop: 8,
  },
  barLabel: {
    fontSize: 12,
    color: "#666",
  },
  bars: {
    flexDirection: "row",
  },
  barContainer: {
    alignItems: "center",
  },
  bar: {
    width: 15,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  sentBar: {
    backgroundColor: "#3498db",
  },
  receivedBar: {
    backgroundColor: "#2ecc71",
  },
  pieChartContainer: {
    alignItems: "center",
  },
  pieChart: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  pieSegment: {
    // In a real app, you would use SVG to create actual pie segments
  },
  chartLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  departmentStatsContainer: {
    marginTop: 10,
  },
  tableContainer: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRowEven: {
    backgroundColor: "#f5f5f5",
  },
  tableRowOdd: {
    backgroundColor: "white",
  },
  tableCell: {
    flex: 1,
    color: "#333",
    textAlign: "center",
  },
  productTrackingContainer: {
    marginTop: 10,
  },
  productCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productBadge: {
    backgroundColor: "#3498db",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  productDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  productDetail: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
    marginBottom: 4,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 8,
  },
  viewAllButtonText: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "500",
    marginRight: 8,
  },
})

export default DashboardScreen
