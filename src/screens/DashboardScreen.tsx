import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Platform
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import ItemJourney from "../components/ItemJourney"
import type { ProductTrackingItem } from "../types"
import { 
  ChevronRight, 
  Box, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  AlertTriangle
} from "react-native-feather"

import LinearGradient from "react-native-linear-gradient"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/AppNavigator"

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
  { name: "Kutilmoqda", value: 25, color: "#f39c12", icon: Clock },
  { name: "Qisman", value: 35, color: "#3498db", icon: AlertCircle },
  { name: "Yakunlangan", value: 40, color: "#2ecc71", icon: CheckCircle },
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

type StartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const DashboardScreen = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigation = useNavigation<StartScreenNavigationProp>()
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

  const renderPieChart = () => {
    const total = statusData.reduce((sum, item) => sum + item.value, 0)

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {statusData.map((item, index) => {
            const IconComponent = item.icon
            return (
              <View key={index} style={styles.pieSegmentContainer}>
                <View
                  style={[
                    styles.pieSegment,
                    {
                      backgroundColor: item.color,
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                    },
                  ]}
                >
                  <IconComponent width={24} height={24} color="white" />
                </View>
                <Text style={styles.pieSegmentValue}>{item.value}%</Text>
                <Text style={styles.pieSegmentLabel}>{item.name}</Text>
              </View>
            )
          })}
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
              <Text style={[styles.tableCell, { color: dept.sent - dept.received > 0 ? '#f5365c' : '#2dce89' }]}>
                {dept.sent - dept.received}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("DepartmentStats")}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllButtonText}>Hammasini ko'rish</Text>
          <ChevronRight width={20} height={20} color="#5e72e4" />
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
              <View style={[
                styles.productBadge,
                { backgroundColor: getBadgeColor(product.currentDepartment) }
              ]}>
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

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("ProductTracking")}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllButtonText}>Hammasini ko'rish</Text>
          <ChevronRight width={20} height={20} color="#5e72e4" />
        </TouchableOpacity>
      </View>
    )
  }

  const getBadgeColor = (department: string) => {
    const colors: { [key: string]: string } = {
      "Tikuv": "#5e72e4",
      "Ombor": "#11cdef",
      "Bichish": "#2dce89",
      "Qadoqlash": "#fb6340",
      "Dizayn": "#ffd600",
      "Nazorat": "#8965e0",
      "Yuvish": "#f5365c",
      "Dazmollash": "#172b4d"
    };

    return colors[department] || "#5e72e4";
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5e72e4', '#324cdd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Statistika</Text>
        <Text style={styles.subtitle}>{user?.department.name} bo'limi</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#5e72e4"]}
            tintColor="#5e72e4"
            progressBackgroundColor="#ffffff"
          />
        }
      >
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
            <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(94, 114, 228, 0.1)' }]}>
              <Box width={24} height={24} color="#5e72e4" />
            </View>
            <Text style={styles.summaryValue}>245</Text>
            <Text style={styles.summaryLabel}>Jami yuborilgan</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(45, 206, 137, 0.1)' }]}>
              <CheckCircle width={24} height={24} color="#2dce89" />
            </View>
            <Text style={[styles.summaryValue, { color: '#2dce89' }]}>230</Text>
            <Text style={styles.summaryLabel}>Jami qabul qilingan</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(251, 99, 64, 0.1)' }]}>
              <AlertTriangle width={24} height={24} color="#fb6340" />
            </View>
            <Text style={[styles.summaryValue, { color: '#fb6340' }]}>15</Text>
            <Text style={styles.summaryLabel}>Farq</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(17, 205, 239, 0.1)' }]}>
              <TrendingUp width={24} height={24} color="#11cdef" />
            </View>
            <Text style={[styles.summaryValue, { color: '#11cdef' }]}>94%</Text>
            <Text style={styles.summaryLabel}>Samaradorlik</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Status bo'yicha</Text>
          {renderPieChart()}
        </View>

        {/* <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Bo'limlar bo'yicha</Text>
          {renderDepartmentStats()}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tovar haritasi</Text>
          {renderProductTracking()}
        </View> */}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  timeRangeContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTimeRange: {
    backgroundColor: "#5e72e4",
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8898aa",
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
    borderRadius: 16,
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
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5e72e4",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#8898aa",
    textAlign: "center",
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
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
    color: "#32325d",
    marginBottom: 20,
  },
  barChartContainer: {
    height: 220,
  },
  barChart: {
    flexDirection: "row",
    height: 150,
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  barGroup: {
    alignItems: "center",
  },
  barLabels: {
    marginTop: 8,
  },
  barLabel: {
    fontSize: 12,
    color: "#8898aa",
    fontWeight: "500",
  },
  bars: {
    flexDirection: "row",
    gap: 2,
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
    backgroundColor: "#5e72e4",
  },
  receivedBar: {
    backgroundColor: "#2dce89",
  },
  pieChartContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  pieChart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  pieSegmentContainer: {
    alignItems: "center",
  },
  pieSegment: {
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  pieSegmentValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#32325d",
    marginBottom: 4,
  },
  pieSegmentLabel: {
    fontSize: 12,
    color: "#8898aa",
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#8898aa",
  },
  departmentStatsContainer: {
    marginTop: 10,
  },
  tableContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#5e72e4",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableRowEven: {
    backgroundColor: "#f8f9fe",
  },
  tableRowOdd: {
    backgroundColor: "white",
  },
  tableCell: {
    flex: 1,
    color: "#525f7f",
    textAlign: "center",
    fontSize: 14,
  },
  productTrackingContainer: {
    marginTop: 10,
  },
  productCard: {
    backgroundColor: "#f8f9fe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e6e9f0",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#32325d",
  },
  productBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  productBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  productDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  productDetail: {
    fontSize: 13,
    color: "#525f7f",
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#e6e9f0",
    marginTop: 12,
  },
  viewAllButtonText: {
    fontSize: 16,
    color: "#5e72e4",
    fontWeight: "600",
    marginRight: 8,
  },
  bottomPadding: {
    height: 100,
  }
})

export default DashboardScreen