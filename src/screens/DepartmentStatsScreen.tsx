import { useState, useRef, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Platform
} from "react-native"
import { useToast } from "../context/ToastContext"
import { Search, Users, Package, Filter, CheckCircle, XCircle } from "react-native-feather"
import LinearGradient from "react-native-linear-gradient"
import BottomSheet from "@gorhom/bottom-sheet"
import FilterBottomSheet from "../components/FilterBottomSheet"
import { useAppData } from "../api/categoryData"

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
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [departments, setDepartments] = useState(departmentData)
  const { employeeTypes, colors, sizes } = useAppData()

  // filter
  const [activeFilters, setActiveFilters] = useState({
    color: "",
    size: "",
    employeeType: ""
  })
  const bottomSheetRef = useRef<BottomSheet>(null)


  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showToast({
        type: "success",
        message: "Ma'lumotlar yangilandi",
      })
    }, 1500)
  }



  const handlePresentFilterSheet = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const handleApplyFilter = useCallback((filterValues: any) => {
    let filteredDepartments = [...departmentData]

    // Filter by department name
    if (filterValues.name) {
      filteredDepartments = filteredDepartments.filter(dept =>
        dept.name === filterValues.name
      )
    }

    // Filter by efficiency range
    if (filterValues.efficiencyRange) {
      filteredDepartments = filteredDepartments.filter(dept => {
        const efficiency = dept.efficiency
        switch (filterValues.efficiencyRange) {
          case "90% va yuqori":
            return efficiency >= 90
          case "80-90%":
            return efficiency >= 80 && efficiency < 90
          case "70-80%":
            return efficiency >= 70 && efficiency < 80
          case "70% dan past":
            return efficiency < 70
          default:
            return true
        }
      })
    }

    // Filter by sent range
    if (filterValues.sentRange) {
      filteredDepartments = filteredDepartments.filter(dept => {
        const sent = dept.sent
        switch (filterValues.sentRange) {
          case "100+ dona":
            return sent > 100
          case "50-100 dona":
            return sent >= 50 && sent <= 100
          case "20-50 dona":
            return sent >= 20 && sent < 50
          case "20 donadan kam":
            return sent < 20
          default:
            return true
        }
      })
    }

    // Filter by received range
    if (filterValues.receivedRange) {
      filteredDepartments = filteredDepartments.filter(dept => {
        const received = dept.received
        switch (filterValues.receivedRange) {
          case "100+ dona":
            return received > 100
          case "50-100 dona":
            return received >= 50 && received <= 100
          case "20-50 dona":
            return received >= 20 && received < 50
          case "20 donadan kam":
            return received < 20
          default:
            return true
        }
      })
    }

    setDepartments(filteredDepartments)

    showToast({
      type: "success",
      message: "Filtrlar qo'llanildi",
    })
  }, [showToast])

  const handleResetFilter = useCallback(() => {
    setDepartments(departmentData)
  }, [])

  const renderDepartmentItem = ({ item }: { item: (typeof departmentData)[0] }) => (
    <View style={styles.departmentCard}>
      <View style={styles.departmentHeader}>
        <Text style={styles.departmentName}>{item.name}</Text>
        <View
          style={[
            styles.efficiencyBadge,
            {
              backgroundColor: getEfficiencyColor(item.efficiency),
            },
          ]}
        >
          <Text style={styles.efficiencyText}>{item.efficiency}%</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(94, 114, 228, 0.1)' }]}>
            <Package width={16} height={16} color="#5e72e4" />
          </View>
          <Text style={styles.statValue}>{item.sent}</Text>
          <Text style={styles.statLabel}>Yuborilgan</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(45, 206, 137, 0.1)' }]}>
            <CheckCircle width={16} height={16} color="#2dce89" />
          </View>
          <Text style={[styles.statValue, { color: '#2dce89' }]}>{item.received}</Text>
          <Text style={styles.statLabel}>Qabul qilingan</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(251, 99, 64, 0.1)' }]}>
            <XCircle width={16} height={16} color="#fb6340" />
          </View>
          <Text style={[styles.statValue, { color: '#fb6340' }]}>{item.sent - item.received}</Text>
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
    if (efficiency >= 95) return "#2dce89"
    if (efficiency >= 90) return "#5e72e4"
    if (efficiency >= 80) return "#fb6340"
    return "#f5365c"
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <LinearGradient
        colors={['#5e72e4', '#324cdd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>

          <View>
            <Text style={styles.headerTitle}>Bo'limlar statistikasi</Text>
            <Text style={styles.headerSubtitle}>Barcha bo'limlar faoliyati</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search width={20} height={20} color="#8898aa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Bo'lim nomini qidirish..."
            placeholderTextColor="#8898aa"
            value={searchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handlePresentFilterSheet}
          activeOpacity={0.7}
        >
          <Filter width={18} height={18} color="white" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={departments}
          renderItem={renderDepartmentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(94, 114, 228, 0.1)' }]}>
                  <Users width={20} height={20} color="#5e72e4" />
                </View>
                <Text style={styles.summaryValue}>{departments.length}</Text>
                <Text style={styles.summaryLabel}>Jami bo'limlar</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(45, 206, 137, 0.1)' }]}>
                  <Package width={20} height={20} color="#2dce89" />
                </View>
                <Text style={[styles.summaryValue, { color: '#2dce89' }]}>
                  {departments.reduce((sum, dept) => sum + dept.sent, 0)}
                </Text>
                <Text style={styles.summaryLabel}>Jami yuborilgan</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(17, 205, 239, 0.1)' }]}>
                  <CheckCircle width={20} height={20} color="#11cdef" />
                </View>
                <Text style={[styles.summaryValue, { color: '#11cdef' }]}>
                  {departments.reduce((sum, dept) => sum + dept.received, 0)}
                </Text>
                <Text style={styles.summaryLabel}>Jami qabul</Text>
              </View>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#5e72e4"]}
              tintColor="#5e72e4"
              progressBackgroundColor="#ffffff"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        ref={bottomSheetRef}
        colors={colors || []}
        sizes={sizes || []}
        employeeTypes={employeeTypes || []}
        initialValues={activeFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 30
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
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
    height: 50,
    fontSize: 16,
    color: "#32325d",
  },
  filterButton: {
    backgroundColor: "#5e72e4",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingTop: 16
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: "31%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5e72e4",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#8898aa",
    textAlign: "center",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  departmentCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  departmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  departmentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32325d",
  },
  efficiencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5e72e4",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8898aa",
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